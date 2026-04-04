import { Timestamp } from 'firebase/firestore';
import { CartItem } from './product.model';

export interface ShippingInfo {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  notas?: string;
}

export interface Order {
  id?: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingInfo: ShippingInfo;
  status: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  paymentMethod: 'transferencia' | 'efectivo';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
