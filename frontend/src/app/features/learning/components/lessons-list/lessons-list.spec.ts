import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsList } from './lessons-list';

describe('LessonsList', () => {
  let component: LessonsList;
  let fixture: ComponentFixture<LessonsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
