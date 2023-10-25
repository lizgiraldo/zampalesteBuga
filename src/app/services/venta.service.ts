import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore/';
import { Observable, from, map } from 'rxjs';
import { Venta } from '../models/venta.model'; // Asegúrate de ajustar la ruta al modelo de Venta

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventasCollection: AngularFirestoreCollection<Venta>;
  constructor(private firestore: AngularFirestore) {
    this.ventasCollection = firestore.collection<Venta>('Ventas');
   }

  getVentasDiarias(fecha: Date): Observable<Venta[]> {
    // Define la fecha de inicio y fin del día
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    return this.firestore.collection<Venta>('ventas', ref =>
      ref.where('fecha_venta', '>=', startOfDay)
         .where('fecha_venta', '<=', endOfDay)
    ).valueChanges();
  }

  // Agrega otros métodos de servicio relacionados con las ventas según sea necesario

  getVentas(): Observable<Venta[]> {
    return this.ventasCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Venta>[]) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getVenta(id: string): Observable<Venta | null> {
    return this.ventasCollection.doc(id).snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists) {
          const data = action.payload.data() as Venta;
          const id = action.payload.id;
          return { id, ...data };
        }
        return null;
      })
    );
  }

  addVenta(venta: Venta): Observable<void> {
    return from(this.ventasCollection.add(venta)).pipe(
      map(() => {
        console.log('Venta agregada con éxito');
      })
    );
  }

  updateVenta(id: string, venta: Venta): Promise<void> {
    return this.ventasCollection.doc(id).update(venta).then(() => {
      console.log('Venta actualizada con éxito');
    });
  }

  deleteVenta(id: string): Promise<void> {
    return this.ventasCollection.doc(id).delete().then(() => {
      console.log('Venta eliminada con éxito');
    });
  }
}
