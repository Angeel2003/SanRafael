import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearTareaComandaPage } from './crear-tarea-comanda.page';

describe('TareaMaterialPage', () => {
  let component: CrearTareaComandaPage;
  let fixture: ComponentFixture<CrearTareaComandaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTareaComandaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
