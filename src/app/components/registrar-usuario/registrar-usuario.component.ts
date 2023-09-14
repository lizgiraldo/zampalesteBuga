import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
//import Swal from 'sweetalert2/dist/sweetalert2.js';
//import 'sweetalert2/src/sweetalert2.scss'



@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})

export class RegistrarUsuarioComponent implements OnInit {
registrarUsuario:FormGroup;
loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private afAuth: AngularFireAuth,
    private router: Router
    ) {
    
    this.registrarUsuario = this.fb.group({
      email: ['' , Validators.required],
      password:['', Validators.required],
      repetirPassword:['', Validators.required],
    })
   }

  ngOnInit(): void {
  }

  registrar(){
    const email = this.registrarUsuario.value.email;
    const password = this.registrarUsuario.value.password;
    const repetirPassword = this.registrarUsuario.value.repetirPassword;

    if(password !== repetirPassword){
      alert('Las constraeñas no son iguales');
      return
    }
    this.loading = true;
    this.afAuth.createUserWithEmailAndPassword(email, password).then((user)=>{
      this.loading = false;
      alert('El usuario ha sido registrado con exito')
      this.router.navigate(['/login'])
      
    }).catch((error)=> {

      console.log(error);
      this.loading = false;
      alert(this.firebaseError(error.code))
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Oops...',
      //   text: 'Something went wrong!',
      //   footer: '<a href="">Why do I have this issue?</a>'
      // })
    })
  }

  firebaseError(code: string){

    switch(code){
      case 'auth/email-already-in-us':
          return 'El usuario ya existe';
        case 'auth/weak-password':
          return 'La contraseña es muy debil';
        case 'auth/invalid-email':
          return 'Correo Invalido';
        default :
        return 'Error Desconocido'
    }
  }

}


