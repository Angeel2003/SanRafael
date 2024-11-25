import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarMaterialAdminPage } from './gestionar-material-admin.page';

describe('GestionarMaterialAdminPage', () => {
  let component: GestionarMaterialAdminPage;
  let fixture: ComponentFixture<GestionarMaterialAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarMaterialAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
