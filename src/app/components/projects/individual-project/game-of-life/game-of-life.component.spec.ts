import { TestBed } from '@angular/core/testing';
import { GameOfLifeComponent } from './game-of-life.component';

describe('GameOfLifeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GameOfLifeComponent] }).compileComponents();
  });

  it('creates and renders', () => {
    const fixture = TestBed.createComponent(GameOfLifeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
