import { Producto } from './../models/producto.model';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore/';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productosCollection: AngularFirestoreCollection<Producto>;

  constructor(private firestore: AngularFirestore) {
    this.productosCollection = firestore.collection<Producto>('productos');
  }

  getProductos(): Observable<Producto[]> {
    return this.productosCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Producto>[]) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getProducto(id: string): Observable<Producto | null> {
    return this.productosCollection.doc(id).snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists) {
          const data = action.payload.data() as Producto;
          const id = action.payload.id;
          return { id, ...data };
        }
        return null;
      })
    );
  }

  addProducto(producto: Producto): Promise<void> {
    return this.productosCollection.add(producto).then(() => {
      console.log('Producto agregado con éxito');
    });
  }

    updateProducto(id: string, producto: Producto): Promise<void> {
      return this.productosCollection.doc(id).update(producto).then(() => {
        console.log('Producto actualizado con éxito');
      });
    }

  deleteProducto(id: string): Promise<void> {
    return this.productosCollection.doc(id).delete().then(() => {
      console.log('Producto eliminado con éxito');
    });
  }
}
