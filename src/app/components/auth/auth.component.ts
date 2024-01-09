import { AlertService } from './../../shared/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup;


  constructor(
      private fb: FormBuilder,
      public authService: AuthService,
      private router: Router,
      private _alert:AlertService ) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  this.authService.user$.subscribe(user => {
    if (user) {
      // Usuario ya autenticado, redirigir al dashboard
      this.router.navigate(['/dashboard']);
    }
  });
}

  login() {
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .then(() => {
        console.log('Inicio de sesión exitoso');
        // Navegar al dashboard después de iniciar sesión
        this.router.navigate(['/dashboard']);
      })
      .catch(error => this._alert.showErrorMessage('Error al iniciar sesión:', error));
  }

  logout() {
    this.authService.logout()
      .then(() => this._alert.showSuccessMessage("Cierre de Sesión","Ha cerrado sesión exitosametne"))
      .catch(error => this._alert.showErrorMessage('Error al cerrar sesión:', error));
  }
}
