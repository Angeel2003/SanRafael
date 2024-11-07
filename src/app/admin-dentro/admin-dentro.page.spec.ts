import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDentro } from './admin-dentro.page';

describe('AdminDentro', () => {
  let component: AdminDentro;
  let fixture: ComponentFixture<AdminDentro>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(AdminDentro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
