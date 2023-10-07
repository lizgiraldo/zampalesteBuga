import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() {}

  // Convierte una fecha a un objeto Timestamp de Firebase
  fechaATimestamp(fecha: Date): any {
    return {
      seconds: Math.floor(fecha.getTime() / 1000), // Convierte milisegundos a segundos
      nanoseconds: (fecha.getTime() % 1000) * 1000000 // Obtiene los milisegundos restantes y conviértelos a nanosegundos
    };
  }

  // Convierte un objeto Timestamp de Firebase a una fecha
  timestampAFecha(timestamp: any): Date {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
}
