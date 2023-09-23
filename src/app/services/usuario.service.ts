import { Usuario } from '../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore/';
import { Observable, catchError, from, map, of, startWith, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private usuariosCollection: AngularFirestoreCollection<Usuario>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.usuariosCollection = firestore.collection<Usuario>('usuarios');
  }

  // Crear un nuevo usuario por el usuario autenticado
  crearUsuario(usuario: Usuario, contraseña: string): Observable<void> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return from(this.afAuth.createUserWithEmailAndPassword(usuario.correo, contraseña));
        } else {
          return new Observable<void>((observer) => {
            observer.error('No hay usuario autenticado.');
          });
        }
      }),
      switchMap((userCredential:any) => {
        const newUser: Usuario = {
          id: userCredential.user?.uid,
          nombre: usuario.nombre,
          correo: usuario.correo,
          // Agrega más campos de usuario según tus necesidades
        };
        return this.usuariosCollection.doc(userCredential.user?.uid).set(newUser);
      })
    );
  }

  // Obtener información de un usuario por su ID
  getUsuario(id: string): Observable<Usuario | undefined> {
    return this.usuariosCollection.doc(id).valueChanges();
  }

  // Obtener información del usuario autenticado
  getUsuarioAutenticado(): Observable<Usuario | null> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.getUsuario(user.uid).pipe(
            map((usuario) => usuario || null) // Transformamos 'undefined' en 'null'
          );
        } else {
          return of(null);
        }
      })
    );
  }


  // Iniciar sesión con correo y contraseña
  // iniciarSesion(correo: string, contraseña: string): Observable<firebase.auth.UserCredential> {
  //   return from(this.afAuth.signInWithEmailAndPassword(correo, contraseña));
  // }

  // Cerrar sesión
  cerrarSesion(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  // Actualizar información del usuario
  actualizarUsuario(id: string, usuario: Usuario): Promise<void> {
    return this.usuariosCollection.doc(id).update(usuario);
  }

  // Eliminar usuario
  eliminarUsuario(id: string): Promise<void> {
    return this.usuariosCollection.doc(id).delete();
  }
}
