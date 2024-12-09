import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RealizarTareaPrincipalPage } from './realizar-tarea-principal.page';

describe('RealizarTareaPrincipalPage', () => {
  let component: RealizarTareaPrincipalPage;
  let fixture: ComponentFixture<RealizarTareaPrincipalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizarTareaPrincipalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
