import { TestBed } from '@angular/core/testing';
import { OtherProjectComponent } from './other-project.component';

describe('OtherProjectComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OtherProjectComponent] }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(OtherProjectComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
