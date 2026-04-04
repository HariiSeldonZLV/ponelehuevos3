import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ShippingInfo } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  items = this.cartService.items;
  subtotal = this.cartService.getTotal();
  shippingCost = 0;
  total = this.subtotal;

  loading = false;
  error = '';

  shippingInfo: ShippingInfo = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    notas: ''
  };

  regiones = [
    'Región de Tarapacá', 'Región de Antofagasta', 'Región de Atacama',
    'Región de Coquimbo', 'Región de Valparaíso', 'Región Metropolitana',
    'Región de O\'Higgins', 'Región del Maule', 'Región de Ñuble',
    'Región del Biobío', 'Región de La Araucanía', 'Región de Los Ríos',
    'Región de Los Lagos', 'Región de Aysén', 'Región de Magallanes'
  ];

  actualizarTotal() {
    this.total = this.subtotal + this.shippingCost;
  }

  async enviarPedido() {
    if (!this.shippingInfo.nombre.trim()) {
      this.error = 'Ingresa tu nombre completo';
      return;
    }
    if (!this.shippingInfo.email.trim() || !this.shippingInfo.email.includes('@')) {
      this.error = 'Ingresa un email válido';
      return;
    }
    if (!this.shippingInfo.telefono.trim()) {
      this.error = 'Ingresa tu teléfono';
      return;
    }
    if (!this.shippingInfo.direccion.trim()) {
      this.error = 'Ingresa tu dirección';
      return;
    }
    if (this.items().length === 0) {
      this.error = 'El carrito está vacío';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const orderId = await this.orderService.crearOrder(
        this.items(),
        this.subtotal,
        this.shippingInfo,
        this.shippingCost
      );

      this.cartService.clearCart();
      this.router.navigate(['/confirmacion', orderId]);

    } catch (err) {
      console.error('Error al crear pedido:', err);
      this.error = 'Error al procesar el pedido. Intenta nuevamente.';
      this.loading = false;
    }
  }
}