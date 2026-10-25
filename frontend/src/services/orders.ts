import { api } from './api';
import type { Order, CheckoutData, Cart } from '../types';

// =====================================================
// SERVICIO DE PEDIDOS Y CHECKOUT
// =====================================================

interface CreateOrderPayload {
  items: { productId: string; variantId?: string; quantity: number; unitPrice: number }[];
  shippingAddress: CheckoutData['shippingAddress'];
  shippingMethod: string;
  paymentIntentId?: string;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

export const ordersService = {
  async getMyOrders(): Promise<Order[]> {
    return api.get<Order[]>('/orders');
  },

  async getOrderById(id: string): Promise<Order> {
    return api.get<Order>(`/orders/${id}`);
  },

  async createPaymentIntent(
    cart: Cart
  ): Promise<CreatePaymentIntentResponse> {
    return api.post<CreatePaymentIntentResponse>('/payments/create-intent', {
      amount: Math.round(cart.total * 100), // En céntimos para Stripe
      items: cart.items.map(i => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    });
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    return api.post<Order>('/orders', payload);
  },

  async cancelOrder(orderId: string): Promise<Order> {
    return api.patch<Order>(`/orders/${orderId}/cancel`);
  },
};
