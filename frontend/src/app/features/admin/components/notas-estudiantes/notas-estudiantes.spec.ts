import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasEstudiantes } from './notas-estudiantes';

describe('NotasEstudiantes', () => {
  let component: NotasEstudiantes;
  let fixture: ComponentFixture<NotasEstudiantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasEstudiantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasEstudiantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
