import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyToken } from './verify-token';

describe('VerifyToken', () => {
  let component: VerifyToken;
  let fixture: ComponentFixture<VerifyToken>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyToken]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyToken);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
