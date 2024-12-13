import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarAdminPage } from './modificar-admin.page';

describe('ModificarAdminPage', () => {
  let component: ModificarAdminPage;
  let fixture: ComponentFixture<ModificarAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
