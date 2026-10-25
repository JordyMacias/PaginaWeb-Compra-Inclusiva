import type { Order } from '../types';

// =====================================================
// PEDIDOS MOCK — para demostración del panel de admin
// =====================================================

export let mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'CI-A1B2C3',
    userId: 'user-3',
    userName: 'María García',
    userEmail: 'maria@ejemplo.es',
    status: 'delivered',
    paymentStatus: 'paid',
    subtotal: 79.99,
    tax: 16.80,
    shipping: 0,
    total: 96.79,
    shippingAddress: {
      id: 'addr-1', userId: 'user-3',
      recipientName: 'María García',
      street: 'Calle Alcalá 45, 2º B',
      city: 'Madrid', state: 'Madrid',
      country: 'España', zipCode: '28010',
      phone: '+34 600 111 222', isDefault: true,
    },
    items: [
      {
        id: 'oi-1', productId: 'prod-1',
        productName: 'Auriculares inalámbricos con cancelación de ruido',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80',
        quantity: 1, unitPrice: 79.99, subtotal: 79.99,
      },
    ],
    createdAt: '2024-10-01T10:30:00Z',
    updatedAt: '2024-10-03T14:00:00Z',
  },
  {
    id: 'order-2',
    orderNumber: 'CI-D4E5F6',
    userId: 'user-4',
    userName: 'Carlos López',
    userEmail: 'carlos@ejemplo.es',
    status: 'processing',
    paymentStatus: 'paid',
    subtotal: 264.99,
    tax: 55.65,
    shipping: 0,
    total: 320.64,
    shippingAddress: {
      id: 'addr-2', userId: 'user-4',
      recipientName: 'Carlos López',
      street: 'Avenida Gran Vía 120',
      city: 'Barcelona', state: 'Cataluña',
      country: 'España', zipCode: '08010',
      isDefault: true,
    },
    items: [
      {
        id: 'oi-2', productId: 'prod-2',
        productName: 'Tablet 10 pulgadas con pantalla anti-reflejos',
        productImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80',
        quantity: 1, unitPrice: 199.99, subtotal: 199.99,
      },
      {
        id: 'oi-3', productId: 'prod-4',
        productName: 'Lámpara de escritorio con regulador de intensidad',
        productImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=80',
        quantity: 1, unitPrice: 39.95, subtotal: 39.95,
      },
      {
        id: 'oi-4', productId: 'prod-11',
        productName: 'Libro: Aprende a programar desde cero',
        quantity: 1, unitPrice: 32.50, subtotal: 32.50,
      },
    ],
    createdAt: '2024-10-05T09:15:00Z',
    updatedAt: '2024-10-05T09:15:00Z',
  },
  {
    id: 'order-3',
    orderNumber: 'CI-G7H8I9',
    userId: 'user-1',
    userName: 'Usuario Demo',
    userEmail: 'usuario@demo.es',
    status: 'confirmed',
    paymentStatus: 'paid',
    subtotal: 89.99,
    tax: 18.90,
    shipping: 0,
    total: 108.89,
    shippingAddress: {
      id: 'addr-3', userId: 'user-1',
      recipientName: 'Usuario Demo',
      street: 'Calle Mayor 123',
      city: 'Madrid', state: 'Madrid',
      country: 'España', zipCode: '28001',
      isDefault: true,
    },
    items: [
      {
        id: 'oi-5', productId: 'prod-6',
        productName: 'Teclado ergonómico con teclas retroiluminadas',
        productImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80',
        quantity: 1, unitPrice: 89.99, subtotal: 89.99,
      },
    ],
    createdAt: '2024-10-08T16:45:00Z',
    updatedAt: '2024-10-08T16:45:00Z',
  },
  {
    id: 'order-4',
    orderNumber: 'CI-J1K2L3',
    userId: 'user-5',
    userName: 'Ana Martínez',
    userEmail: 'ana@ejemplo.es',
    status: 'shipped',
    paymentStatus: 'paid',
    subtotal: 114.95,
    tax: 24.14,
    shipping: 0,
    total: 139.09,
    shippingAddress: {
      id: 'addr-4', userId: 'user-5',
      recipientName: 'Ana Martínez',
      street: 'Plaza Mayor 5',
      city: 'Valencia', state: 'Valencia',
      country: 'España', zipCode: '46001',
      isDefault: true,
    },
    items: [
      {
        id: 'oi-6', productId: 'prod-9',
        productName: 'Zapatillas de running con suela extra amortiguada',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80',
        variantLabel: 'Talla: 40',
        quantity: 1, unitPrice: 89.95, subtotal: 89.95,
      },
      {
        id: 'oi-7', productId: 'prod-3',
        productName: 'Camiseta de algodón orgánico',
        variantLabel: 'Talla: M',
        quantity: 1, unitPrice: 24.99, subtotal: 24.99,
      },
    ],
    createdAt: '2024-10-10T11:00:00Z',
    updatedAt: '2024-10-11T08:30:00Z',
  },
  {
    id: 'order-5',
    orderNumber: 'CI-M4N5O6',
    userId: 'user-6',
    userName: 'Pedro Sánchez',
    userEmail: 'pedro@ejemplo.es',
    status: 'pending',
    paymentStatus: 'pending',
    subtotal: 45.00,
    tax: 9.45,
    shipping: 4.99,
    total: 59.44,
    shippingAddress: {
      id: 'addr-5', userId: 'user-6',
      recipientName: 'Pedro Sánchez',
      street: 'Calle Nueva 78, 3º',
      city: 'Sevilla', state: 'Andalucía',
      country: 'España', zipCode: '41001',
      isDefault: true,
    },
    items: [
      {
        id: 'oi-8', productId: 'prod-7',
        productName: 'Ratón vertical ergonómico inalámbrico',
        productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=80',
        quantity: 1, unitPrice: 45.00, subtotal: 45.00,
      },
    ],
    createdAt: '2024-10-12T08:20:00Z',
    updatedAt: '2024-10-12T08:20:00Z',
  },
];

// Actualizar estado de un pedido (mock)
export function updateMockOrderStatus(orderId: string, status: Order['status']): Order | null {
  const idx = mockOrders.findIndex(o => o.id === orderId);
  if (idx === -1) return null;
  mockOrders[idx] = { ...mockOrders[idx], status, updatedAt: new Date().toISOString() };
  return mockOrders[idx];
}
