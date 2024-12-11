import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TareaComandaPage } from './realizar-tarea-comanda-material.page';

describe('TareaComandaPage', () => {
  let component: TareaComandaPage;
  let fixture: ComponentFixture<TareaComandaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TareaComandaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
