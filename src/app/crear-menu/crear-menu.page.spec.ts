import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearMenuPage } from './crear-menu.page';

describe('CrearMenuPage', () => {
  let component: CrearMenuPage;
  let fixture: ComponentFixture<CrearMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
