import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { MovimientoInventario } from '../models/movimiento.model';



@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  constructor(private firestore: AngularFirestore) {}

  // Método para agregar un nuevo movimiento de inventario
  agregarMovimiento(movimiento: MovimientoInventario) {
    return this.firestore.collection('movimientos').add(movimiento);
  }

  // Método para obtener todos los movimientos de inventario
  obtenerMovimientos() {
    return this.firestore.collection('movimientos').snapshotChanges();
  }

  // Método para obtener un movimiento de inventario por ID
  obtenerMovimientoPorID(id: string) {
    return this.firestore.collection('movimientos').doc(id).valueChanges();
  }

  // Método para actualizar un movimiento de inventario
  actualizarMovimiento(id: string, movimiento: MovimientoInventario) {
    return this.firestore.collection('movimientos').doc(id).update(movimiento);
  }

  // Método para eliminar un movimiento de inventario
  eliminarMovimiento(id: string) {
    return this.firestore.collection('movimientos').doc(id).delete();
  }
}
