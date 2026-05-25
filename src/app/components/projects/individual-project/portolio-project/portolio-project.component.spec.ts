import { TestBed } from '@angular/core/testing';
import { PortolioProjectComponent } from './portolio-project.component';

describe('PortolioProjectComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PortolioProjectComponent] }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(PortolioProjectComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
