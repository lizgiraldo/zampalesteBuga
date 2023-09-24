import { Timestamp } from "rxjs";

export interface MovimientoInventario {
  fecha: string; // Fecha y hora del movimiento.
  tipoMovimiento: string; // Tipo de movimiento (entrada, salida, ajuste, compra, venta, remisión, etc.).
  cantidad: number; // Cantidad afectada por el movimiento.
  productoID: string; // ID del producto involucrado en el movimiento.
  usuarioID?: string; // ID del usuario que realizó el movimiento (si es aplicable).
  comentario: string; // Comentario o descripción del movimiento.
}
