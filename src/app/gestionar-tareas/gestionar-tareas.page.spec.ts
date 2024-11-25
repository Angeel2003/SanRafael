import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarTareasPage } from './gestionar-tareas.page';

describe('GestionarTareasPage', () => {
  let component: GestionarTareasPage;
  let fixture: ComponentFixture<GestionarTareasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarTareasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
