import { signal, WritableSignal } from '@angular/core';
import { GitHubRepo } from '../models/github.projects';

export function makeRepo(overrides: Partial<GitHubRepo> = {}): GitHubRepo {
  return new GitHubRepo({
    id: 1,
    name: 'repo',
    full_name: 'mliang1604/repo',
    description: null,
    html_url: 'https://github.com/mliang1604/repo',
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

export class ProjectsServiceStub {
  repositoriesSignal: WritableSignal<GitHubRepo[]> = signal<GitHubRepo[]>([]);
  algProjectsSignal: WritableSignal<GitHubRepo[]> = signal<GitHubRepo[]>([]);
  eduProjectsSignal: WritableSignal<GitHubRepo[]> = signal<GitHubRepo[]>([]);
  miscProjectsSignal: WritableSignal<GitHubRepo[]> = signal<GitHubRepo[]>([]);
  openProjectsSignal: WritableSignal<GitHubRepo[]> = signal<GitHubRepo[]>([]);
  loadSignal: WritableSignal<boolean> = signal<boolean>(false);

  repositories = this.repositoriesSignal.asReadonly();
  algProjects = this.algProjectsSignal.asReadonly();
  eduProjects = this.eduProjectsSignal.asReadonly();
  miscProjects = this.miscProjectsSignal.asReadonly();
  openProjects = this.openProjectsSignal.asReadonly();

  getRepositoryById(id: string): GitHubRepo | undefined {
    return this.repositoriesSignal().find((r) => r.id === Number(id));
  }

  openSourceProjects(): GitHubRepo[] {
    return [];
  }
}
