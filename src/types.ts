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
  type?: 'success' | 'info' | 'cart' | 'error';
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  phone?: string;
  photoBase64?: string;
  street?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface AdminRequest {
  id: string;
  userId?: string;
  email: string;
  fullName: string;
  phone?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  password?: string;
  passwordHash?: string;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  street: string;
  city: string;
  postalCode: string;
  primaryEmail: string;
  secondaryEmail?: string;
  primaryPhone: string;
  hotline?: string;
  whatsappNumber: string;
  workingHours: string;
  updatedAt?: string;
}
