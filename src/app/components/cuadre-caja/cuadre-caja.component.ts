import { Component, OnInit } from '@angular/core';
import { MovimientoInventario } from 'src/app/models/movimiento.model';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { TotalVentasPorMetodoPago, TotalVentasPorVendedor, VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-cuadre-caja',
  templateUrl: './cuadre-caja.component.html',
  styleUrls: ['./cuadre-caja.component.css']
})
export class CuadreCajaComponent implements OnInit {
  totalVentasPorVendedor!: TotalVentasPorVendedor[];
  totalVentasPorMetodoPago!: TotalVentasPorMetodoPago[];

  constructor(private _ventaService: VentaService) { }

  ngOnInit(): void {
    this._ventaService.getVentas().subscribe((ventas) => {
      this.totalVentasPorVendedor = this._ventaService.calcularVentasPorVendedor(ventas);
      this.totalVentasPorMetodoPago = this._ventaService.calcularTotalVentasPorMetodoPago(ventas);
    });
  }

  // total-ventas.component.ts
calcularTotalGeneralPorMetodoPago(): number {
  let totalGeneral = 0;
  for (const metodoPago of this.totalVentasPorMetodoPago) {
    totalGeneral += metodoPago.total;
  }
  return totalGeneral;
}
}
