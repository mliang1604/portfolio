import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GitHubService } from './github.service';
import { GitHubRepo } from '../models/github.projects';

describe('GitHubService', () => {
  let service: GitHubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GitHubService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GitHubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPublicRepos', () => {
    it('hits the GitHub users/{user}/repos endpoint', () => {
      service.getPublicRepos('octocat').subscribe();
      const req = httpMock.expectOne('https://api.github.com/users/octocat/repos');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('sorts repos by created_at ascending', (done) => {
      const fakeRepos = [
        { id: 2, name: 'newer', created_at: '2024-01-01T00:00:00Z' },
        { id: 1, name: 'older', created_at: '2020-01-01T00:00:00Z' },
        { id: 3, name: 'middle', created_at: '2022-01-01T00:00:00Z' }
      ];
      service.getPublicRepos('octocat').subscribe((repos) => {
        expect(repos.map((r) => r.name)).toEqual(['older', 'middle', 'newer']);
        done();
      });
      httpMock.expectOne('https://api.github.com/users/octocat/repos').flush(fakeRepos);
    });

    it('maps responses to GitHubRepo instances with only allowed keys', (done) => {
      const fakeRepos = [
        {
          id: 1,
          name: 'repo',
          full_name: 'octocat/repo',
          description: 'desc',
          html_url: 'https://github.com/octocat/repo',
          language: 'TypeScript',
          stargazers_count: 5,
          forks_count: 2,
          open_issues_count: 0,
          created_at: '2020-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          topics: ['angular'],
          extraneous_field: 'should be dropped',
          owner: { login: 'octocat' }
        }
      ];
      service.getPublicRepos('octocat').subscribe((repos) => {
        expect(repos.length).toBe(1);
        expect(repos[0]).toBeInstanceOf(GitHubRepo);
        expect(repos[0].name).toBe('repo');
        expect(repos[0].topics).toEqual(['angular']);
        expect((repos[0] as any).extraneous_field).toBeUndefined();
        expect((repos[0] as any).owner).toBeUndefined();
        done();
      });
      httpMock.expectOne('https://api.github.com/users/octocat/repos').flush(fakeRepos);
    });

    it('returns an empty array when the API returns no repos', (done) => {
      service.getPublicRepos('emptyuser').subscribe((repos) => {
        expect(repos).toEqual([]);
        done();
      });
      httpMock.expectOne('https://api.github.com/users/emptyuser/repos').flush([]);
    });
  });

  describe('getRepoReadme', () => {
    it('hits the repos/{owner}/{repo}/readme endpoint', () => {
      service.getRepoReadme('octocat', 'repo').subscribe();
      const req = httpMock.expectOne('https://api.github.com/repos/octocat/repo/readme');
      expect(req.request.method).toBe('GET');
      req.flush({ content: btoa('hello') });
    });

    it('decodes base64-encoded content', (done) => {
      const decoded = '# Hello world\n\nA README.';
      service.getRepoReadme('octocat', 'repo').subscribe((content) => {
        expect(content).toBe(decoded);
        done();
      });
      httpMock
        .expectOne('https://api.github.com/repos/octocat/repo/readme')
        .flush({ content: btoa(decoded) });
    });
  });
});
