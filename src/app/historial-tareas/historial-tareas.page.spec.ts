import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialTareasPage } from './historial-tareas.page';

describe('HistorialTareasPage', () => {
  let component: HistorialTareasPage;
  let fixture: ComponentFixture<HistorialTareasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialTareasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
