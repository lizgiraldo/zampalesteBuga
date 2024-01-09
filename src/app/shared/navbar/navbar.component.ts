import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _auth:AuthService,
              private _alert:AlertService,
              private _router:Router) { }

  ngOnInit(): void {
  }

  logout() {
    this._auth.logout()
      .then(() => {
        this._router.navigate(['/auth']);
      })
      .catch(error => this._alert.showErrorMessage('Error al cerrar sesión:', error));
  }

}
