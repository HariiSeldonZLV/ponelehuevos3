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
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  selectedCategory = 'todos';
  categories = [
  { value: 'todos', label: '🥚 Todos' },
  { value: 'huevos', label: '🥚 Huevos' },
  { value: 'quesos', label: '🧀 Quesos' },
  { value: 'miel', label: '🍯 Miel' },
  { value: 'aceite', label: ' Aceite de Oliva' }
];

// Datos de prueba con todos los productos
testProducts: Product[] = [
  // === HUEVOS ===
  {
    id: '1',
    name: '🥚 Huevos Campo - Bandeja 30 unidades',
    description: 'Huevos frescos de campo, gallinas libres alimentadas con granos naturales.',
    price: 4500,
    unit: 'bandeja (30un)',
    category: 'huevos',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=400&h=300&fit=crop'],
    featured: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: '🥚 Huevos Campo - Caja 180 unidades',
    description: 'Caja con 180 huevos frescos de campo. Ideal para familias grandes o negocios.',
    price: 24000,
    unit: 'caja (180un)',
    category: 'huevos',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=400&h=300&fit=crop'],
    featured: true,
    createdAt: new Date()
  },
  // === QUESOS ===
  {
    id: '3',
    name: '🧀 Queso Mantecoso de Vaca - 1 kilo',
    description: 'Queso mantecoso elaborado con leche fresca de vacas criadas en pastoreo natural.',
    price: 8900,
    unit: '1 kg',
    category: 'quesos',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=300&fit=crop'],
    featured: true,
    createdAt: new Date()
  },
  {
    id: '4',
    name: '🧀 Queso Mantecoso de Vaca - 9 kilos',
    description: 'Queso mantecoso presentación económica de 9 kg. Ideal para restaurantes.',
    price: 72000,
    unit: '9 kg',
    category: 'quesos',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=300&fit=crop'],
    featured: false,
    createdAt: new Date()
  },
  // === MIEL ===
  {
    id: '5',
    name: '🍯 Miel Pura de Abeja - 500 gramos',
    description: 'Miel 100% pura, sin pasteurizar. Recolectada de colmenas en bosque nativo.',
    price: 7000,
    unit: '500 gr',
    category: 'miel',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&h=300&fit=crop'],
    featured: true,
    createdAt: new Date()
  },
  {
    id: '6',
    name: '🍯 Miel Pura de Abeja - 1 kilo',
    description: 'Miel 100% pura en formato económico. Ideal para consumo frecuente o endulzar bebidas.',
    price: 12000,
    unit: '1 kg',
    category: 'miel',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&h=300&fit=crop'],
    featured: true,
    createdAt: new Date()
  },
  // === ACEITE DE OLIVA ===
  {
    id: '7',
    name: ' Aceite de Oliva Extra Virgen - Botella 1 litro',
    description: 'Aceite de oliva extra virgen, prensado en frío. Producto puro de aceitunas cosechadas a mano.',
    price: 12500,
    unit: '1 litro',
    category: 'aceite',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'],
    featured: true,
    createdAt: new Date()
  },
  {
    id: '8',
    name: ' Aceite de Oliva Extra Virgen - Bidón 5 litros',
    description: 'Aceite de oliva extra virgen en formato económico de 5 litros.',
    price: 55000,
    unit: '5 litros',
    category: 'aceite',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop'],
    featured: false,
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
    this.cdr.detectChanges();

    setTimeout(() => {
      console.log('Productos cargados:', this.testProducts);
      this.products = [...this.testProducts];
      console.log('products asignados:', this.products.length);
      this.applyFilter();
      this.loading = false;
      this.cdr.detectChanges();
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
      image: product.images[0],
      maxStock: product.stock
    });
  }
}
