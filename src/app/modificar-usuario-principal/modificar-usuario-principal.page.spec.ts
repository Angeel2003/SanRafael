import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarUsuarioPrincipalPage } from './modificar-usuario-principal.page';

describe('ModificarUsuarioPrincipalPage', () => {
  let component: ModificarUsuarioPrincipalPage;
  let fixture: ComponentFixture<ModificarUsuarioPrincipalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarUsuarioPrincipalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
