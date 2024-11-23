import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeticionMaterialPage } from './peticion-material.page';

describe('PeticionMaterialPage', () => {
  let component: PeticionMaterialPage;
  let fixture: ComponentFixture<PeticionMaterialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PeticionMaterialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
