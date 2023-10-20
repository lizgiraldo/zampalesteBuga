// Proveedor.ts
export interface Proveedor {
  id?: string; // ID del usuario (generado automáticamente por Firebase Authentication)
  identificacion:string;
  nombre:string;
  direccion:string;
  telefono:string;
  correo: string;
  estado:string;
  // Agrega más campos de usuario según tus necesidades
}
