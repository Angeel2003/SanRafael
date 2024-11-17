import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarTareaPasosPage } from './modificar-tarea-pasos.page';

describe('ModificarTareaPasosPage', () => {
  let component: ModificarTareaPasosPage;
  let fixture: ComponentFixture<ModificarTareaPasosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarTareaPasosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
