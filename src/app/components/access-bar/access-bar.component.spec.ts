import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AccessBarComponent } from './access-bar.component';
import { ProjectsService } from '../../services/projects.service';
import { ProjectsServiceStub, makeRepo } from '../../testing/projects.service.stub';

describe('AccessBarComponent', () => {
  let stub: ProjectsServiceStub;

  beforeEach(async () => {
    stub = new ProjectsServiceStub();
    await TestBed.configureTestingModule({
      imports: [AccessBarComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: ProjectsService, useValue: stub }
      ]
    }).compileComponents();
  });

  function topLevelLabels(items: any[]): string[] {
    return items.map((i) => i.label);
  }

  function findItem(items: any[], label: string): any {
    return items.find((i) => i.label === label);
  }

  it('builds the top-level menu in the expected order', () => {
    const fixture = TestBed.createComponent(AccessBarComponent);
    const items = fixture.componentInstance.items();
    expect(topLevelLabels(items)).toEqual(['Home', 'Projects', 'Résumé', 'Socials']);
  });

  it('Projects badge is the sum of repositories and open-source contributions', () => {
    stub.repositoriesSignal.set([makeRepo({ id: 1 }), makeRepo({ id: 2 })]);
    stub.openProjectsSignal.set([makeRepo({ id: 3 })]);
    const fixture = TestBed.createComponent(AccessBarComponent);
    const projects = findItem(fixture.componentInstance.items(), 'Projects');
    expect(projects.badge).toBe('3');
  });

  it('reflects classified project counts in submenu badges', () => {
    stub.algProjectsSignal.set([makeRepo({ id: 11, name: 'a' })]);
    stub.openProjectsSignal.set([makeRepo({ id: 12, name: 'b' })]);
    stub.eduProjectsSignal.set([
      makeRepo({ id: 13, name: 'c' }),
      makeRepo({ id: 14, name: 'd' })
    ]);
    stub.miscProjectsSignal.set([]);

    const fixture = TestBed.createComponent(AccessBarComponent);
    const projects = findItem(fixture.componentInstance.items(), 'Projects');
    const sub = (label: string) => findItem(projects.items, label);
    expect(sub('Machine Learning and Algorithms').badge).toBe('1');
    expect(sub('Open Source Projects').badge).toBe('1');
    expect(sub('Projects for Education').badge).toBe('2');
    expect(sub('Others').badge).toBe('0');
  });

  it('renders one MenuItem per repo with routerLink to /projects/<id>', () => {
    stub.algProjectsSignal.set([
      makeRepo({ id: 100, name: 'alpha' }),
      makeRepo({ id: 200, name: 'beta' })
    ]);
    const fixture = TestBed.createComponent(AccessBarComponent);
    const projects = findItem(fixture.componentInstance.items(), 'Projects');
    const ml = findItem(projects.items, 'Machine Learning and Algorithms');
    expect(ml.items.length).toBe(2);
    expect(ml.items[0]).toEqual(
      jasmine.objectContaining({ label: 'alpha', routerLink: ['/projects', 100] })
    );
    expect(ml.items[1]).toEqual(
      jasmine.objectContaining({ label: 'beta', routerLink: ['/projects', 200] })
    );
  });

  it('Socials submenu exposes LinkedIn and GitHub external URLs', () => {
    const fixture = TestBed.createComponent(AccessBarComponent);
    const socials = findItem(fixture.componentInstance.items(), 'Socials');
    expect(socials.items.length).toBe(2);
    expect(socials.items[0].url).toContain('linkedin.com');
    expect(socials.items[1].url).toContain('github.com');
  });
});
