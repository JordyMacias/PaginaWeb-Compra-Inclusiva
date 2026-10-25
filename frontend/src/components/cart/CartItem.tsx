import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { formatPrice, cn } from '../../utils';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

// =====================================================
// COMPONENTE CART ITEM — Ítem del carrito
// - Controles de cantidad accesibles con aria-label dinámicos
// - Confirmación antes de eliminar (WCAG 3.3.4)
// - Precio anunciado correctamente
// =====================================================

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const image = item.product.images.find(i => i.isPrimary) ?? item.product.images[0];

  function confirmRemove() {
    setShowConfirmDelete(false);
    onRemove(item.id);
  }

  return (
    <>
      <article
        aria-label={`${item.product.name} en el carrito`}
        className="flex gap-4 py-5 border-b border-surface-200 last:border-0"
      >
        {/* Imagen */}
        <Link
          to={`/producto/${item.product.slug}`}
          aria-label={`Ver detalles de ${item.product.name}`}
          className="flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary-600 rounded-lg"
        >
          {image ? (
            <img
              src={image.url}
              alt={image.alt}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-lg bg-surface-100"
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-surface-200 flex items-center justify-center">
              <span className="sr-only">Sin imagen</span>
            </div>
          )}
        </Link>

        {/* Info del producto */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-surface-900 leading-snug">
            <Link
              to={`/producto/${item.product.slug}`}
              className="hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
            >
              {item.product.name}
            </Link>
          </h3>

          {item.variant && (
            <p className="text-xs text-surface-500 mt-0.5">
              {item.variant.name}: {item.variant.value}
            </p>
          )}

          <p
            className="text-sm font-semibold text-surface-900 mt-1"
            aria-label={`Precio unitario: ${formatPrice(item.unitPrice)}`}
          >
            {formatPrice(item.unitPrice)}
          </p>

          {/* Controles de cantidad */}
          <div className="flex items-center gap-2 mt-2">
            <div
              role="group"
              aria-label={`Cantidad de ${item.product.name}`}
              className="flex items-center border-2 border-surface-300 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label={`Disminuir cantidad de ${item.product.name}`}
                className={cn(
                  'min-h-[44px] min-w-[44px] flex items-center justify-center',
                  'text-surface-600 hover:bg-surface-100 transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-primary-600',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <Minus aria-hidden="true" size={14} />
              </button>

              <span
                aria-label={`Cantidad actual: ${item.quantity}`}
                className="px-3 text-sm font-medium text-surface-800 min-w-[2.5rem] text-center"
              >
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.stock}
                aria-label={`Aumentar cantidad de ${item.product.name}`}
                className={cn(
                  'min-h-[44px] min-w-[44px] flex items-center justify-center',
                  'text-surface-600 hover:bg-surface-100 transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-primary-600',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <Plus aria-hidden="true" size={14} />
              </button>
            </div>

            {/* Botón eliminar */}
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              aria-label={`Eliminar ${item.product.name} del carrito`}
              className={cn(
                'min-h-[44px] min-w-[44px] flex items-center justify-center',
                'rounded-lg text-error-600 hover:bg-error-100 transition-colors',
                'focus-visible:ring-2 focus-visible:ring-error-600'
              )}
            >
              <Trash2 aria-hidden="true" size={16} />
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="flex-shrink-0 text-right">
          <p
            className="text-base font-bold text-surface-900"
            aria-label={`Subtotal ${item.product.name}: ${formatPrice(item.subtotal)}`}
          >
            {formatPrice(item.subtotal)}
          </p>
        </div>
      </article>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Eliminar producto"
        description={`¿Quieres eliminar "${item.product.name}" del carrito?`}
        size="sm"
      >
        <div className="flex gap-3 justify-end mt-4">
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDelete(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmRemove}
            leftIcon={<Trash2 size={16} />}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </>
  );
}
