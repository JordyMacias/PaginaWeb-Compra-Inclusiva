import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  Minus,
  Plus,
  Star,
} from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';
import { formatPrice, discountPercent } from '../utils';
import type { ProductVariant } from '../types';

// =====================================================
// PÁGINA DE DETALLE DE PRODUCTO
// =====================================================

export function ProductDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { product, isLoading, error } = useProduct(slug);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  if (isLoading) return <Spinner size="lg" label="Cargando producto..." />;

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Alert severity="error" title="Producto no encontrado">
          {error ?? 'El producto que buscas no existe o ha sido retirado.'}
        </Alert>
        <Link
          to="/catalogo"
          className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700
                     focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
        >
          <ChevronLeft aria-hidden="true" size={16} />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const currentPrice =
    product.price + (selectedVariant?.priceAdjustment ?? 0);
  const discount = product.compareAtPrice
    ? discountPercent(product.compareAtPrice, currentPrice)
    : 0;
  const isOutOfStock =
    (selectedVariant ? selectedVariant.stock : product.stock) === 0;
  const maxQuantity = selectedVariant?.stock ?? product.stock;

  function handleAddToCart() {
    addItem(product!, quantity, selectedVariant);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  }

  // Agrupar variantes por nombre (ej: "Talla" → [S, M, L])
  const variantGroups = product.variants.reduce<
    Record<string, ProductVariant[]>
  >((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {});

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Migas de pan */}
      <nav aria-label="Ruta de navegación" className="mb-6">
        <ol className="flex items-center gap-1 text-sm text-surface-500">
          <li>
            <Link
              to="/"
              className="hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
            >
              Inicio
            </Link>
          </li>
          <li aria-hidden="true" className="mx-1">›</li>
          <li>
            <Link
              to="/catalogo"
              className="hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
            >
              Catálogo
            </Link>
          </li>
          <li aria-hidden="true" className="mx-1">›</li>
          <li>
            <Link
              to={`/catalogo?categoria=${product.category.slug}`}
              className="hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true" className="mx-1">›</li>
          <li aria-current="page" className="text-surface-800 font-medium">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ===========================
            GALERÍA DE IMÁGENES
            =========================== */}
        <section aria-label="Galería de imágenes del producto">
          {product.images.length > 0 ? (
            <>
              {/* Imagen principal */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-100 mb-3">
                <img
                  src={product.images[selectedImageIndex]?.url}
                  alt={product.images[selectedImageIndex]?.alt ?? product.name}
                  className="w-full h-full object-cover"
                  width={600}
                  height={600}
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="error">-{discount}% descuento</Badge>
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {product.images.length > 1 && (
                <div
                  role="tablist"
                  aria-label="Miniaturas de imágenes"
                  className="flex gap-2 overflow-x-auto pb-1"
                >
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      role="tab"
                      aria-selected={selectedImageIndex === idx}
                      aria-label={`Ver imagen ${idx + 1}: ${img.alt}`}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2
                                  transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 min-h-[44px]
                                  ${selectedImageIndex === idx
                                    ? 'border-primary-600'
                                    : 'border-surface-200 hover:border-primary-300'
                                  }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div
              className="aspect-square rounded-2xl bg-surface-200 flex items-center justify-center"
              aria-label="Sin imagen disponible"
            >
              <span className="text-surface-400 text-sm">Sin imagen</span>
            </div>
          )}
        </section>

        {/* ===========================
            INFORMACIÓN DEL PRODUCTO
            =========================== */}
        <section aria-label="Información del producto">

          {/* Categoría y nombre */}
          <p className="text-sm text-surface-500 uppercase tracking-wide mb-1">
            {product.category.name}
          </p>

          <h1 className="text-3xl font-bold text-surface-900 mb-3">
            {product.name}
          </h1>

          {/* Valoración */}
          {product.rating !== undefined && product.reviewCount !== undefined && (
            <div
              className="flex items-center gap-2 mb-4"
              aria-label={`Valoración media: ${product.rating.toFixed(1)} sobre 5 estrellas. ${product.reviewCount} valoraciones`}
            >
              <div aria-hidden="true" className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(product.rating!)
                        ? 'text-accent-500 fill-accent-500'
                        : 'text-surface-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-surface-600">
                {product.rating.toFixed(1)} ({product.reviewCount} valoraciones)
              </span>
            </div>
          )}

          {/* Precios */}
          <div className="flex items-baseline gap-3 mb-5">
            <span
              className="text-4xl font-bold text-surface-900"
              aria-label={`Precio: ${formatPrice(currentPrice)}`}
            >
              {formatPrice(currentPrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > currentPrice && (
              <span
                className="text-xl text-surface-400 line-through"
                aria-label={`Precio anterior: ${formatPrice(product.compareAtPrice)}`}
              >
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Disponibilidad */}
          <p
            className={`text-sm font-medium mb-4 flex items-center gap-1.5 ${
              isOutOfStock ? 'text-error-600' : 'text-success-600'
            }`}
            aria-live="polite"
          >
            <span
              aria-hidden="true"
              className={`w-2 h-2 rounded-full ${
                isOutOfStock ? 'bg-error-600' : 'bg-success-600'
              }`}
            />
            {isOutOfStock
              ? 'Agotado'
              : maxQuantity <= 5
              ? `Solo quedan ${maxQuantity} unidades`
              : 'En stock'}
          </p>

          {/* Descripción corta */}
          {product.shortDescription && (
            <p className="text-surface-700 leading-relaxed mb-5">
              {product.shortDescription}
            </p>
          )}

          {/* Variantes agrupadas */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <fieldset key={groupName} className="mb-5">
              <legend className="text-sm font-semibold text-surface-800 mb-2">
                {groupName}:{' '}
                {selectedVariant?.name === groupName && (
                  <span className="font-normal text-surface-600">
                    {selectedVariant.value}
                  </span>
                )}
              </legend>
              <div className="flex flex-wrap gap-2">
                {variants.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() =>
                      setSelectedVariant(
                        selectedVariant?.id === v.id ? undefined : v
                      )
                    }
                    disabled={v.stock === 0}
                    aria-pressed={selectedVariant?.id === v.id}
                    aria-label={`${groupName}: ${v.value}${v.stock === 0 ? ' (agotado)' : ''}`}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium
                                min-h-[44px] transition-colors
                                focus-visible:ring-2 focus-visible:ring-primary-600
                                ${v.stock === 0
                                  ? 'opacity-40 cursor-not-allowed line-through'
                                  : selectedVariant?.id === v.id
                                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                                  : 'border-surface-300 hover:border-primary-400 text-surface-700'
                                }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          {/* Selector de cantidad */}
          <div className="mb-5">
            <label
              htmlFor="quantity-input"
              className="text-sm font-semibold text-surface-800 mb-2 block"
            >
              Cantidad
            </label>
            <div
              role="group"
              aria-label="Selector de cantidad"
              className="flex items-center gap-0 border-2 border-surface-300 rounded-lg w-fit overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center
                           text-surface-600 hover:bg-surface-100 transition-colors
                           focus-visible:ring-2 focus-visible:ring-primary-600
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus aria-hidden="true" size={16} />
              </button>

              <input
                id="quantity-input"
                type="number"
                value={quantity}
                onChange={e =>
                  setQuantity(
                    Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1))
                  )
                }
                min={1}
                max={maxQuantity}
                aria-label={`Cantidad: ${quantity}`}
                className="w-16 text-center text-base font-semibold text-surface-900
                           border-x-2 border-surface-300 py-2.5 focus:outline-none
                           focus:ring-2 focus:ring-primary-600"
              />

              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(maxQuantity, q + 1))}
                disabled={quantity >= maxQuantity}
                aria-label="Aumentar cantidad"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center
                           text-surface-600 hover:bg-surface-100 transition-colors
                           focus-visible:ring-2 focus-visible:ring-primary-600
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus aria-hidden="true" size={16} />
              </button>
            </div>
          </div>

          {/* Confirmación de añadido al carrito */}
          {addedToCart && (
            <Alert severity="success" className="mb-4">
              ¡Producto añadido al carrito! Puedes seguir comprando o ir al carrito
              para finalizar tu pedido.
            </Alert>
          )}

          {/* Acciones principales */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              leftIcon={<ShoppingCart size={20} />}
              aria-label={
                isOutOfStock
                  ? `${product.name} — Producto agotado`
                  : `Añadir ${quantity} ${product.name} al carrito`
              }
            >
              {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              aria-label={`Guardar ${product.name} en favoritos`}
              leftIcon={<Heart size={20} />}
            >
              Guardar
            </Button>
          </div>

          {/* Garantías */}
          <ul className="space-y-2" role="list" aria-label="Garantías del producto">
            {[
              { icon: Truck, text: 'Envío gratuito en pedidos superiores a 50 €' },
              { icon: RotateCcw, text: 'Devolución gratuita en 30 días' },
              { icon: ShieldCheck, text: 'Pago seguro con cifrado SSL' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-surface-600">
                <Icon aria-hidden="true" size={16} className="text-success-600" />
                {text}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ===========================
          DESCRIPCIÓN COMPLETA
          =========================== */}
      <section
        aria-labelledby="description-heading"
        className="mt-14 py-8 border-t border-surface-200"
      >
        <h2
          id="description-heading"
          className="text-2xl font-bold text-surface-900 mb-4"
        >
          Descripción del producto
        </h2>
        <div className="prose prose-surface max-w-none text-surface-700 leading-relaxed">
          <p>{product.description}</p>
        </div>
      </section>
    </main>
  );
}
