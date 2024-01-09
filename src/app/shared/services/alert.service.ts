import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }
  showSuccessMessage(title: string, message: string): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
    });
  }

  showErrorMessage(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
    });
  }

  showInfoMessage(title: string, message: string): void {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
    });
  }
}
