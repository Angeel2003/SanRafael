import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilAdminProfesorPage } from './perfil-admin-profesor.page';

describe('PerfilAdminProfesorPage', () => {
  let component: PerfilAdminProfesorPage;
  let fixture: ComponentFixture<PerfilAdminProfesorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilAdminProfesorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
