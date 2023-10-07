import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { MovimientoInventario } from '../models/movimiento.model';
import { Observable, map } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  private movimientosCollection: AngularFirestoreCollection<MovimientoInventario>;
  constructor(private firestore: AngularFirestore) {
    this.movimientosCollection = firestore.collection<MovimientoInventario>('movimientos');
  }

  // Método para agregar un nuevo movimiento de inventario
  agregarMovimiento(movimiento: MovimientoInventario) {
    return this.firestore.collection('movimientos').add(movimiento);
  }

  // Método para obtener todos los movimientos de inventario

  obtenerMovimientos(): Observable<MovimientoInventario[]> {
    return this.movimientosCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<MovimientoInventario>[]) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  // Método para obtener un movimiento de inventario por ID
  obtenerMovimientoPorID(id: string) {
    return this.firestore.collection('movimientos').doc(id).valueChanges();
  }

  getMovimientos(fechaInicio: Date, fechaFin: Date): Observable<any[]> {
    return this.firestore.collection('movimientos', ref =>
      ref.where('fecha', '>=', fechaInicio).where('fecha', '<=', fechaFin)
    ).valueChanges();
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
