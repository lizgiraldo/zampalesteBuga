import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from 'reactstrap';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})

export class RegistrarUsuarioComponent implements OnInit {
registrarUsuario:FormGroup;

  constructor(private fb: FormBuilder) {
    this.registrarUsuario = this.fb.group({
      email: ['' , Validators.required],
      password:['', Validators.required],
      repetirPassword:['', Validators.required],
    })
   }

  ngOnInit(): void {
  }

}
