import { Component, OnInit } from '@angular/core';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-ver-movimientos',
  templateUrl: './ver-movimientos.component.html',
  styleUrls: ['./ver-movimientos.component.css']
})
export class VerMovimientosComponent implements OnInit {

  movimientos: any[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  fechaInicio!: Date;
  fechaFin!: Date;

  constructor(
    private movimientoService: MovimientoService,) { }

  ngOnInit(): void {

  }


    buscarMovimientos() {
      // if (this.fechaInicio && this.fechaFin) {
        if(true){
        this.movimientoService.obtenerMovimientos().subscribe(movimientos => {
          this.totalItems = movimientos.length;
          this.movimientos = movimientos.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        });
      } else {
        console.error('Por favor, seleccione fechas de inicio y fin.');
      }
    }

    onPageChange(event: any): void {
      this.currentPage = event.page;
      this.buscarMovimientos();
    }

}
