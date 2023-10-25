import { ProductoVendido } from "./productoVendido.model";

// Venta.ts
export interface Venta {
  id?: string; // ID de la venta (generado automáticamente por Firestore)
  numeroFactura:number;
  tipo_documento:string;
  id_vendedor: string; // ID del usuario que realizó la venta
  nombre_vendedor:string;
  metodo_pago:string;
  productos_vendidos: ProductoVendido[];
  fecha_venta: any; // Puedes usar `firebase.firestore.Timestamp` o `Date` según tus preferencias
  monto_total: number;
}
