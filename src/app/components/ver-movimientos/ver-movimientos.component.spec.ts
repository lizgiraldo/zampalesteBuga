import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMovimientosComponent } from './ver-movimientos.component';

describe('VerMovimientosComponent', () => {
  let component: VerMovimientosComponent;
  let fixture: ComponentFixture<VerMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerMovimientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
