import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearProfeAdminPage } from './crear-profe-admin.page';

describe('CrearProfeAdminPage', () => {
  let component: CrearProfeAdminPage;
  let fixture: ComponentFixture<CrearProfeAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearProfeAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
