import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.default.User | null>;

  constructor(private afAuth: AngularFireAuth,private firestore: AngularFirestore) {
    this.user$ = afAuth.authState;
  }

  login(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  iniciarSesion(correo: string, password: string) {
  this.afAuth.signInWithEmailAndPassword(correo, password)
    .then((credenciales) => {
      // Las credenciales contienen información sobre el usuario autenticado

      // Ahora, puedes obtener más información del usuario desde Firestore
      const uid = credenciales.user?.uid;

      if (uid) {
        this.firestore.collection('usuarios').doc(uid).get()
          .subscribe((usuarioSnapshot) => {
            const usuario = usuarioSnapshot.data() as Usuario;

            // Comprobar si el usuario está activo
            if (usuario && usuario.estado === 'activo') {
              // Usuario activo, puedes realizar acciones adicionales aquí
              console.log('Inicio de sesión exitoso:', usuario);

              // También puedes redirigir al usuario a la página principal u otra página después del inicio de sesión
            } else {
              // Usuario no activo, puedes manejar esta situación como desees
              console.log('El usuario no está activo');

              // Puedes mostrar un mensaje de error o tomar otras acciones
            }
          });
      }
    })
    .catch((error) => {
      // Manejar errores durante el inicio de sesión
      console.error('Error al iniciar sesión:', error);
    });
}

}
