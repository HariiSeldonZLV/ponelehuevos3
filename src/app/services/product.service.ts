import { Injectable, Inject } from '@angular/core';
import { Firestore, collection, getDocs, doc, getDoc, query, orderBy, where } from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { Product } from '../models/product.model';


@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(@Inject('FIRESTORE') private db: Firestore) {}

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.db, 'products');
    const q = query(productsRef, orderBy('name'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const productsRef = collection(this.db, 'products');
    const q = query(productsRef, where('category', '==', category), orderBy('name'));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)))
    );
  }

  getProduct(id: string): Observable<Product | null> {
    const productRef = doc(this.db, `products/${id}`);
    return from(getDoc(productRef)).pipe(
      map(docSnap => docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : null)
    );
  }
}
