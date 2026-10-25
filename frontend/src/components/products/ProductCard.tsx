import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice, discountPercent, cn } from '../../utils';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useCart } from '../../hooks/useCart';

// =====================================================
// COMPONENTE PRODUCT CARD — Tarjeta de producto
// - Artículo HTML semántico con heading jerárquico
// - Imagen con alt descriptivo obligatorio
// - Precio con contexto textual (no solo número)
// - Botón de añadir al carrito con label descriptivo
// - Información de disponibilidad accesible
// =====================================================

interface ProductCardProps {
  product: Product;
  headingLevel?: 2 | 3 | 4;
}

const headingComponents: Record<2 | 3 | 4, React.ElementType> = {
  2: 'h2',
  3: 'h3',
  4: 'h4',
};

export function ProductCard({
  product,
  headingLevel = 3,
}: ProductCardProps) {
  const HeadingTag = headingComponents[headingLevel];
  const { addItem } = useCart();
  const primaryImage = product.images.find(img => img.isPrimary) ?? product.images[0];
  const isOutOfStock = product.stock === 0;
  const discount = product.compareAtPrice
    ? discountPercent(product.compareAtPrice, product.price)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();  // Evitar navegación si la card es un link
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
    }
  }

  return (
    <article
      aria-label={`Producto: ${product.name}`}
      className={cn(
        'card group relative flex flex-col',
        'hover:shadow-md transition-shadow duration-200'
      )}
    >
      {/* Imagen del producto */}
      <Link
        to={`/producto/${product.slug}`}
        aria-label={`Ver detalles de ${product.name}`}
        tabIndex={-1}  /* El heading ya enlaza al producto */
        aria-hidden="true"
        className="relative overflow-hidden aspect-square bg-surface-100"
      >
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
            className={cn(
              'w-full h-full object-cover transition-transform duration-300',
              'group-hover:scale-105',
              isOutOfStock && 'opacity-60 grayscale'
            )}
            loading="lazy"
            width={400}
            height={400}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-surface-300"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges superpuestos */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge variant="error" className="text-xs">
              -{discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge variant="primary" className="text-xs">
              Destacado
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="neutral" className="text-xs">
              Agotado
            </Badge>
          )}
        </div>
      </Link>

      {/* Información del producto */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Categoría */}
        <p className="text-xs text-surface-500 uppercase tracking-wide">
          {product.category.name}
        </p>

        {/* Nombre — es el heading principal de la tarjeta */}
        <HeadingTag className="text-base font-semibold text-surface-900 leading-snug line-clamp-2">
          <Link
            to={`/producto/${product.slug}`}
            className={cn(
              'hover:text-primary-600 transition-colors',
              'focus-visible:ring-2 focus-visible:ring-primary-600 rounded'
            )}
          >
            {product.name}
          </Link>
        </HeadingTag>

        {/* Valoración */}
        {product.rating !== undefined && product.reviewCount !== undefined && (
          <div
            className="flex items-center gap-1.5"
            aria-label={`Valoración: ${product.rating.toFixed(1)} de 5 estrellas. ${product.reviewCount} valoraciones`}
          >
            <div aria-hidden="true" className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={12}
                  className={
                    star <= Math.round(product.rating!)
                      ? 'text-accent-500 fill-accent-500'
                      : 'text-surface-300'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-surface-500">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Precios */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span
            className="text-xl font-bold text-surface-900"
            aria-label={`Precio: ${formatPrice(product.price)}`}
          >
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span
              className="text-sm text-surface-400 line-through"
              aria-label={`Precio anterior: ${formatPrice(product.compareAtPrice)}`}
            >
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Botón de añadir al carrito */}
        <Button
          variant={isOutOfStock ? 'secondary' : 'primary'}
          size="sm"
          fullWidth
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          aria-label={
            isOutOfStock
              ? `${product.name} — Agotado`
              : `Añadir ${product.name} al carrito`
          }
          leftIcon={
            !isOutOfStock ? <ShoppingCart size={16} aria-hidden="true" /> : undefined
          }
        >
          {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
        </Button>
      </div>
    </article>
  );
}
