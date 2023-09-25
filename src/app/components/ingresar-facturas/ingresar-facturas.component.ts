import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service'; // Importa tu servicio de productos
import { MovimientoService } from './../../services/movimiento.service'; // Importa tu servicio de movimientos de inventario
import { MovimientoInventario } from './../../models/movimiento.model'; // Importa el modelo MovimientoInventario
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-ingresar-facturas',
  templateUrl: './ingresar-facturas.component.html',
  styleUrls: ['./ingresar-facturas.component.css'],
})
export class IngresarFacturasComponent implements OnInit {

  productos: Producto[] = []; // Ajusta el tipo de datos según tu servicio y modelo
  productosSeleccionados: any[] = []; // Array de productos seleccionados con detalles
  busqueda: string = ''; // Campo de búsqueda
  productoForm: FormGroup; // FormGroup para agregar detalles al producto
isCollapsed=true;

  constructor(private movimientoService: MovimientoService,
              private productoService:ProductoService,
              private fb: FormBuilder) {
                // Inicializa el formulario para agregar detalles al producto
    this.productoForm = this.fb.group({
      cantidad: [1, Validators.required],
      precio: [0, Validators.required],
      otrosCampos: [''],
    });
              }

  ngOnInit(): void {
    // Puedes inicializar tu array de productosSeleccionados aquí si lo deseas
    this.productoService.getProductos().subscribe((data: any) => {
      this.productos = data;
    });


  }

  agregarProducto(producto: Producto) {
    // Verifica si el producto ya está en la lista de seleccionados antes de agregarlo
    if (!this.productosSeleccionados.some((p) => p.producto.id === producto.id)) {
      this.productosSeleccionados.push({
        producto,
        detalles: this.productoForm.value,
        mostrarDetalles: true, // Agrega esta propiedad para controlar la visibilidad de los detalles
      });
    }
  }

  eliminarProducto(productoSeleccionado: any) {
    const index = this.productosSeleccionados.findIndex(
      (p) => p.producto.id === productoSeleccionado.producto.id
    );
    if (index !== -1) {
      this.productosSeleccionados.splice(index, 1);
    }
  }

  toggleCollapse(productoSeleccionado: any) {
    productoSeleccionado.mostrarDetalles = !productoSeleccionado.mostrarDetalles;
  }

  guardarMovimientos() {
    this.productosSeleccionados.forEach((productoSeleccionado) => {
      const movimiento: MovimientoInventario = {
        fecha: new Date(),
        tipoMovimiento: 'Entrada', // Ajusta el tipo de movimiento según tus necesidades
        cantidad: productoSeleccionado.detalles.cantidad,
        productoID: productoSeleccionado.producto.id,
        factura_numero: 'F12345', // Asigna el número de factura adecuado
        precio: productoSeleccionado.detalles.precio,
        //otrosCampos: productoSeleccionado.detalles.otrosCampos,
      };
      this.movimientoService.agregarMovimiento(movimiento);
    });

    // Limpia la lista de productos seleccionados después de guardar los movimientos
    this.productosSeleccionados = [];
    // Reinicia el formulario
    this.productoForm.reset();
  }

}
