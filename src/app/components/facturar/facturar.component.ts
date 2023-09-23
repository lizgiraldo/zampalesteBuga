import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, startWith, map } from 'rxjs';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css'],
})
export class FacturarComponent implements OnInit {
  productosSeleccionados: any[] = [];

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
  totalGeneral = 0;
  codigoProducto: string = '';
  cantidadProductoSelecionado: number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService
  ) {
    this.selectedProducto = '';

    this.productoService.getProductos().subscribe(
      (obj: any) => {
        this.productos = obj;
        this.productos$ = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text))
        );
      },
      (errorData: any) => {
        console.log(errorData);
      }
    );
  }

  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
    this.loadProductos();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe((productos) => {
      this.productos = productos;
    });
  }

  search(text: any): Producto[] {
    return this.productos.filter((producto: Producto) => {
      if (text.includes('-')) {
        // Separa el código del producto y la cantidad
        const partes = this.codigoProducto.split('-');
        text = partes[0];
      }
      const term = text.toLowerCase();

      return (
        producto.nombre.toLowerCase().includes(term) ||
        producto.descripcion.toLowerCase().includes(term) ||
        producto.codigo_corto.toLowerCase().includes(term)
      );
    });
  }

  agregarElemento(item: any) {
    const productoExistente = this.productosSeleccionados.find(
      (p) => p.id === item.id
    );

    if (productoExistente) {
      productoExistente.cantidad += this.cantidadProductoSelecionado;
      productoExistente.total = productoExistente.cantidad * productoExistente.precio;
    } else {
      // Si el producto no existe en la lista, agrégalo con cantidad 1.
      this.productosSeleccionados.push({...item, cantidad:1 ,total:item.precio });
    }
    this.totalGeneral = this.productosSeleccionados.reduce((total, p) => total + p.total, 0);
    this.cantidadProductoSelecionado=1;
  }

  buscarProductoPorCodigo(codigo: string) {
    // Implementa la lógica para buscar el producto en tu lista de productos en función del código
    return this.productos.find(producto => producto.codigo_corto === codigo);
  }

  agregarProductoPorCodigo(event: Event) {
    // Busca el producto correspondiente en función del código
    event.preventDefault();

    const partes = this.codigoProducto.split('-');
    const codigo = partes[0];
    const cantidad = parseInt(partes[1]);
    this.cantidadProductoSelecionado=cantidad;
    const productoEncontrado = this.buscarProductoPorCodigo(codigo);


    // Si se encuentra un producto válido, agrégalo a la lista de productos seleccionados
    if (productoEncontrado && !isNaN(cantidad) && cantidad > 0) {
      this.agregarElemento(productoEncontrado);
      this.codigoProducto = '';

    }else{
      console.log("No se pudo agregar el producto.");
    }

    // Limpia el input después de agregar el producto

  }
}
