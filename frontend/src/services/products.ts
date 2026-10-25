import { api } from './api';
import type { Product, ProductsResponse, ProductFilters, Category } from '../types';
import { mockCategories, mockProducts, filterMockProducts } from '../data/mockProducts';

// =====================================================
// SERVICIO DE PRODUCTOS
//
// Cambia USE_MOCK_DATA a false cuando el backend esté
// disponible. Con true, la tienda funciona sin servidor.
// =====================================================

export const USE_MOCK_DATA = false;

// --- Helper para simular latencia de red en modo mock ---
function delay(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const productsService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    if (USE_MOCK_DATA) {
      await delay(300);
      return filterMockProducts({
        ...filters,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 12,
      });
    }
    return api.get<ProductsResponse>('/products', {
      ...filters,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 12,
    });
  },

  async getProductBySlug(slug: string): Promise<Product> {
    if (USE_MOCK_DATA) {
      await delay(200);
      const product = mockProducts.find(p => p.slug === slug);
      if (!product) throw new Error('Producto no encontrado.');
      return product;
    }
    return api.get<Product>(`/products/${slug}`);
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      await delay(200);
      return mockProducts.filter(p => p.featured).slice(0, limit);
    }
    const response = await api.get<ProductsResponse>('/products', {
      featured: true,
      pageSize: limit,
    });
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    if (USE_MOCK_DATA) {
      await delay(100);
      return mockCategories;
    }
    return api.get<Category[]>('/categories');
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    if (USE_MOCK_DATA) {
      await delay(100);
      const cat = mockCategories.find(c => c.slug === slug);
      if (!cat) throw new Error('Categoría no encontrada.');
      return cat;
    }
    return api.get<Category>(`/categories/${slug}`);
  },

  async searchProducts(query: string, limit = 5): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      await delay(150);
      const q = query.toLowerCase();
      return mockProducts
        .filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.tags?.some(t => t.toLowerCase().includes(q))
        )
        .slice(0, limit);
    }
    const response = await api.get<ProductsResponse>('/products', {
      search: query,
      pageSize: limit,
    });
    return response.data;
  },
};
