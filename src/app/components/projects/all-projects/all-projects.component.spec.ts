import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AllProjectsComponent } from './all-projects.component';
import { ProjectsService } from '../../../services/projects.service';
import { ProjectsServiceStub, makeRepo } from '../../../testing/projects.service.stub';

describe('AllProjectsComponent', () => {
  let stub: ProjectsServiceStub;

  beforeEach(async () => {
    stub = new ProjectsServiceStub();
    await TestBed.configureTestingModule({
      imports: [AllProjectsComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: ProjectsService, useValue: stub }
      ]
    }).compileComponents();
  });

  it('creates the component', () => {
    const fixture = TestBed.createComponent(AllProjectsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mirrors the service loadSignal', () => {
    const fixture = TestBed.createComponent(AllProjectsComponent);
    expect(fixture.componentInstance.loadSignal()).toBeFalse();
    stub.loadSignal.set(true);
    expect(fixture.componentInstance.loadSignal()).toBeTrue();
  });

  it('exposes four project groups in [alg, open, edu, misc] order', () => {
    stub.algProjectsSignal.set([makeRepo({ id: 1, name: 'alg' })]);
    stub.openProjectsSignal.set([makeRepo({ id: 2, name: 'open' })]);
    stub.eduProjectsSignal.set([makeRepo({ id: 3, name: 'edu' })]);
    stub.miscProjectsSignal.set([makeRepo({ id: 4, name: 'misc' })]);

    const fixture = TestBed.createComponent(AllProjectsComponent);
    const groups = fixture.componentInstance.projectGroupsSignal();
    expect(groups.length).toBe(4);
    expect(groups[0][0].name).toBe('alg');
    expect(groups[1][0].name).toBe('open');
    expect(groups[2][0].name).toBe('edu');
    expect(groups[3][0].name).toBe('misc');
  });

  describe('headerImageUrlsMap', () => {
    let openSpy: jasmine.Spy;
    let sendSpy: jasmine.Spy;
    let xhrStatus = 200;

    beforeEach(() => {
      xhrStatus = 200;
      openSpy = spyOn(XMLHttpRequest.prototype, 'open').and.stub();
      sendSpy = spyOn(XMLHttpRequest.prototype, 'send').and.callFake(function (this: XMLHttpRequest) {
        Object.defineProperty(this, 'status', { configurable: true, get: () => xhrStatus });
      });
    });

    it('returns an empty map when there are no repositories', () => {
      const fixture = TestBed.createComponent(AllProjectsComponent);
      expect(fixture.componentInstance.headerImageUrlsMap().size).toBe(0);
      expect(openSpy).not.toHaveBeenCalled();
    });

    it('returns no entry for repos whose html_url is not under mliang1987', () => {
      stub.repositoriesSignal.set([
        makeRepo({ id: 1, html_url: 'https://github.com/other-user/repo' })
      ]);
      const fixture = TestBed.createComponent(AllProjectsComponent);
      const map = fixture.componentInstance.headerImageUrlsMap();
      expect(map.size).toBe(0);
      expect(openSpy).not.toHaveBeenCalled();
    });

    it('maps a repo to its raw card-header URL when the HEAD check returns 200', () => {
      xhrStatus = 200;
      stub.repositoriesSignal.set([
        makeRepo({ id: 42, html_url: 'https://github.com/mliang1987/cool-repo' })
      ]);
      const fixture = TestBed.createComponent(AllProjectsComponent);
      const map = fixture.componentInstance.headerImageUrlsMap();
      expect(map.get(42)).toBe(
        'https://raw.githubusercontent.com/mliang1987/cool-repo/master/card-header.png'
      );
      expect(openSpy).toHaveBeenCalledWith(
        'HEAD',
        'https://raw.githubusercontent.com/mliang1987/cool-repo/master/card-header.png',
        false
      );
    });

    it('omits the entry when the HEAD check returns non-200', () => {
      xhrStatus = 404;
      stub.repositoriesSignal.set([
        makeRepo({ id: 42, html_url: 'https://github.com/mliang1987/missing-repo' })
      ]);
      const fixture = TestBed.createComponent(AllProjectsComponent);
      expect(fixture.componentInstance.headerImageUrlsMap().size).toBe(0);
      expect(sendSpy).toHaveBeenCalled();
    });
  });
});
