import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsuarios } from './list-usuarios';

describe('ListUsuarios', () => {
  let component: ListUsuarios;
  let fixture: ComponentFixture<ListUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
