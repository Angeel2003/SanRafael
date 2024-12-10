import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarAdminPrincipalPage } from './modificar-admin-principal.page';

describe('ModificarAdminPrincipalPage', () => {
  let component: ModificarAdminPrincipalPage;
  let fixture: ComponentFixture<ModificarAdminPrincipalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarAdminPrincipalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
