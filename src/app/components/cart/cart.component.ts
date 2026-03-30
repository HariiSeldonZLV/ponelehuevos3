import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private cartService = inject(CartService);

  items = this.cartService.items;
  total = this.cartService.getTotal;
  itemCount = this.cartService.getItemCount;
  isOpen = false;

  toggleCart(): void {
    this.isOpen = !this.isOpen;
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  checkout(): void {
    const url = this.cartService.generateWhatsAppMessage();
    window.open(url, '_blank');
  }
}
