import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarMaterialProfePage } from './solicitar-material-profe.page';

describe('SolicitarMaterialProfePage', () => {
  let component: SolicitarMaterialProfePage;
  let fixture: ComponentFixture<SolicitarMaterialProfePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarMaterialProfePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
