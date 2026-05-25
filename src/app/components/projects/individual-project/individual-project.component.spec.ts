import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideMarkdown } from 'ngx-markdown';
import { IndividualProjectComponent } from './individual-project.component';
import { ProjectsService } from '../../../services/projects.service';
import { ProjectsServiceStub, makeRepo } from '../../../testing/projects.service.stub';

describe('IndividualProjectComponent', () => {
  let stub: ProjectsServiceStub;

  beforeEach(async () => {
    stub = new ProjectsServiceStub();
    await TestBed.configureTestingModule({
      imports: [IndividualProjectComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMarkdown(),
        { provide: ProjectsService, useValue: stub }
      ]
    }).compileComponents();
  });

  it('creates the component', () => {
    const fixture = TestBed.createComponent(IndividualProjectComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('returns an empty repo placeholder when no projectId is set', () => {
    const fixture = TestBed.createComponent(IndividualProjectComponent);
    const repo = fixture.componentInstance.repo();
    expect(repo).toBeDefined();
    expect((repo as any).id).toBeUndefined();
  });

  it('resolves repo() from repositoriesSignal by matching id', () => {
    stub.repositoriesSignal.set([
      makeRepo({ id: 1234, name: 'main-repo' }),
      makeRepo({ id: 5678, name: 'other-repo' })
    ]);
    const fixture = TestBed.createComponent(IndividualProjectComponent);
    fixture.componentInstance.projectId = '5678';
    fixture.componentInstance.ngOnChanges();
    expect(fixture.componentInstance.repo().name).toBe('other-repo');
  });

  it('falls back to openProjects when not found in repositories', () => {
    stub.repositoriesSignal.set([makeRepo({ id: 1, name: 'mine' })]);
    stub.openProjectsSignal.set([makeRepo({ id: 9999, name: 'contributed' })]);
    const fixture = TestBed.createComponent(IndividualProjectComponent);
    fixture.componentInstance.projectId = '9999';
    fixture.componentInstance.ngOnChanges();
    expect(fixture.componentInstance.repo().name).toBe('contributed');
  });

  it('toggleCollapse flips collapsed state', () => {
    const fixture = TestBed.createComponent(IndividualProjectComponent);
    expect(fixture.componentInstance.collapsed()).toBeTrue();
    fixture.componentInstance.toggleCollapse();
    expect(fixture.componentInstance.collapsed()).toBeFalse();
    fixture.componentInstance.toggleCollapse();
    expect(fixture.componentInstance.collapsed()).toBeTrue();
  });

  it('ngOnChanges resets collapsed to true', () => {
    const fixture = TestBed.createComponent(IndividualProjectComponent);
    fixture.componentInstance.collapsed.set(false);
    fixture.componentInstance.ngOnChanges();
    expect(fixture.componentInstance.collapsed()).toBeTrue();
  });

  describe('hasMoreDetails', () => {
    it('returns false when projectId is null', () => {
      const fixture = TestBed.createComponent(IndividualProjectComponent);
      expect(fixture.componentInstance.hasMoreDetails()).toBeFalse();
    });

    it('returns true for a known detailed project id', () => {
      const fixture = TestBed.createComponent(IndividualProjectComponent);
      fixture.componentInstance.projectId = '228291664';
      expect(fixture.componentInstance.hasMoreDetails()).toBeTrue();
    });

    it('returns false for an unknown project id', () => {
      const fixture = TestBed.createComponent(IndividualProjectComponent);
      fixture.componentInstance.projectId = '0';
      expect(fixture.componentInstance.hasMoreDetails()).toBeFalse();
    });
  });
});
