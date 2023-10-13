import { Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() {}

  // Convierte una fecha a un objeto Timestamp de Firebase
  fechaATimestamp(fecha: any): any {
    if (fecha instanceof Date) {
      return {
        seconds: Math.floor(fecha.getTime() / 1000),
        nanoseconds: (fecha.getTime() % 1000) * 1000000
      };
    } else {
      console.error('Error: La variable proporcionada no es un objeto Date válido.');
      return null; // o lanza una excepción, según tus necesidades
    }
  }

  // Convierte un objeto Timestamp de Firebase a una fecha
  timestampAFecha(timestamp: any): Date {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
}
