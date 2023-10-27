import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasturnoComponent } from './ventasturno.component';

describe('VentasturnoComponent', () => {
  let component: VentasturnoComponent;
  let fixture: ComponentFixture<VentasturnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasturnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasturnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
