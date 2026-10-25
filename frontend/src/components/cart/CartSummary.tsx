import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Truck } from 'lucide-react';
import type { Cart } from '../../types';
import { formatPrice } from '../../utils';
import { Button } from '../common/Button';

// =====================================================
// COMPONENTE CART SUMMARY — Resumen del carrito
// - Tabla accesible con thead/tbody
// - Totales claramente diferenciados
// - Información de envío gratuito
// =====================================================

interface CartSummaryProps {
  cart: Cart;
  showCheckoutButton?: boolean;
}

const FREE_SHIPPING_THRESHOLD = 50;

export function CartSummary({ cart, showCheckoutButton = true }: CartSummaryProps) {
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - cart.subtotal;

  return (
    <aside
      aria-label="Resumen del pedido"
      className="bg-surface-50 rounded-xl border border-surface-200 p-5"
    >
      <h2 className="text-lg font-bold text-surface-900 mb-4">
        Resumen del pedido
      </h2>

      {/* Barra de progreso de envío gratuito */}
      {remainingForFreeShipping > 0 && cart.items.length > 0 && (
        <div
          className="mb-5 p-3 bg-primary-50 rounded-lg border border-primary-200"
          role="note"
          aria-label={`Añade ${formatPrice(remainingForFreeShipping)} más para envío gratuito`}
        >
          <div className="flex items-center gap-2 text-sm text-primary-700 mb-2">
            <Truck aria-hidden="true" size={16} />
            <span>
              Añade <strong>{formatPrice(remainingForFreeShipping)}</strong> más
              para envío gratuito
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.round((cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso hacia envío gratuito: ${Math.round((cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`}
            className="w-full h-2 bg-primary-200 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Desglose de precios */}
      <table className="w-full text-sm" aria-label="Desglose del pedido">
        <caption className="sr-only">
          Desglose de precios del pedido
        </caption>
        <tbody>
          <tr>
            <td className="py-1.5 text-surface-600">
              Subtotal ({cart.itemCount} {cart.itemCount === 1 ? 'artículo' : 'artículos'})
            </td>
            <td className="py-1.5 text-right font-medium text-surface-900">
              {formatPrice(cart.subtotal)}
            </td>
          </tr>

          <tr>
            <td className="py-1.5 text-surface-600">
              Envío
            </td>
            <td className="py-1.5 text-right font-medium">
              {cart.shipping === 0 ? (
                <span className="text-success-600 font-semibold">
                  Gratis
                </span>
              ) : (
                <span className="text-surface-900">{formatPrice(cart.shipping)}</span>
              )}
            </td>
          </tr>

          <tr>
            <td className="py-1.5 text-surface-600">
              IVA incluido (21%)
            </td>
            <td className="py-1.5 text-right text-surface-500">
              {formatPrice(cart.tax)}
            </td>
          </tr>

          <tr className="border-t border-surface-300">
            <td className="py-3 text-base font-bold text-surface-900">
              Total
            </td>
            <td
              className="py-3 text-right text-xl font-bold text-surface-900"
              aria-label={`Total del pedido: ${formatPrice(cart.total)}`}
            >
              {formatPrice(cart.total)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Botón de checkout */}
      {showCheckoutButton && (
        <div className="mt-4">
          {cart.items.length > 0 ? (
            <Link to="/checkout" className="block">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={18} />}
              >
                Finalizar compra
              </Button>
            </Link>
          ) : (
            <>
              <Button variant="primary" size="lg" fullWidth disabled>
                Finalizar compra
              </Button>
              <Link
                to="/catalogo"
                className="mt-3 flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
              >
                <ShoppingCart aria-hidden="true" size={16} />
                Ver productos
              </Link>
            </>
          )}
        </div>
      )}

      {/* Sellos de confianza */}
      <div
        className="mt-5 pt-4 border-t border-surface-200"
        aria-label="Garantías de compra segura"
      >
        {[
          '🔒 Pago 100% seguro',
          '↩️ Devolución gratuita en 30 días',
          '📦 Envío en 2-5 días laborables',
        ].map(item => (
          <p key={item} className="text-xs text-surface-500 py-0.5">
            {item}
          </p>
        ))}
      </div>
    </aside>
  );
}
