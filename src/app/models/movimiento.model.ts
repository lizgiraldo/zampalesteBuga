export interface MovimientoInventario {
  fecha: Date;
  tipoDocumento:string;
  tipoMovimiento: string;
  cantidad: number;
  productoID?: string;
  usuarioID: string;
  comentario?: string;
  factura_numero:number;
  precio:number;
  proveedor:string;
  metodoPago:string;
}
