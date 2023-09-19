import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  productoForm: FormGroup;
  productos: Producto[] = [];
  editingProducto: Producto | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService
  ) {
    this.productoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      cantidad_stock: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      imagen: ['']
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

  guardarProducto(): void {
    if (this.productoForm.valid) {
      const productoData = this.productoForm.value as Producto;

      if (this.editingProducto) {
        // Editar un producto existente
        this.productoService.updateProducto(this.editingProducto.id+"", productoData).then(() => {
          console.log('Producto actualizado con éxito');
          this.editingProducto = null;
          this.productoForm.reset();
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

  editarProducto(producto: Producto): void {
    this.editingProducto = producto;
    this.productoForm.patchValue(producto);
  }

  eliminarProducto(id: string): void {
    this.productoService.deleteProducto(id).then(() => {
      console.log('Producto eliminado con éxito');
    });
  }

}
