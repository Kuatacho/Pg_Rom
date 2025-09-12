import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandPrediction } from './hand-prediction';

describe('HandPrediction', () => {
  let component: HandPrediction;
  let fixture: ComponentFixture<HandPrediction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandPrediction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandPrediction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
