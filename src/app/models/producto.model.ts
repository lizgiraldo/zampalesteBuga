// Producto.ts
export interface Producto {
  id?: string; // ID del producto (generado automáticamente por Firestore)
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string; // Puedes cambiar este tipo según cómo hayas modelado las categorías
  fecha_creacion: any; // Puedes usar `firebase.firestore.Timestamp` o `Date` según tus preferencias
}
