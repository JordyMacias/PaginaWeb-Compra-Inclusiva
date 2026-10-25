import type { Product, Order, ProductFormData } from '../types';
import { mockProducts, mockCategories } from '../data/mockProducts';
import { mockOrders, updateMockOrderStatus } from '../data/mockOrders';
import { USE_MOCK_DATA } from './products';
import { toSlug } from '../utils';

// =====================================================
// SERVICIO DE ADMINISTRACIÓN
// CRUD de productos y consulta de pedidos (admin only)
// =====================================================

function delay(ms = 300) {
  return new Promise(r => setTimeout(r, ms));
}

function generateId(): string {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const adminService = {

  // ─── Productos ──────────────────────────────────────

  async getProducts(): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return [...mockProducts];
    }
    const res = await fetch('/api/admin/products', {
      headers: { Authorization: `Bearer ${localStorage.getItem('compra-inclusiva-token')}` },
    });
    const data = await res.json();
    return data.data;
  },

  async createProduct(form: ProductFormData): Promise<Product> {
    if (USE_MOCK_DATA) {
      await delay(400);
      const category = mockCategories.find(c => c.id === form.categoryId)
        ?? mockCategories[0];
      const newProduct: Product = {
        id: generateId(),
        name: form.name,
        slug: form.slug || toSlug(form.name),
        description: form.description,
        shortDescription: form.shortDescription || undefined,
        price: form.price,
        compareAtPrice: form.compareAtPrice || undefined,
        stock: form.stock,
        sku: form.sku || undefined,
        categoryId: form.categoryId,
        category,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        featured: form.featured,
        rating: undefined,
        reviewCount: 0,
        variants: [],
        images: form.imageUrl
          ? [{ id: `img-${Date.now()}`, url: form.imageUrl, alt: form.imageAlt || form.name, isPrimary: true, order: 0 }]
          : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockProducts.push(newProduct);
      return newProduct;
    }
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('compra-inclusiva-token')}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    return data.data;
  },

  async updateProduct(id: string, form: ProductFormData): Promise<Product> {
    if (USE_MOCK_DATA) {
      await delay(400);
      const idx = mockProducts.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Producto no encontrado.');
      const category = mockCategories.find(c => c.id === form.categoryId)
        ?? mockProducts[idx].category;
      const updated: Product = {
        ...mockProducts[idx],
        name: form.name,
        slug: form.slug || toSlug(form.name),
        description: form.description,
        shortDescription: form.shortDescription || undefined,
        price: form.price,
        compareAtPrice: form.compareAtPrice || undefined,
        stock: form.stock,
        sku: form.sku || undefined,
        categoryId: form.categoryId,
        category,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        featured: form.featured,
        images: form.imageUrl
          ? [{ id: mockProducts[idx].images[0]?.id ?? `img-${Date.now()}`, url: form.imageUrl, alt: form.imageAlt || form.name, isPrimary: true, order: 0 }]
          : mockProducts[idx].images,
        updatedAt: new Date().toISOString(),
      };
      mockProducts[idx] = updated;
      return updated;
    }
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('compra-inclusiva-token')}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    return data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(300);
      const idx = mockProducts.findIndex(p => p.id === id);
      if (idx !== -1) mockProducts.splice(idx, 1);
      return;
    }
    await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('compra-inclusiva-token')}` },
    });
  },

  // ─── Pedidos ────────────────────────────────────────

  async getOrders(): Promise<Order[]> {
    if (USE_MOCK_DATA) {
      await delay(400);
      return [...mockOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    const res = await fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('compra-inclusiva-token')}` },
    });
    const data = await res.json();
    return data.data;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    if (USE_MOCK_DATA) {
      await delay(300);
      const updated = updateMockOrderStatus(orderId, status);
      if (!updated) throw new Error('Pedido no encontrado.');
      return updated;
    }
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('compra-inclusiva-token')}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    return data.data;
  },
};
