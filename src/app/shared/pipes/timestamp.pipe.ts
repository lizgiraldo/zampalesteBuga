import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToDate'
})
export class TimestampToDatePipe implements PipeTransform {
  transform(timestamp: any): Date | null {
    // Verifica si el timestamp es válido y no es nulo
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
      return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    }
    // Si el timestamp no es válido o es nulo, devuelve null
    return null;
  }
}
