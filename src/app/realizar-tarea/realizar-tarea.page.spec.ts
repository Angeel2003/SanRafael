import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RealizarTareaPage } from './realizar-tarea.page';

describe('RealizarTareaPage', () => {
  let component: RealizarTareaPage;
  let fixture: ComponentFixture<RealizarTareaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizarTareaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
