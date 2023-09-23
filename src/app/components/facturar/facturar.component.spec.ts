import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturarComponent } from './facturar.component';

describe('FacturarComponent', () => {
  let component: FacturarComponent;
  let fixture: ComponentFixture<FacturarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
