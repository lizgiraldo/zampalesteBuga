// ProductoVendido.ts
export interface ProductoVendido {
  insumos?: any;
  codigoInsumo?: any;
  cantidadInsumo?: number;
  id_producto: string; // ID del producto vendido
  nombre_producto:string;
  cantidad: number;
  precio_unitario: number;
}
