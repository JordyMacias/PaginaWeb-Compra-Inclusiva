import React from 'react';
import { ProductCard } from './ProductCard';
import { Spinner } from '../common/Spinner';
import { Alert } from '../common/Alert';
import type { Product } from '../../types';

// =====================================================
// COMPONENTE PRODUCT GRID — Cuadrícula de productos
// - Lista semántica <ul>/<li>
// - Estado de carga accesible con aria-live
// - Mensaje de sin resultados descriptivo
// =====================================================

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error?: string | null;
  emptyMessage?: string;
  headingLevel?: 2 | 3 | 4;
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export function ProductGrid({
  products,
  isLoading,
  error,
  emptyMessage = 'No se encontraron productos.',
  headingLevel = 3,
  columns = 4,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div aria-live="polite" aria-busy="true">
        <Spinner size="lg" label="Cargando productos..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" title="No se pudieron cargar los productos">
        {error}
        <p className="mt-1 text-sm">
          Intenta recargar la página o vuelve a intentarlo más tarde.
        </p>
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="text-center py-16 px-4"
      >
        <svg
          aria-hidden="true"
          className="mx-auto mb-4 w-16 h-16 text-surface-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-medium text-surface-600">{emptyMessage}</p>
        <p className="mt-1 text-sm text-surface-500">
          Prueba a cambiar los filtros o a buscar con otras palabras.
        </p>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
    >
      <ul
        className={`grid ${columnClasses[columns]} gap-4 sm:gap-6`}
        aria-label={`${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
      >
        {products.map(product => (
          <li key={product.id} className="flex">
            <ProductCard
              product={product}
              headingLevel={headingLevel}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
