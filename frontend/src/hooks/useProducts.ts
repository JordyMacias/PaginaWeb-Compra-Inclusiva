import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductsResponse, ProductFilters } from '../types';
import { productsService } from '../services/products';

// =====================================================
// HOOK useProducts
// Gestiona la carga y filtrado del catálogo de productos.
// =====================================================

interface UseProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setPage: (page: number) => void;
}

export function useProducts(filters: ProductFilters = {}): UseProductsResult {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(filters.page ?? 1);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await productsService.getProducts({ ...filters, page });
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar los productos. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.categoryId,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.inStock,
    filters.featured,
    filters.sortBy,
    filters.pageSize,
    page,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products: data?.data ?? [],
    total: data?.meta.total ?? 0,
    totalPages: data?.meta.totalPages ?? 0,
    currentPage: page,
    isLoading,
    error,
    refetch: fetchProducts,
    setPage,
  };
}

// =====================================================
// HOOK useProduct
// Carga un producto individual por su slug.
// =====================================================

interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    productsService
      .getProductBySlug(slug)
      .then(p => setProduct(p))
      .catch(err => {
        setError(
          err instanceof Error
            ? err.message
            : 'Producto no encontrado.'
        );
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { product, isLoading, error };
}
