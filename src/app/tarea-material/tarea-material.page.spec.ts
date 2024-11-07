import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TareaMaterialPage } from './tarea-material.page';

describe('TareaMaterialPage', () => {
  let component: TareaMaterialPage;
  let fixture: ComponentFixture<TareaMaterialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TareaMaterialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
