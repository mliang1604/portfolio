import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideMarkdown } from 'ngx-markdown';
import { BehaviorSubject } from 'rxjs';
import { ProjectsComponent } from './projects.component';
import { ProjectsService } from '../../services/projects.service';
import { ProjectsServiceStub } from '../../testing/projects.service.stub';

describe('ProjectsComponent', () => {
  let paramMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  beforeEach(async () => {
    paramMap$ = new BehaviorSubject(convertToParamMap({}));
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        provideMarkdown(),
        { provide: ProjectsService, useClass: ProjectsServiceStub },
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } }
      ]
    }).compileComponents();
  });

  it('starts with projectId = null when route has no param', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    expect(fixture.componentInstance.projectId).toBeNull();
  });

  it('updates projectId when the route paramMap emits one', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    paramMap$.next(convertToParamMap({ projectId: '12345' }));
    expect(fixture.componentInstance.projectId).toBe('12345');
  });
});
