import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { CartItemRow } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/common/Button';

// =====================================================
// PÁGINA DE CARRITO
// =====================================================

export function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <h1 className="text-3xl font-bold text-surface-900 mb-2">
        Tu carrito
      </h1>

      {/* Contador accesible */}
      <p
        role="status"
        aria-live="polite"
        className="text-sm text-surface-500 mb-8"
      >
        {cart.itemCount === 0
          ? 'El carrito está vacío.'
          : `${cart.itemCount} ${cart.itemCount === 1 ? 'artículo' : 'artículos'} en el carrito`
        }
      </p>

      {cart.items.length === 0 ? (
        /* Estado vacío */
        <div className="text-center py-20">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center"
          >
            <ShoppingBag size={36} className="text-surface-400" />
          </div>
          <h2 className="text-xl font-semibold text-surface-800 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-surface-500 mb-6 max-w-sm mx-auto">
            Todavía no has añadido ningún producto. ¡Explora nuestro catálogo y
            encuentra algo que te guste!
          </p>
          <Link to="/catalogo">
            <Button variant="primary" size="lg" leftIcon={<ArrowLeft size={18} />}>
              Ver productos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-800">
                Artículos
              </h2>
              <button
                type="button"
                onClick={clearCart}
                className="text-sm text-error-600 hover:text-error-700
                           focus-visible:ring-2 focus-visible:ring-error-600 rounded
                           min-h-[44px] px-2"
                aria-label="Vaciar el carrito, eliminar todos los artículos"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Lista con role="list" para semántica correcta */}
            <ul role="list" aria-label="Artículos en el carrito">
              {cart.items.map(item => (
                <li key={item.id}>
                  <CartItemRow
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                </li>
              ))}
            </ul>

            {/* Enlace para seguir comprando */}
            <div className="mt-4">
              <Link
                to="/catalogo"
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700
                           focus-visible:ring-2 focus-visible:ring-primary-600 rounded min-h-[44px]"
              >
                <ArrowLeft aria-hidden="true" size={16} />
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <CartSummary cart={cart} showCheckoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
