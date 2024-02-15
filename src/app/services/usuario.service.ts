import { Usuario } from '../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore/';
import { Observable, catchError, from, map, of, startWith, switchMap, take, throwError } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, updateCurrentUser } from 'firebase/auth';
import { AlertService } from '../shared/services/alert.service';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosCollection: AngularFirestoreCollection<Usuario>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private _alert:AlertService) {
    this.usuariosCollection = firestore.collection<Usuario>('usuarios');
  }


  crearUsuario(usuario: Usuario): Observable<void> {
    usuario.password = 'Osdo123456';

    return this.afAuth.authState.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          return throwError('No hay usuario autenticado.');
        }

        return from(this.afAuth.createUserWithEmailAndPassword(usuario.correo, usuario.password)).pipe(
          switchMap((userCredential: any) => {
            const newUser: Usuario = {
              id: userCredential.user?.uid,
              nombre: usuario.nombre,
              correo: usuario.correo,
              identificacion: usuario.identificacion,
              direccion: usuario.direccion,
              telefono: usuario.telefono,
              password: usuario.password,
              rol: usuario.rol,
              estado: usuario.estado
              // Agrega más campos según sea necesario
            };

            // Utiliza catchError para manejar las excepciones de createUserWithEmailAndPassword
            return from(this.usuariosCollection.doc(userCredential.user?.uid).set(newUser)).pipe(
              catchError((error) => {
                this._alert.showErrorMessage('Error al guardar el usuario en la base de datos:', error);
                return throwError('Error al guardar el usuario en la base de datos.');
              })
            );
          }),
          catchError((error) => {
            // Maneja las excepciones específicas de createUserWithEmailAndPassword aquí
            this._alert.showErrorMessage('Error al crear el usuario con correo y contraseña:', error);
            return throwError('Error al crear el usuario con correo y contraseña.');
          })
        );
      })
    );
  }


   // Método para obtener usuarios
   getUsuarios(): Observable<Usuario[]> {
    return this.usuariosCollection.snapshotChanges().pipe(
      map((actions: DocumentChangeAction<Usuario>[]) => {
        return actions.map((action) => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
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
