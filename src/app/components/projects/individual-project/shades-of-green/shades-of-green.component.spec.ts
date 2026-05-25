import { TestBed } from '@angular/core/testing';
import { ShadesOfGreenComponent } from './shades-of-green.component';

describe('ShadesOfGreenComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ShadesOfGreenComponent] }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(ShadesOfGreenComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
