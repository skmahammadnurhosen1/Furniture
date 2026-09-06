export interface Product {
  id: string;
  name: string;
  category: 'Sofas' | 'Beds' | 'Tables' | 'Chairs';
  room: 'Living Room' | 'Bedroom' | 'Dining Room' | 'Office' | 'Outdoor';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  dimensions?: string;
  materials?: string[];
  colors?: { name: string; hex: string }[];
  isBestSeller?: boolean;
  isNew?: boolean;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  items: string;
  image: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'cart';
}
