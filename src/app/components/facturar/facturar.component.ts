import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, startWith, map } from 'rxjs';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css']
})
export class FacturarComponent implements OnInit {



  productos$!: Observable<Producto[]>;
  selectedProducto: any;
  time: string = '';
  tables: any[] = [];
  tableData: any[] = [];
  showError: boolean = false;
  filter = new FormControl('');
  productos: Producto[] = [];
  editingProducto: Producto | null = null;
  editState: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private modalService: BsModalService
  ) {

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
    return this.productos.filter((producto: Producto) => {
      const term = text.toLowerCase();
      return producto.nombre.toLowerCase().includes(term) ||
      producto.descripcion.toLowerCase().includes(term) ||
      producto.codigo_corto.toLowerCase().includes(term);
    });
    }

}
