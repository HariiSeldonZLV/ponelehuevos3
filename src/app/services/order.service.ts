import { Injectable, Inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, query, orderBy, where, Timestamp, updateDoc } from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Order, ShippingInfo } from '../models/order.model';
import { CartItem } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(@Inject('FIRESTORE') private db: Firestore) {}

  crearOrder(
    items: CartItem[],
    subtotal: number,
    shippingInfo: ShippingInfo,
    shippingCost: number = 0
  ): Promise<string> {
    const total = subtotal + shippingCost;
    const ahora = Timestamp.now();

    const order: Omit<Order, 'id'> = {
      items,
      subtotal,
      shippingCost,
      total,
      shippingInfo,
      status: 'pendiente',
      paymentMethod: 'transferencia',
      createdAt: ahora,
      updatedAt: ahora
    };

    const ordersRef = collection(this.db, 'orders');
    return addDoc(ordersRef, order).then(docRef => docRef.id);
  }

  getOrders(): Observable<Order[]> {
    const ordersRef = collection(this.db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)))
    );
  }

  getOrder(id: string): Observable<Order | null> {
    const orderRef = doc(this.db, `orders/${id}`);
    return from(getDoc(orderRef)).pipe(
      map(docSnap => docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Order : null)
    );
  }

  updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const orderRef = doc(this.db, `orders/${id}`);
    return updateDoc(orderRef, { status, updatedAt: Timestamp.now() });
  }
}
