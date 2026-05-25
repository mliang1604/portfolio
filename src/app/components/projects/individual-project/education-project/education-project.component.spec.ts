import { TestBed } from '@angular/core/testing';
import { EducationProjectComponent } from './education-project.component';

describe('EducationProjectComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EducationProjectComponent] }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(EducationProjectComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
