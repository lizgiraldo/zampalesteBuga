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
import { Venta } from 'src/app/models/venta.model';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VentaService } from 'src/app/services/venta.service';

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
  modalRef!: BsModalRef;
  vendedores: Usuario[] = [];
  formPago: FormGroup;

  numeroFactura: any;
  numeroRemision: any;
  turnoActivo: boolean;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private _usuarioService: UsuarioService,
    private _ventasService: VentaService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private movimientoService: MovimientoService
  ) {
    this.selectedProducto = '';
    this.turnoActivo=localStorage.getItem('diaTurno') !== null ? true : false;
    this.productoService.getProductos().subscribe(
      (productos) => {
        this.productos = productos.filter(
          (producto) => this.turnoActivo && producto.cantidadStock>=1 && producto.preciosDia && producto.estado == 'activo'
        );
        this.productos$ = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text))
        );
      },
      (errorData: any) => {
        console.log(errorData);
      }
    );
    this._usuarioService.getUsuarios().subscribe((usuarios) => {
      this.vendedores = usuarios.filter(
        (usuario) => usuario.estado === 'activo' && usuario.rol === 'vendedor'
      );
    });

    this.formPago = this.fb.group({
      tipoDocumento: ['Factura'],
      vendedor: ['', Validators.required],
      metodoPago: ['Efectivo'],
      // Agrega más campos según tus necesidades
    });
    this.numeroFactura = localStorage.getItem('numeroFactura');
    this.numeroRemision = localStorage.getItem('numeroRemision');
  }

  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1500);
    //this.loadProductos();
  }

  ngAfterViewInit(): void {
    this.numeroFactura = localStorage.getItem('numeroFactura');
    this.numeroRemision = localStorage.getItem('numeroRemision');
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
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
      productoExistente.precioVenta = this.obtenerPrecio(productoExistente)
      productoExistente.cantidad += this.cantidadProductoSelecionado;
      productoExistente.total =
        productoExistente.cantidad *  productoExistente.precioVenta;
    } else {
      // Si el producto no existe en la lista, agrégalo con cantidad 1.
      //totalizar aca para que muestre el precio
      item.precioVenta=this.obtenerPrecio(item)
      item.total = this.cantidadProductoSelecionado *item.precioVenta;
      this.productosSeleccionados.unshift({
        ...item,
        cantidad: this.cantidadProductoSelecionado,
        total: item.total,
      });
    }
    this.totalGeneral = this.productosSeleccionados.reduce(
      (total, p) => total + p.total,
      0
    );
    this.cantidadProductoSelecionado = 1;
  }

  buscarProductoPorCodigo(codigo: string) {
    // Implementa la lógica para buscar el producto en tu lista de productos en función del código
    return this.productos.find((producto) => producto.codigo_corto === codigo);
  }

  buscarProductoPorId(codigo: string) {
    // Implementa la lógica para buscar el producto en tu lista de productos en función del código
    return this.productos.find((producto) => producto.id === codigo);
  }

  agregarProductoPorCodigo(event: Event) {
    // Busca el producto correspondiente en función del código
    event.preventDefault();

    const partes = this.codigoProducto.split('-');
    const codigo = partes[0];
    const cantidad = parseInt(partes[1]);
    this.cantidadProductoSelecionado = cantidad;
    const productoEncontrado = this.buscarProductoPorCodigo(codigo);

    // Si se encuentra un producto válido, agrégalo a la lista de productos seleccionados
    if (productoEncontrado && !isNaN(cantidad) && cantidad > 0) {
      this.agregarElemento(productoEncontrado);
      this.codigoProducto = '';
    } else {
      this.cantidadProductoSelecionado = 1;
      this.agregarElemento(productoEncontrado);
      this.codigoProducto = '';
      console.log('Se agregar elemento con valor de 1');
    }

    // Limpia el input después de agregar el producto
  }

  obtenerPrecio(producto: Producto) {
    const diaActual = localStorage.getItem("diaTurno")+"";

  const obtenerPrecioPorDia = (dia: string): number | undefined => {
    const precioEncontrado = producto.preciosDia.find(precio =>
      precio.dia.toLowerCase() === dia.toLowerCase()
    );
    return precioEncontrado?.precio;
  };

  const precioParaDiaActual = obtenerPrecioPorDia(diaActual);

  // Si no se encuentra el precio para el día actual, obtener el precio para el jueves o un valor predeterminado (puedes ajustarlo según tus necesidades)
  return precioParaDiaActual || obtenerPrecioPorDia('jueves') || 0;
  }

  pasoPago() {
    // Transforma la lista de productos seleccionados en productos_vendidos
    const form = this.formPago.value;
    const productosVendidos = this.productosSeleccionados.map((producto) => ({

      id_producto: producto.id,
      nombre_producto: producto.nombre,
      cantidad: producto.cantidad,
      precio_unitario: this.obtenerPrecio(producto),
    }));

    // Crea la venta con los productos_vendidos
    const venta: Venta = {
      numeroFactura:
        form.tipoDocumento == 'Remision'
          ? this.numeroRemision
          : this.numeroFactura,
      tipo_documento: form.tipoDocumento,
      id_vendedor: form.vendedor.id,
      nombre_vendedor: form.vendedor.nombre,
      metodo_pago: form.metodoPago,
      productos_vendidos: productosVendidos,
      fecha_venta: new Date(),
      estado: 'activo',
      monto_total: productosVendidos.reduce(
        (total, producto) =>
          total + producto.cantidad * producto.precio_unitario,
        0
      ),
    };

    // Guarda la venta en ventasEnCurso para ser procesada al final del turno
    this._ventasService.addVenta(venta).subscribe(
      () => {
        console.log('Venta guardada con éxito');
        if (form.tipoDocumento == 'Remision') {
          this.numeroRemision++;
          localStorage.setItem('numeroRemision', this.numeroRemision);
        } else {
          this.numeroFactura++;
          localStorage.setItem('numeroFactura', this.numeroFactura);
        }
      },
      (error) => {
        console.error('Error al guardar la venta:', error);
      }
    );
    //this.ventasEnCurso.push(venta);

    // Actualiza el stock de productos en this.productosSeleccionados
    this.productosSeleccionados.forEach((producto) => {
      if (producto.insumos) {
        let cantidad = producto.cantidad * producto.cantidadInsumo;
        producto = this.buscarProductoPorId(producto.codigoInsumo);
        producto.cantidad = cantidad;
      }
      producto.cantidadStock -= producto.cantidad;
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

    //Actualizar el producto en el servicio de productos (Firebase)

    // Limpia la lista de productos seleccionados para un nuevo pedido
    this.productosSeleccionados = [];
    this.totalGeneral = 0;
  }

  openModal(contenido: any) {
    this.modalRef = this.modalService.show(contenido);
    this.editState = false;
  }

  eliminarElemento(id: string) {
    // Buscar el índice del producto en la lista
    const indice = this.productosSeleccionados.findIndex((p) => p.id === id);

    // Verificar si el producto está en la lista
    if (indice !== -1) {
      // Eliminar el producto del array
      this.productosSeleccionados.splice(indice, 1);

      // Recalcular el total general
      this.totalGeneral = this.productosSeleccionados.reduce(
        (total, p) => total + p.total,
        0
      );
    }
  }
  restarElemento(id: string) {
    // Buscar el índice del producto en la lista
    const indice = this.productosSeleccionados.findIndex((p) => p.id === id);

    // Verificar si el producto está en la lista y tiene cantidad mayor a 1
    if (indice !== -1 && this.productosSeleccionados[indice].cantidad > 1) {
      // Restar uno a la cantidad del producto
      this.productosSeleccionados[indice].cantidad--;

      // Actualizar el total del producto
      this.productosSeleccionados[indice].total =
        this.productosSeleccionados[indice].cantidad *
        this.obtenerPrecio(this.productosSeleccionados[indice]);

      // Recalcular el total general
      this.totalGeneral = this.productosSeleccionados.reduce(
        (total, p) => total + p.total,
        0
      );
    }
  }
}
