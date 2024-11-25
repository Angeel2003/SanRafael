import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarUsuarioPage } from './modificar-usuario.page';

describe('ModificarUsuarioPage', () => {
  let component: ModificarUsuarioPage;
  let fixture: ComponentFixture<ModificarUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
