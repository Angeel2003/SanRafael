import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TareaPasosPage } from './tareaPasos.page';

describe('TareaPasosPage', () => {
  let component: TareaPasosPage;
  let fixture: ComponentFixture<TareaPasosPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TareaPasosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
