import { Usuario } from './../../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, startWith, map } from 'rxjs';
import { MovimientoInventario } from 'src/app/models/movimiento.model';
import { Producto } from 'src/app/models/producto.model';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
  tipoDocumento = new FormControl('');
  metodoPago = new FormControl('');
  vendedor = new FormControl('');
  productos: Producto[] = [];
  editingProducto: Producto | null = null;
  editState: boolean = false;
  totalGeneral = 0;
  codigoProducto: string = '';
  cantidadProductoSelecionado: number = 1;
  modalRef!: BsModalRef;
  vendedores: Usuario[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private _usuarioService: UsuarioService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private movimientoService: MovimientoService,
  ) {
    this.selectedProducto = '';

    this.productoService.getProductos().subscribe(
      (productos) => {
        this.productos = productos.filter(producto=>producto.precioVenta>0);
        this.productos$ = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text))
        );
      },
      (errorData: any) => {
        console.log(errorData);
      }
    );
    this._usuarioService.getUsuarios().subscribe(usuarios => {
      this.vendedores = usuarios.filter(usuario => usuario.estado === 'activo');
    });
  }

  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1500);
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
      productoExistente.total = productoExistente.cantidad * productoExistente.precioVenta;
    } else {
      // Si el producto no existe en la lista, agrégalo con cantidad 1.
      this.productosSeleccionados.unshift({...item, cantidad:this.cantidadProductoSelecionado ,total:item.precioVenta });
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
      this.cantidadProductoSelecionado=1;
      this.agregarElemento(productoEncontrado);
      this.codigoProducto = '';
      console.log("Se agregar elemento con valor de 1");
    }

    // Limpia el input después de agregar el producto

  }

  pasoPago() {
    // Para cada producto seleccionado, crea un nuevo objeto MovimientoInventario y agrégalo a la lista de movimientos
    this.productosSeleccionados.forEach((producto) => {
      const movimiento: MovimientoInventario = {
        fecha: new Date(),
        tipoDocumento: this.tipoDocumento.value+"", // O el tipo de documento que aplique
        tipoMovimiento: 'Venta', // O el tipo de movimiento que aplique
        cantidad: producto.cantidad,
        productoID: producto.id,
        usuarioID: 'ID_del_usuario', // Asigna el ID del usuario que realiza la operación
        comentario: 'Venta de producto', // Otra información relevante sobre el movimiento
        factura_numero: 'Número_de_factura', // Número de factura asociado al movimiento
        precio: producto.precioVenta, // Precio del producto
        proveedor: this.vendedor.value+"", // Nombre del proveedor si aplica
        metodoPago: this.metodoPago.value+"", // Método de pago utilizado
      };

      // Agregar el movimiento de inventario utilizando el servicio de movimientos
      this.movimientoService.agregarMovimiento(movimiento);
        producto.cantidadStock-=producto.cantidad;
      //Actualizar el producto en el servicio de productos (Firebase)
      this.productoService
        .updateProducto(producto.id as string, producto)
        .then(() => {
          // Producto actualizado con éxito
          console.log('Se actualizó el producto');
        })
        .catch((error) => {
          // Manejar errores en la promesa
          console.error('Error al actualizar el producto:', error);
        });
    });

    // Luego, puedes hacer lo que necesites con la lista de movimientos,
    // como enviarla a un servicio para guardarla en tu base de datos, por ejemplo.

    // Finalmente, limpia la lista de productos seleccionados para un nuevo pedido
    this.productosSeleccionados = [];
    this.totalGeneral = 0;
  }

  openModal(contenido:any){
    this.modalRef = this.modalService.show(contenido);
    this.editState = false;
  }
}
