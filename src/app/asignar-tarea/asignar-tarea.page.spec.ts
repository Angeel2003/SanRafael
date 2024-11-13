import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignarTarea } from './asignar-tarea.page';

describe('AsignarTarea', () => {
  let component: AsignarTarea;
  let fixture: ComponentFixture<AsignarTarea>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(AsignarTarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
