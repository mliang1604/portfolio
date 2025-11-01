import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { GitHubService } from './github.service';
import { GitHubRepo } from '../models/github.projects';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  static MY_CONTRIBUTED_REPOS = ['VelocityEngine', 'SegInt-Research'];
  algProjects: Signal<GitHubRepo[]>;
  eduProjects: Signal<GitHubRepo[]>;
  miscProjects: Signal<GitHubRepo[]>;
  openProjects: Signal<GitHubRepo[]>;
  loadSignal: WritableSignal<boolean> = signal<boolean>(false);
  private repositoriesSignal: WritableSignal<GitHubRepo[]> = signal<GitHubRepo[]>([]);
  private openSourceProjectsSignal: WritableSignal<GitHubRepo[]> = signal<GitHubRepo[]>([]);
  readonly repositories: Signal<GitHubRepo[]> = this.repositoriesSignal.asReadonly();

  constructor(private _githubService: GitHubService) {
    this.loadRepos();
    this.algProjects = computed(() => this.repositoriesSignal().filter((repo) => repo.topics?.includes('algorithms')));
    this.eduProjects = computed(() => this.repositoriesSignal().filter((repo) => repo.topics?.includes('education')));
    this.miscProjects = computed(() =>
      this.repositoriesSignal().filter(
        (repo) => !repo.topics?.includes('algorithms') && !repo.topics?.includes('education')
      )
    );
    this.openProjects = computed(() =>
      this.openSourceProjectsSignal().map((repo) => ({
        ...repo,
        topics: [...(repo.topics || []), 'open-source']
      }))
    );
  }

  getRepositoryById(id: string): GitHubRepo | undefined {
    return this.repositories().find((repo) => repo.id === Number(id));
  }

  openSourceProjects(): GitHubRepo[] {
    return [];
  }

  private loadRepos(): void {
    this._githubService.getPublicRepos('mliang1604').subscribe((repos) => {
      this.repositoriesSignal.set(repos);
      const repoIds = repos.map((repo) => repo.name);
      this.getRepoReadme('mliang1604', repoIds);
    });
    this._githubService.getPublicRepos('varianAPIs').subscribe((repos) => {
      const myContributedRepos = repos.filter((repo) => ProjectsService.MY_CONTRIBUTED_REPOS.includes(repo.name));
      this.openSourceProjectsSignal.set(myContributedRepos);
      const repoIds = myContributedRepos.map((repo) => repo.name);
      this.getRepoReadme('varianAPIs', repoIds, this.openSourceProjectsSignal);
    });
  }

  private getRepoReadme(
    ownerName: string,
    repoNames: string[],
    signalToSet: WritableSignal<GitHubRepo[]> = this.repositoriesSignal
  ): void {
    const requests: Observable<string>[] = repoNames.map((repoName) =>
      this._githubService.getRepoReadme(ownerName, repoName)
    );

    forkJoin(requests).subscribe((responses: string[]) => {
      const newRepoList: GitHubRepo[] = [];
      responses.forEach((content, index) => {
        const repo = signalToSet()[index];
        if (repo) {
          const updatedRepo = { ...repo, readmeContent: content };
          newRepoList.push(updatedRepo);
        }
      });
      signalToSet.set(newRepoList);
      if (signalToSet === this.repositoriesSignal) {
        this.loadSignal.set(true);
      }
    });
  }
}
