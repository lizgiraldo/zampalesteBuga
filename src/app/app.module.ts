import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//Modulos
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';



//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { VerificarCorreoComponent } from './components/verificar-correo/verificar-correo.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ProductoComponent } from './components/producto/producto.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FacturarComponent } from './components/facturar/facturar.component';


import { TimestampToDatePipe } from 'src/app/shared/pipes/timestamp.pipe';

//modulos de ngx
import { NavbarComponent } from './shared/navbar/navbar.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import {CollapseModule}from 'ngx-bootstrap/collapse';
import { IngresarFacturasComponent } from './components/ingresar-facturas/ingresar-facturas.component';
import { VerMovimientosComponent } from './components/ver-movimientos/ver-movimientos.component';
import { CuadreCajaComponent } from './components/cuadre-caja/cuadre-caja.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegistrarUsuarioComponent,
    VerificarCorreoComponent,
    RecuperarPasswordComponent,
    SpinnerComponent,
    ProductoComponent,
    FacturarComponent,
    NavbarComponent,
    IngresarFacturasComponent,
    VerMovimientosComponent,
    TimestampToDatePipe,
    CuadreCajaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
