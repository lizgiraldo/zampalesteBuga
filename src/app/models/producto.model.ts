import { Precio } from "./precios.model";

// Producto.ts
export interface Producto {
  id?: string; // ID del producto (generado automáticamente por Firestore)
  codigo_corto:string
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioCompra: number;
  cantidadStock: number;
  fecha_creacion: any; // Puedes usar `firebase.firestore.Timestamp` o `Date` según tus preferencias
  stockMinimo?: number;
  insumos:boolean;
  codigoInsumo?:string;
  cantidadInsumo?:number;
  promocion?:boolean;
  precio_promocion?:number;
  estado:string;
  preciosDia: Array<Precio>;
}



