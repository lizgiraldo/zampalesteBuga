import { AlertService } from './../../shared/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { ProductoVendido } from 'src/app/models/productoVendido.model';
import { Venta } from 'src/app/models/venta.model';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-ventasturno',
  templateUrl: './ventasturno.component.html',
  styleUrls: ['./ventasturno.component.css']
})
export class VentasturnoComponent implements OnInit {
  ventas!: Venta[];
  isCollapsed = false;

  constructor(private ventaService: VentaService,private _alert:AlertService) { }

  ngOnInit(): void {
    // Obtener las ventas usando el servicio
    this.ventaService.getVentas().subscribe(ventas => {
      // Ordenar las ventas por número de factura de forma ascendente
      this.ventas = ventas
    .filter(venta => venta.estado === 'activo') // Filtrar solo las ventas con estado activo
    .sort((a, b) => a.numeroFactura - b.numeroFactura); // Ordenar las ventas activas por número de factura

    });

  }

  // Método para eliminar una venta
  eliminarVenta(id: string,productos:ProductoVendido[]): void {
    this.ventaService.deleteVenta(id,productos).subscribe(() => {
      // Venta eliminada con éxito, puedes actualizar la lista de ventas si es necesario
      console.log('Venta eliminada con éxito');
      this._alert.showSuccessMessage("Y se fue...","Venta eliminada con exito")
    })
  }
}
