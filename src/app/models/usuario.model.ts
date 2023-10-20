// Usuario.ts
export interface Usuario {
  id?: string; // ID del usuario (generado automáticamente por Firebase Authentication)
  identificacion:string;
  nombre: string;
  direccion:string;
  telefono:string;
  correo: string;
  password:string;
  rol:string;
  estado:string;
  // Agrega más campos de usuario según tus necesidades
}
