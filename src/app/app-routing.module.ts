import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { VerificarCorreoComponent } from './components/verificar-correo/verificar-correo.component';
import { ProductoComponent } from './components/producto/producto.component';
import { FacturarComponent } from './components/facturar/facturar.component';
import { IngresarFacturasComponent } from './components/ingresar-facturas/ingresar-facturas.component';
import { VerMovimientosComponent } from './components/ver-movimientos/ver-movimientos.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch:'full'},
{path: 'login', component: LoginComponent},
{path: 'registrarUsuario', component: RegistrarUsuarioComponent},
{path: 'dashboard', component: DashboardComponent},
{path: 'productos', component: ProductoComponent},
{path: 'facturar', component: FacturarComponent},
{path: 'movimientos', component: VerMovimientosComponent},
{path: 'ingresarFacturas', component: IngresarFacturasComponent},
{path: 'recuperarPassword', component: RecuperarPasswordComponent},
{path: 'verificarCorreo', component: VerificarCorreoComponent},
  {path: '**', redirectTo: 'login', pathMatch:'full'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
