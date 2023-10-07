import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarFacturasComponent } from './ingresar-facturas.component';

describe('IngresarFacturasComponent', () => {
  let component: IngresarFacturasComponent;
  let fixture: ComponentFixture<IngresarFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresarFacturasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresarFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
