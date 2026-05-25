import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ResumeComponent } from './resume.component';

describe('ResumeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeComponent],
      providers: [provideNoopAnimations()]
    }).compileComponents();
  });

  it('creates and renders without error', () => {
    const fixture = TestBed.createComponent(ResumeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
