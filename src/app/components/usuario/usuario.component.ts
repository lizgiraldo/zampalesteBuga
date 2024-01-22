import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as Papa from 'papaparse';
import { Observable, startWith, map } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios$!: Observable<Usuario[]>;
  usuarioForm: FormGroup;
  usuarios: Usuario[] = [];
  editingUsuario: Usuario | null = null;
  editState: boolean = false;
  modalRef!: BsModalRef;

  filter = new FormControl('');

  constructor(
    private formBuilder: FormBuilder,
    private _usuarioService: UsuarioService,
    private modalService: BsModalService,
    private _alert:AlertService
  ) {
    this.usuarioForm = this.formBuilder.group({
      identificacion: ['', Validators.required],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.email],
      rol: ['', Validators.required],
      estado: ['activo', Validators.required]
      // Puedes agregar más campos según tus necesidades
    });

    this._usuarioService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
      this.usuarios$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text))
      );
    },
    (errorData: any) => {
      console.log(errorData);
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this._usuarioService.getUsuarios().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
    });
  }

  search(text: any): Usuario[] {
    return this.usuarios.filter((usuario: Usuario) => {
      const term = text.toLowerCase();
      return (
        usuario.nombre.toLowerCase().includes(term) ||
        usuario.direccion.toLowerCase().includes(term)
      );
    });
  }

  guardarUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value as Usuario;
      if (this.editingUsuario) {
        this._usuarioService.actualizarUsuario(
          this.editingUsuario.id || '',
          usuarioData
        ).then(() => {
          this._alert.showSuccessMessage("Exitoo!",'Usuario actualizado con éxito');
          this.editingUsuario = null;
          this.usuarioForm.reset();
          this.modalRef.hide();
        }).catch((error: any) => {
          this._alert.showErrorMessage('Error al actualizar usuario:', error);
          this.modalRef.hide();
        });
      } else {
        this._usuarioService.crearUsuario(usuarioData).subscribe(() => {
          this._alert.showSuccessMessage("Super!!!",'Usuario agregado con éxito');
          this.usuarioForm.reset();
          this.modalRef.hide();
        },
        error => {
                  // Puedes mostrar un mensaje de error al usuario si lo deseas
          //this._alert.showErrorMessage('No se pudo agregar el usuario.',error);
          this.usuarioForm.reset();
          this.modalRef.hide();
        })
      }
    } else {
      this._alert.showInfoMessage("Uyyyyy","Faltaron algunos campos por favor verifica")
    }
  }

  editarUsuario(usuario: Usuario,contenido: any): void {
    this.editingUsuario = usuario;
    this.usuarioForm.patchValue(usuario);
    this.modalRef = this.modalService.show(contenido);
    this.editState = true;
  }

  eliminarUsuario(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._usuarioService.eliminarUsuario(id).then(() => {
          this._alert.showInfoMessage("Ahh...",'Usuario eliminado con éxito');
        }).catch((error: any) => {
          this._alert.showErrorMessage('Error al eliminar usuario:', error);
        });
      }
    });
  }

  modificarEstadoUsuario(id: string): void {
    this._usuarioService.getUsuario(id).subscribe((usuario:any) => {
      usuario.estado = 'inactivo';
      this._usuarioService.actualizarUsuario(id, usuario).then(() => {
        this._alert.showInfoMessage("Buenooo...",'Estado del usuario cambiado a inactivo con éxito');
      }).catch((error: any) => {
        this._alert.showErrorMessage('Error al cambiar estado del usuario:', error);
      });
    });
  }

  openModal(contenido: any) {
    this.modalRef = this.modalService.show(contenido);
    this.usuarioForm.reset();
    this.editState = false;
  }

  descargarCSV(): void {
    const encabezados = ['Nombre', 'Dirección', 'Teléfono', 'Correo', 'Rol', 'Estado'];
    const datosParaCSV = this.usuarios.map(usuario => [
      usuario.nombre,
      usuario.direccion,
      usuario.telefono,
      usuario.correo,
      usuario.rol,
      usuario.estado
    ]);
    datosParaCSV.unshift(encabezados);

    const csvData = Papa.unparse(datosParaCSV, {
      header: false,
      delimiter: ','
    });
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const currentDate = new Date().toISOString().slice(0, 10);
    const fileName = `usuarios_${currentDate}.csv`;

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
