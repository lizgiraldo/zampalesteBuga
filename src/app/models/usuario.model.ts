// Usuario.ts
export interface Usuario {
  id?: string; // ID del usuario (generado automáticamente por Firebase Authentication)
  nombre: string;
  correo: string;
  rol:string;
  estado:boolean;
  // Agrega más campos de usuario según tus necesidades
}
