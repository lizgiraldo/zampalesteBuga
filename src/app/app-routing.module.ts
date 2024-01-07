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
import { CuadreCajaComponent } from './components/cuadre-caja/cuadre-caja.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { VentasturnoComponent } from './components/ventasturno/ventasturno.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch:'full'},
{path: 'login', component: LoginComponent},
{path: 'registrarUsuario', component: RegistrarUsuarioComponent},
{path: 'dashboard', component: DashboardComponent},
{path: 'productos', component: ProductoComponent},
{path: 'facturar', component: FacturarComponent},
{path: 'movimientos', component: VerMovimientosComponent},
{path: 'ingresarFacturas', component: IngresarFacturasComponent},
{path: 'recuperarPassword', component: RecuperarPasswordComponent},
{path: 'verificarCorreo', component: VerificarCorreoComponent},
{path: 'cuadrarCaja', component: CuadreCajaComponent},
{path: 'proveedores', component: ProveedorComponent},
{path: 'usuarios', component: UsuarioComponent},
{path: 'ventasTurno', component: VentasturnoComponent},
  {path: '**', redirectTo: 'login', pathMatch:'full'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
