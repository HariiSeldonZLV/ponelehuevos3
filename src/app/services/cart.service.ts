import { Injectable, signal, effect } from '@angular/core';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  maxStock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'ponele_huevos_cart';
  private readonly MAX_QUANTITY = 100; // Límite máximo por producto
  private readonly MAX_TOTAL = 1000000; // Límite máximo del carrito ($1.000.000)

  items = signal<CartItem[]>([]);

  constructor() {
    this.loadCartFromStorage();

    effect(() => {
      this.saveCartToStorage();
    });
  }

  private loadCartFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validar estructura del carrito guardado
        if (Array.isArray(parsed) && parsed.every(this.isValidCartItem)) {
          this.items.set(parsed);
        } else {
          console.warn('Carrito corrupto, limpiando...');
          this.clearCart();
        }
      } catch (e) {
        console.error('Error loading cart', e);
        this.clearCart();
      }
    }
  }

  private isValidCartItem(item: any): item is CartItem {
    return item &&
           typeof item.productId === 'string' &&
           typeof item.name === 'string' &&
           typeof item.price === 'number' &&
           typeof item.quantity === 'number' &&
           typeof item.unit === 'string' &&
           typeof item.image === 'string' &&
           typeof item.maxStock === 'number' &&
           item.quantity > 0 &&
           item.price > 0 &&
           item.quantity <= this.MAX_QUANTITY;
  }

  private saveCartToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }

  addItem(item: CartItem): void {
    // Validar item antes de agregar
    if (!this.isValidCartItem(item)) {
      console.warn('Intento de agregar item inválido');
      return;
    }

    // Validar límite de cantidad
    if (item.quantity > this.MAX_QUANTITY) {
      alert(`Máximo ${this.MAX_QUANTITY} ${item.unit} por producto`);
      return;
    }

    this.items.update(items => {
      const existing = items.find(i => i.productId === item.productId);
      if (existing) {
        const newQty = existing.quantity + item.quantity;

        // Validar límite después de sumar
        if (newQty > this.MAX_QUANTITY) {
          alert(`Máximo ${this.MAX_QUANTITY} ${item.unit} por producto`);
          return items;
        }

        if (newQty > item.maxStock) {
          alert(`Solo tenemos ${item.maxStock} ${item.unit} disponibles`);
          return items.map(i =>
            i.productId === item.productId
              ? { ...i, quantity: item.maxStock }
              : i
          );
        }
        return items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: newQty }
            : i
        );
      }

      // Validar stock inicial
      if (item.quantity > item.maxStock) {
        alert(`Solo tenemos ${item.maxStock} ${item.unit} disponibles`);
        return items;
      }

      return [...items, item];
    });

    // Validar total del carrito después de agregar
    this.validateCartTotal();
  }

  removeItem(productId: string): void {
    if (!productId || typeof productId !== 'string') {
      return;
    }
    this.items.update(items => items.filter(i => i.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    // Validar que cantidad sea un número válido
    if (!productId || isNaN(quantity) || quantity < 0) {
      return;
    }

    // Validar límite máximo
    if (quantity > this.MAX_QUANTITY) {
      alert(`Máximo ${this.MAX_QUANTITY} unidades por producto`);
      return;
    }

    const item = this.items().find(i => i.productId === productId);
    if (item) {
      if (quantity > item.maxStock) {
        alert(`Solo tenemos ${item.maxStock} ${item.unit} disponibles`);
        return;
      }
      if (quantity === 0) {
        this.removeItem(productId);
        return;
      }
    }

    this.items.update(items =>
      items.map(i => i.productId === productId ? { ...i, quantity } : i)
    );

    this.validateCartTotal();
  }

  clearCart(): void {
    this.items.set([]);
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing cart', e);
    }
  }

  getTotal(): number {
    return this.items().reduce((total, item) => {
      if (item.price > 0 && item.quantity > 0) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
  }

  getItemCount(): number {
    return this.items().reduce((count, item) => count + item.quantity, 0);
  }

  private validateCartTotal(): void {
    const total = this.getTotal();
    if (total > this.MAX_TOTAL) {
      alert(`El total del carrito excede el límite de $${this.MAX_TOTAL.toLocaleString('es-CL')}`);
      // Opcional: eliminar el último item agregado
    }
  }

  generateWhatsAppMessage(): string {
    const sanitizar = (text: string): string => {
      if (!text) return '';
      // Sanitizar para prevenir inyección
      return text
        .replace(/[&<>]/g, function(m) {
          if (m === '&') return '&amp;';
          if (m === '<') return '&lt;';
          if (m === '>') return '&gt;';
          return m;
        })
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Eliminar caracteres de control
        .trim()
        .substring(0, 200); // Limitar longitud
    };

    const items = this.items().map(item =>
      `• ${sanitizar(item.name)} x${item.quantity} ${sanitizar(item.unit)} = $${(item.price * item.quantity).toLocaleString('es-CL')}`
    ).join('\n');

    const total = this.getTotal();
    const phone = '56912345678'; // Número del negocio (sin el +56)

    // Validar que el teléfono sea válido
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      console.error('Número de teléfono inválido');
      return '#';
    }

    const message = encodeURIComponent(
      `🥚 *NUEVO PEDIDO - PONELE HUEVOS* 🥚\n\n` +
      `*Detalle:*\n${items || ' - '}\n\n` +
      `*Total:* $${total.toLocaleString('es-CL')}\n\n` +
      `*Datos de pago:*\n` +
      `Banco: Banco Estado\n` +
      `Cuenta RUT: 12.345.678-9\n` +
      `Titular: Ponele Huevos Spa\n\n` +
      `*Instrucciones:*\n` +
      `1️⃣ Realiza la transferencia por el monto total\n` +
      `2️⃣ Envía el comprobante a este WhatsApp\n` +
      `3️⃣ Confirma tu nombre y dirección de envío\n\n` +
      `✨ ¡Gracias por tu pedido! ✨`
    );

    return `https://wa.me/${cleanPhone}?text=${message}`;
  }

  // Método para exportar el carrito (útil para guardar pedidos)
  exportCart(): { items: CartItem[]; total: number; date: Date } {
    return {
      items: [...this.items()],
      total: this.getTotal(),
      date: new Date()
    };
  }
}
