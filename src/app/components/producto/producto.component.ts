import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, startWith, map } from 'rxjs';
import { Producto } from './../../models/producto.model'; // Importa el modelo Producto
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';
import * as Papa from 'papaparse';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos$!: Observable<Producto[]>;
  selectedProducto: any;
  time: string = '';
  tables: any[] = [];
  tableData: any[] = [];
  showError: boolean = false;
  filter = new FormControl('');
  productoForm: FormGroup;
  productos: Producto[] = [];
  editingProducto: Producto | null = null;
  editState: boolean = false;
  modalRef!: BsModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private modalService: BsModalService
  ) {
    this.productoForm = this.formBuilder.group({
      codigo_corto: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioVenta: [0],
      precioCompra: [0],
      cantidadStock: [0],
      stockMinimo: [0],
      insumos: [false],
      codigoInsumo: [''],
      cantidadInsumo: [0],
      estado: ['activo',Validators.required]
    });

    this.selectedProducto = '';

    this.productoService.getProductos().subscribe((productos) => {
      this.productos = productos;
      this.productos$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text))
      );
    },
    (errorData: any) => {
      console.log(errorData);
    });
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe((productos) => {
      this.productos = productos;
    });
  }

  search(text: any): Producto[] {
    return this.productos.filter((producto: Producto) => {
      const term = text.toLowerCase();
      return (
        producto.nombre.toLowerCase().includes(term) ||
        producto.descripcion.toLowerCase().includes(term)
      );
    });
  }

  guardarProducto(): void {
    if (this.productoForm.valid) {
      const productoData = this.productoForm.value as Producto;
      if (this.editingProducto) {

        if(productoData.codigoInsumo!=null){
          productoData.cantidadStock=1000
        }
        // Editar un producto existente
        this.productoService.updateProducto(
          this.editingProducto.id || '', // Asegúrate de obtener el ID correctamente
          productoData
        ).then(() => {
          console.log('Producto actualizado con éxito');
          this.editingProducto = null;
          this.productoForm.reset();
          this.mostrarMensaje();
          this.modalRef.hide();
        });
      } else {
        // Agregar un nuevo producto
        if(productoData.codigoInsumo!=null){
          productoData.cantidadStock=1000
        }
        this.productoService.addProducto(productoData).then(() => {
          console.log('Producto agregado con éxito');
          this.productoForm.reset();
          this.mostrarMensaje();
          this.modalRef.hide();
        });
      }
    }
  }

  editarProducto(producto: Producto, contenido: any): void {
    this.editingProducto = producto;
    this.productoForm.patchValue(producto);
    this.modalRef = this.modalService.show(contenido);
    this.editState = true;
  }

  eliminarProducto(id: string): void {
    this.productoService.deleteProducto(id).then(() => {
      console.log('Producto eliminado con éxito');
    });
  }

  modificarEstadoProducto(id: string): void {
    this.productoService.getProducto(id).subscribe((producto: any) => {
      // Modificar solo el campo 'estado' del producto
      producto.estado = 'inactivo';

      // Llamar al método de tu servicio para actualizar el producto en la base de datos
      this.productoService.updateProducto(id, producto).then(() => {
        console.log('Estado del producto cambiado a inactivo con éxito');
      });
    });
  }

  openModal(contenido: any) {
    this.modalRef = this.modalService.show(contenido);
    this.productoForm.reset();
    this.editState = false;
  }

  mostrarMensaje() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500
    });
  }

  descargarCSV() {

    // Encabezados del CSV
  const encabezados = ['Nombre', 'Precio Compra', 'Cantidad Stock'];

    const datosParaCSV = this.productos.map(producto => {
      return {
        nombre: producto.nombre,
        precioCompra: producto.precioCompra,
        cantidadStock: producto.cantidadStock
        // Agrega otros campos según sea necesario
      };
    });
    const arrayDatos = datosParaCSV.map(producto => [producto.nombre, producto.precioCompra, producto.cantidadStock]);

  // Agregar los encabezados al principio del array de datos
  arrayDatos.unshift(encabezados);

    // Convierte datosParaCSV en formato CSV usando Papa.unparse() con punto y coma como separador
    const csvData = Papa.unparse(arrayDatos, {
      header: false, // Indica que los encabezados ya están incluidos en los datos
      delimiter: ';' // Establece el punto y coma como separador de campo
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
