import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GesturesList } from './gestures-list';

describe('GesturesList', () => {
  let component: GesturesList;
  let fixture: ComponentFixture<GesturesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GesturesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GesturesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
