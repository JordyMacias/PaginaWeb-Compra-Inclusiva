import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { productsService } from '../services/products';
import type { ProductFilters as FilterType, Category } from '../types';

// =====================================================
// PÁGINA DE CATÁLOGO
// =====================================================

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  // Inicializar filtros desde URL params
  const [filters, setFilters] = useState<FilterType>({
    search: searchParams.get('busqueda') ?? undefined,
    categoryId: searchParams.get('categoria') ?? undefined,
    featured: searchParams.get('destacados') === 'true' || undefined,
    sortBy: (searchParams.get('orden') as FilterType['sortBy']) ?? 'created_at',
    page: 1,
    pageSize: 12,
  });

  const { products, total, totalPages, currentPage, isLoading, error, setPage } =
    useProducts(filters);

  // Cargar categorías
  useEffect(() => {
    productsService.getCategories().then(setCategories).catch(() => {});
  }, []);

  // Sincronizar filtros con URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('busqueda', filters.search);
    if (filters.categoryId) params.set('categoria', filters.categoryId);
    if (filters.featured) params.set('destacados', 'true');
    if (filters.sortBy) params.set('orden', filters.sortBy);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  function handleFiltersChange(newFilters: FilterType) {
    setFilters(newFilters);
  }

  // Título dinámico para la página
  const pageTitle =
    filters.search
      ? `Resultados para "${filters.search}"`
      : filters.categoryId
      ? `Categoría: ${categories.find(c => c.id === filters.categoryId)?.name ?? filters.categoryId}`
      : filters.featured
      ? 'Productos destacados'
      : 'Todos los productos';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Encabezado de la página */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-surface-900">{pageTitle}</h1>
        {!isLoading && (
          <p
            role="status"
            aria-live="polite"
            className="mt-1 text-sm text-surface-500"
          >
            {total === 0
              ? 'No se encontraron productos'
              : `${total} producto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`
            }
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Panel de filtros — sidebar */}
        <aside
          aria-label="Filtros de búsqueda"
          className="lg:w-64 flex-shrink-0"
        >
          <ProductFilters
            filters={filters}
            categories={categories}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        {/* Cuadrícula de productos */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
            emptyMessage={
              filters.search
                ? `No se encontraron resultados para "${filters.search}". Intenta con otras palabras.`
                : 'No hay productos disponibles con los filtros seleccionados.'
            }
            columns={3}
            headingLevel={2}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <nav
              aria-label="Navegación de páginas de productos"
              className="mt-8 flex justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Página anterior"
                className="px-4 py-2 min-h-[44px] rounded-lg border-2 border-surface-300
                           text-sm font-medium text-surface-700 hover:border-primary-600
                           disabled:opacity-40 disabled:cursor-not-allowed
                           focus-visible:ring-2 focus-visible:ring-primary-600"
              >
                ← Anterior
              </button>

              <span
                aria-current="page"
                aria-label={`Página ${currentPage} de ${totalPages}`}
                className="px-4 py-2 min-h-[44px] flex items-center text-sm text-surface-700"
              >
                Página {currentPage} de {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Página siguiente"
                className="px-4 py-2 min-h-[44px] rounded-lg border-2 border-surface-300
                           text-sm font-medium text-surface-700 hover:border-primary-600
                           disabled:opacity-40 disabled:cursor-not-allowed
                           focus-visible:ring-2 focus-visible:ring-primary-600"
              >
                Siguiente →
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
