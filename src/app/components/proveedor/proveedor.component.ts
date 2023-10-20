import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, startWith, map } from 'rxjs';
import { Proveedor } from 'src/app/models/proveedor.model'; // Importa el modelo Proveedor
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  proveedores$!: Observable<Proveedor[]>;
  selectedProveedor: any;
  time: string = '';
  tables: any[] = [];
  tableData: any[] = [];
  showError: boolean = false;
  filter = new FormControl('');
  proveedorForm: FormGroup;
  proveedores: Proveedor[] = [];
  editingProveedor: Proveedor | null = null;
  editState: boolean = false;
  modalRef!: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private proveedorService: ProveedorService,
    private modalService: BsModalService
  ) {
    this.proveedorForm = this.formBuilder.group({
      identificacion: ['', Validators.required],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.email],
      estado: ['activo', Validators.required]
    });

    this.selectedProveedor = '';

    this.proveedorService.getProveedores().subscribe((proveedores) => {
      this.proveedores = proveedores;
      this.proveedores$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text))
      );
    },
    (errorData: any) => {
      console.log(errorData);
    });
  }

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.proveedorService.getProveedores().subscribe((proveedores) => {
      this.proveedores = proveedores;
    });
  }

  search(text: any): Proveedor[] {
    return this.proveedores.filter((proveedor: Proveedor) => {
      const term = text.toLowerCase();
      return (
        proveedor.nombre.toLowerCase().includes(term) ||
        proveedor.direccion.toLowerCase().includes(term)
      );
    });
  }

  guardarProveedor(): void {
    if (this.proveedorForm.valid) {
      const proveedorData = this.proveedorForm.value as Proveedor;
      if (this.editingProveedor) {
        this.proveedorService.actualizarProveedor(
          this.editingProveedor.id || '',
          proveedorData
        ).then(() => {
          console.log('Proveedor actualizado con éxito');
          this.editingProveedor = null;
          this.proveedorForm.reset();
          this.mostrarMensaje();
          this.modalRef.hide();
        });
      } else {
        this.proveedorService.agregarProveedor(proveedorData).then(() => {
          console.log('Proveedor agregado con éxito');
          this.proveedorForm.reset();
          this.mostrarMensaje();
          this.modalRef.hide();
        });
      }
    }
  }

  editarProveedor(proveedor: Proveedor, contenido: any): void {
    this.editingProveedor = proveedor;
    this.proveedorForm.patchValue(proveedor);
    this.modalRef = this.modalService.show(contenido);
    this.editState = true;
  }

  eliminarProveedor(id: string): void {
    this.proveedorService.eliminarProveedor(id).then(() => {
      console.log('Proveedor eliminado con éxito');
    });
  }

  modificarEstadoProveedor(id: string): void {
    this.proveedorService.getProveedor(id).subscribe((proveedor: any) => {
      proveedor.estado = 'inactivo';
      this.proveedorService.actualizarProveedor(id, proveedor).then(() => {
        console.log('Estado del proveedor cambiado a inactivo con éxito');
      });
    });
  }

  openModal(contenido: any) {
    this.modalRef = this.modalService.show(contenido);
    this.proveedorForm.reset();
    this.editState = false;
  }

  mostrarMensaje() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tu trabajo ha sido guardado',
      showConfirmButton: false,
      timer: 1500
    });
  }

  descargarCSV() {
    const encabezados = ['Nombre', 'Dirección', 'Teléfono'];

    const datosParaCSV = this.proveedores.map(proveedor => {
      return {
        nombre: proveedor.nombre,
        direccion: proveedor.direccion,
        telefono: proveedor.telefono
      };
    });

    const arrayDatos = datosParaCSV.map(proveedor => [proveedor.nombre, proveedor.direccion, proveedor.telefono]);
    arrayDatos.unshift(encabezados);

    const csvData = Papa.unparse(arrayDatos, {
      header: false,
      delimiter: ';'
    });
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const currentDate = new Date().toISOString().slice(0, 10);
    const fileName = `reporte_${currentDate}.csv`;

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
