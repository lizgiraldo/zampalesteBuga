import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, startWith, map } from 'rxjs';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

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
      nombre: ['', Validators.required],
      codigo_corto: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      cantidad_stock: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      imagen: ['']
    });

    this.selectedProducto = '';

    this.productoService.getProductos()
      .subscribe((obj: any) => {
        this.productos = obj;
        this.productos$ = this.filter.valueChanges.pipe(
          startWith(''),
          map(text => this.search(text))
        );
      },
        (errorData: any) => {

          console.log(errorData);
        }
      );
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
    return this.productos.filter((place: Producto) => {
      const term = text.toLowerCase();
      return place.nombre.toLowerCase().includes(term) ||
      place.descripcion.toLowerCase().includes(term);
    });
  }

  guardarProducto(): void {
    if (this.productoForm.valid) {
      const productoData = this.productoForm.value as Producto;

      if (this.editingProducto) {
        // Editar un producto existente
        this.productoService.updateProducto(this.editingProducto.id+"", productoData).then(() => {
          console.log('Producto actualizado con éxito');
          this.editingProducto = null;
          this.productoForm.reset();
          this.mostrarMensaje();
          this.modalRef.hide();
        });
      } else {
        // Agregar un nuevo producto
        this.productoService.addProducto(productoData).then(() => {
          console.log('Producto agregado con éxito');
          this.productoForm.reset();
        });
      }
    }
  }

  editarProducto(producto: Producto,contenido:any): void {
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

  openModal(contenido:any){
    this.modalRef = this.modalService.show(contenido);
    this.productoForm.reset();
    this.editState = false;
  }

  mostrarMensaje(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500
    })
  }

}
