import { DateService } from './../../shared/services/date.service';
import { Component, OnInit } from '@angular/core';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-ver-movimientos',
  templateUrl: './ver-movimientos.component.html',
  styleUrls: ['./ver-movimientos.component.css']
})
export class VerMovimientosComponent implements OnInit {

  movimientos: any[] = [];
  pageSize = 1000;
  currentPage = 1;
  totalItems = 0;
  fechaInicio!: Date;
  fechaFin!: Date;

  constructor(
    private movimientoService: MovimientoService,
    private _dateService:DateService) {
    }

  ngOnInit(): void {
      //prueba github
  }


    buscarMovimientos() {
          // let fechaInicio=this._dateService.fechaATimestamp(new Date(this.fechaInicio));
          // let fechaFin=this._dateService.fechaATimestamp(new Date(this.fechaFin));

          const fechaInicio = new Date(this.fechaInicio); // Fecha de inicio
          const fechaFin = new Date(this.fechaFin);   // Fecha de fin
          this.movimientos.length=0;

        this.movimientoService.getMovimientosConNombresEnRangoDeFechas(fechaInicio).subscribe(movimientos => {
          this.totalItems = movimientos.length;
          this.movimientos = movimientos.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        });
    }

    onPageChange(event: any): void {
      this.currentPage = event.page;
      this.buscarMovimientos();
    }

}
