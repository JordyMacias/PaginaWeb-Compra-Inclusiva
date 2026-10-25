import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import type { Cart, CartItem, Product, ProductVariant } from '../types';
import { useAnnounce } from '../hooks/useAnnounce';
import { formatPrice } from '../utils';

// =====================================================
// CONTEXTO DEL CARRITO
// Estado del carrito persistido en localStorage.
// Anuncia cambios a lectores de pantalla via useAnnounce.
// =====================================================

interface CartContextValue {
  cart: Cart;
  isCartOpen: boolean;
  addItem: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// --- Estado y acciones del reducer ---

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number; variant?: ProductVariant }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] };

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
}

const TAX_RATE = 0.21;         // IVA 21%
const FREE_SHIPPING_THRESHOLD = 50; // Envío gratis a partir de 50 €
const SHIPPING_COST = 4.99;

function calculateCart(items: CartItem[]): Cart {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0
    ? 0
    : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return { items, itemCount, subtotal, tax, shipping, total };
}

function generateItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}-${variantId}` : productId;
}

function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, variant } = action;
      const itemId = generateItemId(product.id, variant?.id);
      const unitPrice = product.price + (variant?.priceAdjustment ?? 0);

      const existingIndex = state.items.findIndex(i => i.id === itemId);

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        // Actualizar cantidad del ítem existente
        newItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.unitPrice,
              }
            : item
        );
      } else {
        // Añadir nuevo ítem
        const newItem: CartItem = {
          id: itemId,
          product,
          productId: product.id,
          variant,
          variantId: variant?.id,
          quantity,
          unitPrice,
          subtotal: quantity * unitPrice,
        };
        newItems = [...state.items, newItem];
      }

      return { ...state, items: newItems };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.itemId),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.id !== action.itemId),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.itemId
            ? {
                ...item,
                quantity: action.quantity,
                subtotal: action.quantity * item.unitPrice,
              }
            : item
        ),
      };
    }

    case 'CLEAR':
      return { ...state, items: [] };

    case 'LOAD':
      return { ...state, items: action.items };

    default:
      return state;
  }
}

const CART_STORAGE_KEY = 'compra-inclusiva-cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage no disponible
  }
}

// --- Contexto y Provider ---

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadCartFromStorage(),
    isCartOpen: false,
  });

  const { announce } = useAnnounce();

  // Persistir carrito cuando cambia
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addItem = useCallback(
    (product: Product, quantity: number, variant?: ProductVariant) => {
      dispatch({ type: 'ADD_ITEM', product, quantity, variant });
      // Anunciar al lector de pantalla
      announce(
        `${product.name} añadido al carrito. Cantidad: ${quantity}.`,
        'polite'
      );
    },
    [announce]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      const item = state.items.find(i => i.id === itemId);
      dispatch({ type: 'REMOVE_ITEM', itemId });
      if (item) {
        announce(`${item.product.name} eliminado del carrito.`, 'polite');
      }
    },
    [state.items, announce]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      dispatch({ type: 'UPDATE_QUANTITY', itemId, quantity });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    announce('El carrito ha sido vaciado.', 'polite');
  }, [announce]);

  const openCart = useCallback(() => {
    dispatch({ type: 'LOAD', items: state.items });
    window.dispatchEvent(new CustomEvent('cart:open'));
  }, [state.items]);

  const closeCart = useCallback(() => {
    window.dispatchEvent(new CustomEvent('cart:close'));
  }, []);

  const toggleCart = useCallback(() => {
    window.dispatchEvent(new CustomEvent('cart:toggle'));
  }, []);

  const cart = calculateCart(state.items);

  // Anunciar total actualizado cuando cambia el carrito
  useEffect(() => {
    if (state.items.length > 0) {
      // Solo anunciar si hubo cambio (no en la carga inicial)
    }
  }, [state.items]);

  const value: CartContextValue = {
    cart,
    isCartOpen: state.isCartOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return ctx;
}

// Re-exportar para uso en componentes
export { formatPrice };
