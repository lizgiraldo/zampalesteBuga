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

  constructor(private _ventaService: VentaService,
              private movimientoService: MovimientoService) { }

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


  // Método para obtener ventas y agregar movimientos
  procesarVentas() {
    this._ventaService.getVentas().subscribe((ventas) => {
      ventas.forEach((venta) => {
        venta.productos_vendidos.forEach((producto) => {
          const movimiento = {
            fecha: new Date(),
            tipoDocumento: venta.tipo_documento,
            tipoMovimiento: 'Venta',
            cantidad: producto.cantidad,
            productoID: producto.id_producto,
            usuarioID: venta.id_vendedor,
            factura_numero: venta.numeroFactura,
            precio: producto.precio_unitario,
            proveedor: 'Cliente', // Puedes ajustar esto según tus necesidades
            metodoPago: venta.metodo_pago,
          };

          this.movimientoService.agregarMovimiento(movimiento).then(() => {
            console.log('Movimiento agregado para producto:', producto.id_producto);
          });
        });
      });
    });
  }


}
