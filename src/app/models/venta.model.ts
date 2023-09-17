import { ProductoVendido } from "./productoVendido.model";

// Venta.ts
export interface Venta {
  id?: string; // ID de la venta (generado automáticamente por Firestore)
  id_usuario: string; // ID del usuario que realizó la venta
  productos_vendidos: ProductoVendido[];
  fecha_venta: any; // Puedes usar `firebase.firestore.Timestamp` o `Date` según tus preferencias
  monto_total: number;
}
