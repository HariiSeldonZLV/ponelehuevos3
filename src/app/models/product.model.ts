export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: 'huevos' | 'quesos' | 'miel';
  stock: number;
  images: string[];
  featured: boolean;
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  maxStock: number;
}
