import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarMenuPage } from './editar-menu.page';

describe('EditarMenuPage', () => {
  let component: EditarMenuPage;
  let fixture: ComponentFixture<EditarMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
