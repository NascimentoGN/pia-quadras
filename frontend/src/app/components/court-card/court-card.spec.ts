import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtCard } from './court-card';

describe('CourtCard', () => {
  let component: CourtCard;
  let fixture: ComponentFixture<CourtCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CourtCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
