import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore/';
import { Observable, from, map, switchMap, take } from 'rxjs';
import { Venta } from '../models/venta.model'; // Asegúrate de ajustar la ruta al modelo de Venta
import { ProductoVendido } from '../models/productoVendido.model';
import { Producto } from '../models/producto.model';
import { ProductoService } from './producto.service';


export interface TotalVentasPorVendedor {
  nombre_vendedor: string;
  metodosPago: { metodo: string; total: number }[];
}

export interface TotalVentasPorMetodoPago {
  metodo: string;
  total: number;
}
@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventasCollection: AngularFirestoreCollection<Venta>;
  constructor(private firestore: AngularFirestore,private _productosService:ProductoService) {
    this.ventasCollection = firestore.collection<Venta>('Ventas');
   }


   deleteColeccionVentas():Observable<void>{
    return this.firestore
      .collection("Ventas")
      .get()
      .pipe(
        take(1),
        switchMap((querySnapshot) => {
          const batch = this.firestore.firestore.batch();

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          return from(batch.commit());
        })
      );
  }


  calcularVentasPorVendedor(ventas: Venta[]): TotalVentasPorVendedor[] {
    const totalVentasPorVendedor: TotalVentasPorVendedor[] = [];

    ventas.forEach((venta: Venta) => {
      if (venta.tipo_documento !== "Obsequio") {  // Excluir ventas de tipo "Obsequio"
        const existenteVendedor = totalVentasPorVendedor.find(v => v.nombre_vendedor === venta.nombre_vendedor);

        if (existenteVendedor) {
          const existenteMetodoPago = existenteVendedor.metodosPago.find(m => m.metodo === venta.metodo_pago);

          if (existenteMetodoPago) {
            existenteMetodoPago.total += venta.monto_total;
          } else {
            existenteVendedor.metodosPago.push({ metodo: venta.metodo_pago, total: venta.monto_total });
          }
        } else {
          totalVentasPorVendedor.push({
            nombre_vendedor: venta.nombre_vendedor,
            metodosPago: [{ metodo: venta.metodo_pago, total: venta.monto_total }]
          });
        }
      }
    });

    return totalVentasPorVendedor;
  }

  calcularTotalVentasPorMetodoPago(ventas: Venta[]): TotalVentasPorMetodoPago[] {
    const totalVentasPorMetodoPago: TotalVentasPorMetodoPago[] = [];

    ventas.forEach((venta: Venta) => {
      if (venta.tipo_documento !== "Obsequio") {
      const existenteMetodoPago = totalVentasPorMetodoPago.find(m => m.metodo === venta.metodo_pago && venta.tipo_documento!="Obsequio");

      if (existenteMetodoPago) {
        existenteMetodoPago.total += venta.monto_total;
      } else {
        totalVentasPorMetodoPago.push({ metodo: venta.metodo_pago, total: venta.monto_total });
      }
    }
    });

    return totalVentasPorMetodoPago;
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

  getVentaPorId(id: string): Observable<any> {
    return this.ventasCollection.doc(id).valueChanges();
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

  deletesVenta(id: string): Promise<void> {
    return this.ventasCollection.doc(id).delete().then(() => {
      console.log('Venta eliminada con éxito');
    });
  }

  deleteVenta(ventaId: string, productosVendidos: ProductoVendido[]): Observable<any> {
    return from(this.firestore.firestore.runTransaction(async transaction => {
      const ventaRef = this.firestore.collection('Ventas').doc(ventaId).ref;
      const ventaDoc = await transaction.get(ventaRef);

      if (!ventaDoc.exists) {
        throw new Error('La venta no existe.');
      }

      const promises = productosVendidos.map(async (producto) => {
        const productoRef = this.firestore.collection('productos').doc(producto.id_producto).ref;
        const productoDoc = await transaction.get(productoRef);
        const cantidadVendida=producto.cantidad;

        if (!productoDoc.exists) {
          throw new Error('El producto no existe.');
        }

        // Proporciona un tipo específico para productoDoc.data()
        const data = productoDoc.data() as { cantidadStock: number, insumos?: boolean, codigoInsumo?: string, cantidadInsumo?: number };

        const cantidadStockActual = data.cantidadStock;

        // Verifica si el producto es un insumo y tiene un código de insumo y cantidadInsumo
        if (data.insumos && data.codigoInsumo && data.cantidadInsumo) {
          // Obtén el producto de insumo
          const insumoRef = this.firestore.collection('productos').doc(data.codigoInsumo).ref;
          const insumoDoc = await transaction.get(insumoRef);

          if (!insumoDoc.exists) {
            throw new Error('El producto de insumo no existe.');
          }

          // Actualiza el stock del producto de insumo
          const cantidadStockInsumoActual = insumoDoc.data() as {cantidadStock:number};
          const nuevaCantidadStockInsumo = cantidadStockInsumoActual.cantidadStock + (data.cantidadInsumo*cantidadVendida);
          transaction.update(insumoRef, { cantidadStock: nuevaCantidadStockInsumo });
        }

        // Actualizar el estado del producto a "eliminado"
        transaction.update(productoRef, { estado: 'eliminado' });

        // Devuelve el stock del producto vendido
        const nuevaCantidadStock = cantidadStockActual + producto.cantidad;
        transaction.update(productoRef, { cantidadStock: nuevaCantidadStock });
      });

      await Promise.all(promises);

    }));
  }


}
