import { Component, OnInit } from '@angular/core';
import { MovimientoInventario } from 'src/app/models/movimiento.model';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-cuadre-caja',
  templateUrl: './cuadre-caja.component.html',
  styleUrls: ['./cuadre-caja.component.css']
})
export class CuadreCajaComponent implements OnInit {

  constructor(private movimientoService: MovimientoService) { }
  fechaInicio!: Date;
  fechaFin!: Date;
  ventas: MovimientoInventario[] = [];
  ventasTotalesPorVendedor: any[] = [];
  ventasTotalesPorMedioPago: any[] = [];
  ngOnInit(): void {
  }
  obtenerVentasEnRangoDeFechas(): void {
    const fechaInicio = new Date(this.fechaInicio); // Fecha de inicio
          const fechaFin = new Date(this.fechaFin);   // Fecha de fin
    this.movimientoService.obtenerVentasEnRangoDeFechas(fechaInicio, fechaFin)
      .subscribe(ventas => {
        this.ventas = ventas;
        this.calcularVentasTotales();
      });
  }

  calcularVentasTotales(): void {
    // Lógica para calcular ventas totales por vendedor y medio de pago
    // Ejemplo de lógica para calcular ventas totales por vendedor
    const ventasPorVendedor:{ [key: string]: number } = {};
    this.ventas.forEach(venta => {
      if (!ventasPorVendedor[venta.usuarioID]) {
        ventasPorVendedor[venta.usuarioID] = 0;
      }
      ventasPorVendedor[venta.usuarioID] += venta.cantidad * venta.precio;
    });

    // Convertir el objeto a un array para el ngFor en el template
    this.ventasTotalesPorVendedor = Object.keys(ventasPorVendedor).map(key => ({
      vendedor: key, total: ventasPorVendedor[key]
    }));

    // Ejemplo de lógica para calcular ventas totales por medio de pago
    const ventasPorMedioPago:{ [key: string]: number }  = {};
    this.ventas.forEach(venta => {
      if (!ventasPorMedioPago[venta.metodoPago]) {
        ventasPorMedioPago[venta.metodoPago] = 0;
      }
      ventasPorMedioPago[venta.metodoPago] += venta.cantidad * venta.precio;
    });

    // Convertir el objeto a un array para el ngFor en el template
    this.ventasTotalesPorMedioPago = Object.keys(ventasPorMedioPago).map(key => ({
      medioPago: key, total: ventasPorMedioPago[key]
    }));
  }

}
