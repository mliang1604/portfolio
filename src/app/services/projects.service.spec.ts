import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProjectsService } from './projects.service';
import { GitHubService } from './github.service';
import { GitHubRepo } from '../models/github.projects';

function makeRepo(overrides: Partial<GitHubRepo>): GitHubRepo {
  return new GitHubRepo({
    id: 1,
    name: 'repo',
    full_name: 'mliang1604/repo',
    description: null,
    html_url: '',
    language: null,
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    topics: [],
    readmeContent: null,
    ...overrides
  });
}

describe('ProjectsService', () => {
  const mineRepos: GitHubRepo[] = [
    makeRepo({ id: 1, name: 'alg-one', topics: ['algorithms'] }),
    makeRepo({ id: 2, name: 'edu-one', topics: ['education'] }),
    makeRepo({ id: 3, name: 'misc-one', topics: ['misc'] }),
    makeRepo({ id: 4, name: 'misc-two', topics: null })
  ];

  const varianRepos: GitHubRepo[] = [
    makeRepo({ id: 10, name: 'VelocityEngine', topics: ['simulation'] }),
    makeRepo({ id: 11, name: 'SegInt-Research', topics: ['research'] }),
    makeRepo({ id: 12, name: 'NotMine', topics: ['other'] })
  ];

  let githubStub: jasmine.SpyObj<GitHubService>;

  beforeEach(() => {
    githubStub = jasmine.createSpyObj<GitHubService>('GitHubService', [
      'getPublicRepos',
      'getRepoReadme'
    ]);
    githubStub.getPublicRepos.and.callFake((user: string) => {
      if (user === 'mliang1604') return of(mineRepos);
      if (user === 'varianAPIs') return of(varianRepos);
      return of([]);
    });
    githubStub.getRepoReadme.and.callFake((_user: string, repo: string) =>
      of(`# ${repo}\nbody`)
    );

    TestBed.configureTestingModule({
      providers: [
        ProjectsService,
        { provide: GitHubService, useValue: githubStub }
      ]
    });
  });

  it('is created and triggers two getPublicRepos calls (own + varian)', () => {
    const service = TestBed.inject(ProjectsService);
    expect(service).toBeTruthy();
    expect(githubStub.getPublicRepos).toHaveBeenCalledWith('mliang1604');
    expect(githubStub.getPublicRepos).toHaveBeenCalledWith('varianAPIs');
  });

  it('populates repositories signal with the owner repos', () => {
    const service = TestBed.inject(ProjectsService);
    const repos = service.repositories();
    expect(repos.length).toBe(mineRepos.length);
    expect(repos.every((r) => 'readmeContent' in r)).toBeTrue();
  });

  it('attaches readme content via forkJoin', () => {
    const service = TestBed.inject(ProjectsService);
    const repos = service.repositories();
    const algRepo = repos.find((r) => r.name === 'alg-one');
    expect(algRepo?.readmeContent).toBe('# alg-one\nbody');
    expect(githubStub.getRepoReadme).toHaveBeenCalledWith('mliang1604', 'alg-one');
  });

  it('sets loadSignal true once the owner readme batch completes', () => {
    const service = TestBed.inject(ProjectsService);
    expect(service.loadSignal()).toBeTrue();
  });

  describe('classification signals', () => {
    it('groups repos with the "algorithms" topic into algProjects', () => {
      const service = TestBed.inject(ProjectsService);
      expect(service.algProjects().map((r) => r.name)).toEqual(['alg-one']);
    });

    it('groups repos with the "education" topic into eduProjects', () => {
      const service = TestBed.inject(ProjectsService);
      expect(service.eduProjects().map((r) => r.name)).toEqual(['edu-one']);
    });

    it('places repos without algorithms/education topics into miscProjects', () => {
      const service = TestBed.inject(ProjectsService);
      const names = service.miscProjects().map((r) => r.name);
      expect(names).toContain('misc-one');
      expect(names).toContain('misc-two');
      expect(names).not.toContain('alg-one');
      expect(names).not.toContain('edu-one');
    });

    it('treats a null topics array as belonging to miscProjects', () => {
      const service = TestBed.inject(ProjectsService);
      const names = service.miscProjects().map((r) => r.name);
      expect(names).toContain('misc-two');
    });

    it('limits openProjects to repos listed in MY_CONTRIBUTED_REPOS', () => {
      const service = TestBed.inject(ProjectsService);
      const names = service.openProjects().map((r) => r.name);
      expect(names).toEqual(jasmine.arrayWithExactContents(['VelocityEngine', 'SegInt-Research']));
    });

    it('tags every openProjects entry with the "open-source" topic', () => {
      const service = TestBed.inject(ProjectsService);
      service.openProjects().forEach((repo) => {
        expect(repo.topics).toContain('open-source');
      });
    });
  });

  describe('getRepositoryById', () => {
    it('returns the repo whose id matches the given string', () => {
      const service = TestBed.inject(ProjectsService);
      const found = service.getRepositoryById('1');
      expect(found?.name).toBe('alg-one');
    });

    it('returns undefined for an unknown id', () => {
      const service = TestBed.inject(ProjectsService);
      expect(service.getRepositoryById('9999')).toBeUndefined();
    });
  });

  it('openSourceProjects() returns an empty array (legacy method)', () => {
    const service = TestBed.inject(ProjectsService);
    expect(service.openSourceProjects()).toEqual([]);
  });
});
