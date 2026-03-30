import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef); // ← Agregado para forzar detección de cambios

  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  selectedCategory = 'todos';
  categories = [
    { value: 'todos', label: '🥚 Todos' },
    { value: 'huevos', label: '🥚 Huevos' },
    { value: 'quesos', label: '🧀 Quesos' },
    { value: 'miel', label: '🍯 Miel' }
  ];

  // Datos de prueba
  testProducts: Product[] = [
    {
      id: '1',
      name: '🥚 Huevos Campo - Bandeja 30 unidades',
      description: 'Huevos frescos de campo, gallinas libres alimentadas con granos naturales.',
      price: 4500,
      unit: 'bandeja',
      category: 'huevos',
      stock: 50,
      images: ['/assets/huevos.jpg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: '🧀 Queso de Cabra Artesanal',
      description: 'Queso de cabra elaborado artesanalmente, textura cremosa y sabor suave.',
      price: 8900,
      unit: 'unidad (500g)',
      category: 'quesos',
      stock: 15,
      images: ['https://via.placeholder.com/300x200?text=Queso'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: '3',
      name: '🍯 Miel Pura de Abeja',
      description: 'Miel 100% pura, sin pasteurizar. Recolectada de colmenas en bosque nativo.',
      price: 12000,
      unit: 'kg',
      category: 'miel',
      stock: 30,
      images: ['https://via.placeholder.com/300x200?text=Miel'],
      featured: true,
      createdAt: new Date()
    }
  ];

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('loadProducts ejecutado');
    this.loading = true;
    this.cdr.detectChanges(); // Forzar detección de cambios inicial

    setTimeout(() => {
      console.log('Productos cargados:', this.testProducts);
      this.products = [...this.testProducts];
      console.log('products asignados:', this.products.length);
      this.applyFilter();
      this.loading = false;
      this.cdr.detectChanges(); // Forzar detección de cambios después de actualizar
      console.log('loading después:', this.loading);
    }, 500);
  }

  applyFilter(): void {
    console.log('applyFilter ejecutado, categoría:', this.selectedCategory);
    if (this.selectedCategory === 'todos') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        p => p.category === this.selectedCategory
      );
    }
    console.log('Productos filtrados:', this.filteredProducts.length);
  }

  addToCart(product: Product): void {
    console.log('Agregando al carrito:', product.name);
    this.cartService.addItem({
      productId: product.id!,
      name: product.name,
      price: product.price,
      quantity: 1,
      unit: product.unit,
      image: product.images[0] || 'assets/placeholder.jpg',
      maxStock: product.stock
    });
  }
}
