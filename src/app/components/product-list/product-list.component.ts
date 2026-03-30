import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  private sanitizer = inject(DomSanitizer);

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

  // Datos de prueba (fallback si Firebase falla)
  testProducts: Product[] = [
    {
      id: '1',
      name: '🥚 Huevos Campo - Bandeja 30 unidades',
      description: 'Huevos frescos de campo, gallinas libres alimentadas con granos naturales.',
      price: 4500,
      unit: 'bandeja (30un)',
      category: 'huevos',
      stock: 50,
      images: ['assets/images/huevos.jpg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: '🥚 Huevos Campo - Caja 180 unidades',
      description: 'Caja con 180 huevos frescos de campo.',
      price: 24000,
      unit: 'caja (180un)',
      category: 'huevos',
      stock: 20,
      images: ['assets/images/huevos.jpg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: '3',
      name: '🧀 Queso Mantecoso de Vaca - 1 kilo',
      description: 'Queso mantecoso elaborado con leche fresca.',
      price: 8900,
      unit: '1 kg',
      category: 'quesos',
      stock: 30,
      images: ['assets/images/queso.jpg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: '4',
      name: '🧀 Queso Mantecoso de Vaca - 9 kilos',
      description: 'Queso mantecoso presentación económica de 9 kg.',
      price: 72000,
      unit: '9 kg',
      category: 'quesos',
      stock: 10,
      images: ['assets/images/queso.jpg'],
      featured: false,
      createdAt: new Date()
    },
    {
      id: '5',
      name: '🍯 Miel Pura de Abeja - 500 gramos',
      description: 'Miel 100% pura, sin pasteurizar.',
      price: 7000,
      unit: '500 gr',
      category: 'miel',
      stock: 30,
      images: ['assets/images/miel.jpg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: '6',
      name: '🍯 Miel Pura de Abeja - 1 kilo',
      description: 'Miel 100% pura en formato económico.',
      price: 12000,
      unit: '1 kg',
      category: 'miel',
      stock: 25,
      images: ['assets/images/miel.jpg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: '7',
      name: ' Aceite de Oliva Extra Virgen - 1 litro',
      description: 'Aceite de oliva extra virgen, prensado en frío.',
      price: 12500,
      unit: '1 litro',
      category: 'aceite',
      stock: 40,
      images: ['assets/images/aceite.jpg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: '8',
      name: ' Aceite de Oliva Extra Virgen - 5 litros',
      description: 'Aceite de oliva extra virgen en formato económico.',
      price: 55000,
      unit: '5 litros',
      category: 'aceite',
      stock: 15,
      images: ['assets/images/aceite.jpg'],
      featured: false,
      createdAt: new Date()
    }
  ];

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    this.loadProducts();
  }

  getSafeImageUrl(url: string): SafeUrl {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadProducts(): void {
    console.log('loadProducts ejecutado');
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Productos desde Firebase:', products);
        if (products && products.length > 0) {
          this.products = products;
        } else {
          this.products = [...this.testProducts];
        }
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando productos desde Firebase:', err);
        this.products = [...this.testProducts];
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
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
