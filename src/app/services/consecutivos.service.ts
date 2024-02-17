import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsecutivosService {

  constructor(private firestore: AngularFirestore) { }

  getConsecutivos(): Observable<any> {
    return this.firestore.collection('properties').doc('consecutivos').valueChanges();
  }

  actualizarConsecutivos(nuevosConsecutivos: any): Promise<void> {
    return this.firestore.collection('properties').doc('consecutivos').update(nuevosConsecutivos);
  }
}
