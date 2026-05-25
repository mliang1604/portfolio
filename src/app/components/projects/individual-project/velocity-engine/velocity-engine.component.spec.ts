import { TestBed } from '@angular/core/testing';
import { VelocityEngineComponent } from './velocity-engine.component';

describe('VelocityEngineComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VelocityEngineComponent] }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(VelocityEngineComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
