// =====================================================
// TIPOS CENTRALES DE LA APLICACIÓN
// =====================================================

// --- Usuarios y Autenticación ---

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// --- Categorías y Productos ---

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  children?: Category[];
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  images: ProductImage[];
  category: Category;
  categoryId: string;
  variants: ProductVariant[];
  tags?: string[];
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'created_at' | 'rating';
}

// Datos para crear/editar un producto (formulario del admin)
export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  categoryId: string;
  tags: string;          // string separado por comas en el form
  featured: boolean;
  imageUrl: string;
  imageAlt: string;
}

// --- Carrito ---

export interface CartItem {
  id: string;
  product: Product;
  productId: string;
  variant?: ProductVariant;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// --- Direcciones ---

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
  isDefault: boolean;
}

// --- Pedidos ---

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Checkout ---

export interface CheckoutStep {
  id: 'shipping' | 'payment' | 'review';
  label: string;
  completed: boolean;
}

export interface CheckoutData {
  shippingAddress: Partial<Address>;
  paymentMethod: 'stripe' | 'paypal' | '';
  shippingMethod: 'standard' | 'express' | '';
  notes?: string;
}

// --- API ---

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// --- Accesibilidad (ampliada) ---

export interface AccessibilityPreferences {
  // Tipografía
  fontSize: 'normal' | 'large' | 'xl' | 'xxl';
  wideSpacing: boolean;
  // Apariencia
  highContrast: boolean;
  darkMode: boolean;
  // Movimiento
  reducedMotion: boolean;
  // Visión
  simplifiedView: boolean;
  dyslexiaFont: boolean;        // Fuente amigable para dislexia
  // Cursor y foco
  largeCursor: boolean;         // Cursor grande
  focusHighlight: boolean;      // Resaltado extra en foco de teclado
  // Lectura
  lineHeight: 'normal' | 'wide' | 'wider'; // Altura de línea
}

// --- UI Común ---

export type Severity = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  severity: Severity;
  duration?: number;
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}
