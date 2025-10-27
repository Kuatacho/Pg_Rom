import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonResults } from './lesson-results';

describe('LessonResults', () => {
  let component: LessonResults;
  let fixture: ComponentFixture<LessonResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
