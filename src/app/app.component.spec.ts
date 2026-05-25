import { TestBed } from '@angular/core/testing';
import { RouterOutlet, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { PrimeNG } from 'primeng/config';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let rippleSetSpy: jasmine.Spy;

  beforeEach(async () => {
    rippleSetSpy = jasmine.createSpy('ripple.set');
    const primeNgStub = { ripple: { set: rippleSetSpy } };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: PrimeNG, useValue: primeNgStub }
      ]
    })
      .overrideComponent(AppComponent, { set: { imports: [RouterOutlet] } })
      .compileComponents();
  });

  it('creates the root component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('enables PrimeNG ripple on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(rippleSetSpy).toHaveBeenCalledWith(true);
  });
});
