import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosMensualComponent } from './movimientos-mensual.component';

describe('MovimientosMensualComponent', () => {
  let component: MovimientosMensualComponent;
  let fixture: ComponentFixture<MovimientosMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientosMensualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
