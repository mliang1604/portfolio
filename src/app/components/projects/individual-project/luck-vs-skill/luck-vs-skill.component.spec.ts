import { TestBed } from '@angular/core/testing';
import { LuckVsSkillComponent } from './luck-vs-skill.component';

describe('LuckVsSkillComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LuckVsSkillComponent] }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(LuckVsSkillComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
