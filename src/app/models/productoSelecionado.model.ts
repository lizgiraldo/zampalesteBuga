import { Producto } from "./producto.model";

export interface ProductoSeleccionado extends Producto {
  cantidadIngresada: number;
}
