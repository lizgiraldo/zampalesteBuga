import { Proveedor } from './../models/proveedor.model';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore/';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private proveedoresCollection: AngularFirestoreCollection<Proveedor>;

  constructor(private firestore: AngularFirestore) {
    this.proveedoresCollection = firestore.collection<Proveedor>('proveedores');
  }

  getProveedores(): Observable<Proveedor[]> {
    return this.proveedoresCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Proveedor>[]) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getProveedor(id: string): Observable<Proveedor | null> {
    return this.proveedoresCollection.doc(id).snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists) {
          const data = action.payload.data() as Proveedor;
          const id = action.payload.id;
          return { id, ...data };
        }
        return null;
      })
    );
  }

  agregarProveedor(proveedor: Proveedor): Promise<void> {
    return this.proveedoresCollection.add(proveedor).then(() => {
      console.log('Proveedor agregado con éxito');
    });
  }

  actualizarProveedor(id: string, proveedor: Proveedor): Promise<void> {
    return this.proveedoresCollection.doc(id).update(proveedor).then(() => {
      console.log('Proveedor actualizado con éxito');
    });
  }

  eliminarProveedor(id: string): Promise<void> {
    return this.proveedoresCollection.doc(id).delete().then(() => {
      console.log('Proveedor eliminado con éxito');
    });
  }
}
