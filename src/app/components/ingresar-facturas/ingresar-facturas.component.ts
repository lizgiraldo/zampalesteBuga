import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Producto } from './../../models/producto.model';
import { MovimientoInventario } from './../../models/movimiento.model';
import { ProductoSeleccionado } from './../../models/productoSelecionado.model';
import { ProductoService } from 'src/app/services/producto.service'; // Importa tu servicio de productos
import { MovimientoService } from './../../services/movimiento.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-ingresar-facturas',
  templateUrl: './ingresar-facturas.component.html',
  styleUrls: ['./ingresar-facturas.component.css'],
})
export class IngresarFacturasComponent implements OnInit {
  productoSeleccionado!: Producto;
  productosDisponibles!: Producto[];
  productosSeleccionados: ProductoSeleccionado[] = [];
  productoForm: FormGroup;
  filter = new FormControl('');
  productos$!: Observable<Producto[]>;
  totalPrecioCompra = 0;

  mediosPago: string[] = ['Efectivo', 'Tarjeta de crédito', 'Transferencia bancaria', 'Cheque'];
  proveedores: string[] = ['Proveedor A', 'Proveedor B', 'Proveedor C', 'Proveedor D'];


  constructor(
    private formBuilder: FormBuilder,
    private movimientoService: MovimientoService,
    private productoService: ProductoService
  ) {
    this.productoSeleccionado = {} as Producto;
    this.productoForm = this.formBuilder.group({
      precioCompra: ['', Validators.required],
      precioVenta: ['', Validators.required],
      cantidad: ['', Validators.required],
      facturaNumero: [''],
      medioPago: [''],  // Control para el select de medios de pago
      proveedor: ['']   // Control para el select de proveedores

    });
  }

  ngOnInit() {
    // Llama al servicio para obtener los productos disponibles al inicializar el componente
    this.productoService.getProductos().subscribe((productos) => {
      this.productosDisponibles = productos;
      this.productos$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text))
      );
    });
  }

  agregarProductoSeleccionado() {
    if (this.productoForm.valid && this.productoSeleccionado) {
      // Obtenemos la cantidad ingresada por el usuario en el formulario
      const cantidadIngresada = this.productoSeleccionado.cantidadStock;
      const productoConCantidad:ProductoSeleccionado = {
        ...this.productoSeleccionado,
        cantidadIngresada: this.productoForm.get('cantidad')?.value, // Agregamos el campo cantidad
        precioCompra: this.productoForm.get('precioCompra')?.value,
        precioVenta: this.productoForm.get('precioVenta')?.value,
        // Puedes agregar otros campos según tus necesidades
      };

      this.productosSeleccionados.push(productoConCantidad);
      this.totalPrecioCompra += productoConCantidad.precioCompra * cantidadIngresada;
      this.productoSeleccionado = {} as Producto; // Limpiamos el producto seleccionado
      this.productoForm.reset(); // Limpiamos el formulario
    }
  }

  eliminarProductoSeleccionado(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  editarProductoSeleccionado(index: number) {
    this.productoSeleccionado = { ...this.productosSeleccionados[index] };
  }


  agregarMovimientoInventario() {
    if (this.productosSeleccionados.length === 0) {
      // Lógica para manejar el caso donde no hay productos seleccionados
      return;
    }

    this.productosSeleccionados.forEach((producto) => {
      const movimiento: MovimientoInventario = {
        fecha: new Date(),
        tipoMovimiento: 'entrada', // Puedes ajustar el tipo de movimiento según tus necesidades
        cantidad: producto.cantidadStock,
        productoID: producto.id,
        // Otros campos del movimiento según necesites
        factura_numero: this.productoForm.get('facturaNumero')?.value,
        precio: producto.precioCompra,
        proveedor:"osdo",
        metodoPago:"efectivo"
      };

      // Agregar el movimiento de inventario utilizando el servicio de movimientos
      this.movimientoService.agregarMovimiento(movimiento);
        producto.cantidadStock+=producto.cantidadIngresada;
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

    // Limpiar lista de productos seleccionados y formulario
    this.productosSeleccionados = [];
    this.productoForm.reset();
  }

  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = { ...producto }; // Clonamos el producto seleccionado para no modificar el original
  }

  search(text: any): Producto[] {
    return this.productosDisponibles.filter((producto: Producto) => {
      const term = text.toLowerCase();
      return (
        producto.nombre.toLowerCase().includes(term) ||
        producto.descripcion.toLowerCase().includes(term)
      );
    });
  }
}
