import { Producto } from './../models/producto.model';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { MovimientoInventario } from '../models/movimiento.model';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';



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


  getMovimientosConNombresEnRangoDeFechas(fechaInicio: Date): Observable<MovimientoInventario[]> {
     // Establecer la hora en 3 pm para la fecha de inicio
     fechaInicio.setDate(fechaInicio.getDate()+1);
     fechaInicio.setHours(15, 0, 0, 0);

      // Crear una nueva fecha para la fecha de finalización (5 am del día siguiente)
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 1);
    fechaFin.setHours(12, 0, 0, 0);
    return this.firestore.collection('movimientos', ref =>
      ref.where('fecha', '>=', fechaInicio).where('fecha', '<=', fechaFin)
    ).snapshotChanges().pipe(
      switchMap(movimientos => {
        const movimientosConProductos = movimientos.map(movimiento => {
          const data = movimiento.payload.doc.data() as any;
          const productoRef = data.productoID;
          const producto$ = this.firestore.doc(`productos/${productoRef}`).valueChanges();
          return combineLatest([producto$, of(data)]);
        });
        return combineLatest(movimientosConProductos);
      }),
      map(result => {
        return result.map(([producto, movimiento]) => {
          return {
            ...movimiento, // Devuelve todos los campos del documento de movimiento
            ProductoNombre: (producto as any)?.nombre || 'Nombre Desconocido',
          } as unknown as MovimientoInventario; // Realizar el casting a MovimientoInventario
        });
      })
    );
  }


  // Método para actualizar un movimiento de inventario
  actualizarMovimiento(id: string, movimiento: MovimientoInventario) {
    return this.firestore.collection('movimientos').doc(id).update(movimiento);
  }

  // Método para eliminar un movimiento de inventario
  eliminarMovimiento(id: string) {
    return this.firestore.collection('movimientos').doc(id).delete();
  }

  obtenerVentasEnRangoDeFechas(fechaInicio: Date, fechaFin: Date): Observable<MovimientoInventario[]> {
    return this.firestore.collection<MovimientoInventario>('movimientos', ref =>
      ref.where('fecha', '>=', fechaInicio).where('fecha', '<=', fechaFin).where('tipoMovimiento', '==', 'Venta')
    ).valueChanges();
  }

}
