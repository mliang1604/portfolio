import { TestBed } from '@angular/core/testing';
import { SegintResearchComponent } from './segint-research.component';

describe('SegintResearchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SegintResearchComponent] }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(SegintResearchComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
