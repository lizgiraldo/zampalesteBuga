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

  constructor(private ventaService: VentaService) { }

  ngOnInit(): void {
    // Obtener las ventas usando el servicio
    this.ventaService.getVentas().subscribe(ventas => {
      this.ventas = ventas;
    });
  }

  // Método para eliminar una venta
  eliminarVenta(id: string,productos:ProductoVendido[]): void {
    this.ventaService.deleteVenta(id,productos).subscribe(() => {
      // Venta eliminada con éxito, puedes actualizar la lista de ventas si es necesario
      console.log('Venta eliminada con éxito');
    })
  }
}