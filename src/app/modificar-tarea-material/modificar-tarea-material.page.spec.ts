import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarTareaMaterialPage } from './modificar-tarea-material.page';

describe('ModificarTareaMaterialPage', () => {
  let component: ModificarTareaMaterialPage;
  let fixture: ComponentFixture<ModificarTareaMaterialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarTareaMaterialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
