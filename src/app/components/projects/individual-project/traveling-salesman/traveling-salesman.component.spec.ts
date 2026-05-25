import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TravelingSalesmanComponent } from './traveling-salesman.component';

describe('TravelingSalesmanComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelingSalesmanComponent],
      providers: [provideNoopAnimations()]
    }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(TravelingSalesmanComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('declares 13 tour entries and 4 responsive breakpoints', () => {
    const fixture = TestBed.createComponent(TravelingSalesmanComponent);
    expect(fixture.componentInstance.tours.length).toBe(13);
    expect(fixture.componentInstance.responsiveOptions.length).toBe(4);
  });
});
