import React, { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { Category, ProductFilters as FilterType } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { cn } from '../../utils';

// =====================================================
// COMPONENTE PRODUCT FILTERS — Filtros del catálogo
// - Fieldsets con legends para agrupar controles (WCAG 1.3.1)
// - Rango de precios con inputs numéricos
// - Checkboxes accesibles
// - Botón claro de limpiar filtros
// =====================================================

interface ProductFiltersProps {
  filters: FilterType;
  categories: Category[];
  onFiltersChange: (filters: FilterType) => void;
}

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Más recientes' },
  { value: 'name', label: 'Nombre A-Z' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
] as const;

export function ProductFilters({
  filters,
  categories,
  onFiltersChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  function updateFilter<K extends keyof FilterType>(
    key: K,
    value: FilterType[K]
  ) {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  }

  function clearFilters() {
    onFiltersChange({
      page: 1,
      pageSize: filters.pageSize,
      sortBy: filters.sortBy,
    });
  }

  const hasActiveFilters = !!(
    filters.categoryId ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStock
  );

  return (
    <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
      {/* Cabecera del panel de filtros */}
      <div className="p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="filters-panel"
          className={cn(
            'flex items-center gap-2 font-semibold text-surface-800',
            'focus-visible:ring-2 focus-visible:ring-primary-600 rounded',
            'min-h-[44px]'
          )}
        >
          <SlidersHorizontal aria-hidden="true" size={18} />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span
              aria-label="Filtros activos"
              className="w-2 h-2 bg-primary-600 rounded-full"
              aria-hidden="true"
            />
          )}
          {isOpen
            ? <ChevronUp aria-hidden="true" size={16} />
            : <ChevronDown aria-hidden="true" size={16} />
          }
        </button>

        {/* Ordenar */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-surface-600 sr-only">
            Ordenar por
          </label>
          <select
            id="sort-select"
            value={filters.sortBy ?? 'created_at'}
            onChange={e =>
              updateFilter(
                'sortBy',
                e.target.value as FilterType['sortBy']
              )
            }
            className={cn(
              'rounded-lg border-2 border-surface-300 px-3 py-2 text-sm',
              'focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600',
              'min-h-[44px]'
            )}
            aria-label="Ordenar productos"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Panel de filtros expandible */}
      <div
        id="filters-panel"
        hidden={!isOpen}
        className="border-t border-surface-200 p-4 space-y-5"
      >
        {/* Filtro por categoría */}
        <fieldset>
          <legend className="text-sm font-semibold text-surface-800 mb-2">
            Categoría
          </legend>
          <ul className="space-y-1" role="list">
            <li>
              <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={!filters.categoryId}
                  onChange={() => updateFilter('categoryId', undefined)}
                  className="w-4 h-4 accent-primary-600"
                />
                <span className="text-sm text-surface-700">Todas las categorías</span>
              </label>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={filters.categoryId === cat.id}
                    onChange={() => updateFilter('categoryId', cat.id)}
                    className="w-4 h-4 accent-primary-600"
                  />
                  <span className="text-sm text-surface-700">{cat.name}</span>
                  {cat._count && (
                    <span className="text-xs text-surface-400 ml-auto">
                      {cat._count.products}
                    </span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        {/* Rango de precio */}
        <fieldset>
          <legend className="text-sm font-semibold text-surface-800 mb-2">
            Rango de precio
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Precio mínimo"
              type="number"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={e =>
                updateFilter(
                  'minPrice',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="0"
              leftAddon="€"
            />
            <Input
              label="Precio máximo"
              type="number"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={e =>
                updateFilter(
                  'maxPrice',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Sin límite"
              leftAddon="€"
            />
          </div>
        </fieldset>

        {/* Disponibilidad */}
        <fieldset>
          <legend className="text-sm font-semibold text-surface-800 mb-2">
            Disponibilidad
          </legend>
          <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={filters.inStock ?? false}
              onChange={e => updateFilter('inStock', e.target.checked || undefined)}
              className="w-4 h-4 rounded accent-primary-600"
            />
            <span className="text-sm text-surface-700">
              Solo productos disponibles
            </span>
          </label>
        </fieldset>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            leftIcon={<X size={14} />}
            fullWidth
            aria-label="Eliminar todos los filtros activos"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
