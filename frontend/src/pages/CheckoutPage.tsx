import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MapPin, CreditCard, CheckCircle,
  ArrowLeft, ArrowRight, Package, Truck, ShieldCheck,
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/orders';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { formatPrice } from '../utils';
import type { Order } from '../types';

// =====================================================
// PÁGINA DE CHECKOUT — 3 pasos
// 1. Dirección de envío
// 2. Revisión del pedido
// 3. Confirmación
// =====================================================

// ── Esquema de validación de dirección ───────────────

const addressSchema = z.object({
  recipientName: z.string().min(2, 'El nombre del destinatario es obligatorio.'),
  street:        z.string().min(5, 'Escribe la dirección completa.'),
  apartment:     z.string().optional(),
  city:          z.string().min(2, 'La ciudad es obligatoria.'),
  state:         z.string().min(2, 'La provincia o estado es obligatorio.'),
  country:       z.string().min(2, 'El país es obligatorio.'),
  zipCode:       z.string().min(3, 'El código postal es obligatorio.'),
  phone:         z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

type Step = 'address' | 'review' | 'confirmed';

// ── Indicador de pasos ────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'address',   label: 'Dirección', icon: MapPin },
    { id: 'review',    label: 'Revisión',  icon: CreditCard },
    { id: 'confirmed', label: 'Confirmado',icon: CheckCircle },
  ];

  const order: Record<Step, number> = { address: 0, review: 1, confirmed: 2 };
  const currentIndex = order[current];

  return (
    <nav aria-label="Pasos del proceso de compra" className="mb-8">
      <ol className="flex items-center gap-0">
        {steps.map((step, idx) => {
          const done    = idx < currentIndex;
          const active  = idx === currentIndex;
          const Icon    = step.icon;

          return (
            <li key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  aria-current={active ? 'step' : undefined}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                              transition-colors duration-200
                              ${done    ? 'bg-success-600 text-white'
                              : active  ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                              :           'bg-surface-200 text-surface-400'}`}
                  aria-label={`Paso ${idx + 1}: ${step.label}${done ? ' — completado' : active ? ' — actual' : ''}`}
                >
                  {done ? <CheckCircle aria-hidden="true" size={18} /> : <Icon aria-hidden="true" size={18} />}
                </div>
                <span className={`mt-1.5 text-xs font-medium ${active ? 'text-primary-700' : done ? 'text-success-600' : 'text-surface-400'}`}>
                  {step.label}
                </span>
              </div>

              {/* Línea separadora */}
              {idx < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`h-0.5 flex-1 mx-1 mb-4 transition-colors duration-300
                              ${idx < currentIndex ? 'bg-success-600' : 'bg-surface-200'}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Componente principal ──────────────────────────────

export function CheckoutPage() {
  const navigate    = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep]       = useState<Step>('address');
  const [address, setAddress] = useState<AddressFormData | null>(null);
  const [order, setOrder]     = useState<Order | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  // Redirigir al carrito si está vacío
  if (cart.items.length === 0 && step !== 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Package aria-hidden="true" size={48} className="mx-auto mb-4 text-surface-300" />
        <h1 className="text-2xl font-bold text-surface-900 mb-2">El carrito está vacío</h1>
        <p className="text-surface-500 mb-6">Añade productos antes de finalizar la compra.</p>
        <Link to="/catalogo">
          <Button variant="primary">Ver productos</Button>
        </Link>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated && step !== 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Inicia sesión para continuar</h1>
        <p className="text-surface-500 mb-6">Necesitas una cuenta para finalizar tu compra.</p>
        <Link to="/login" state={{ from: '/checkout' }}>
          <Button variant="primary">Iniciar sesión</Button>
        </Link>
      </div>
    );
  }

  // ── Paso 1: Dirección ──────────────────────────────

  if (step === 'address') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator current="address" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">Dirección de envío</h1>
            <p className="text-surface-500 text-sm mb-6">¿Dónde enviamos tu pedido?</p>
            <AddressForm
              defaultName={user?.name ?? ''}
              onSubmit={data => { setAddress(data); setStep('review'); }}
            />
          </div>
          <OrderSidebar cart={cart} />
        </div>
      </div>
    );
  }

  // ── Paso 2: Revisión ──────────────────────────────

  if (step === 'review') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator current="review" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <h1 className="text-2xl font-bold text-surface-900">Revisa tu pedido</h1>

            {error && <Alert severity="error">{error}</Alert>}

            {/* Dirección confirmada */}
            <section aria-labelledby="address-summary" className="bg-white rounded-xl border border-surface-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 id="address-summary" className="font-semibold text-surface-900 flex items-center gap-2">
                  <MapPin aria-hidden="true" size={16} className="text-primary-600" />
                  Dirección de entrega
                </h2>
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="text-sm text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-600 rounded min-h-[44px] px-2"
                >
                  Cambiar
                </button>
              </div>
              {address && (
                <address className="not-italic text-sm text-surface-700 leading-relaxed">
                  <strong>{address.recipientName}</strong><br />
                  {address.street}{address.apartment ? `, ${address.apartment}` : ''}<br />
                  {address.zipCode} {address.city}, {address.state}<br />
                  {address.country}
                  {address.phone && <><br />{address.phone}</>}
                </address>
              )}
            </section>

            {/* Artículos */}
            <section aria-labelledby="items-summary" className="bg-white rounded-xl border border-surface-200 p-5">
              <h2 id="items-summary" className="font-semibold text-surface-900 mb-4">
                Artículos ({cart.itemCount})
              </h2>
              <ul role="list" className="divide-y divide-surface-100">
                {cart.items.map(item => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    {item.product.images[0] && (
                      <img
                        src={item.product.images[0].url}
                        alt=""
                        aria-hidden="true"
                        className="w-12 h-12 rounded-lg object-cover bg-surface-100 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {item.product.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-surface-500">{item.variant.name}: {item.variant.value}</p>
                      )}
                      <p className="text-xs text-surface-500">
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-surface-900 flex-shrink-0">
                      {formatPrice(item.subtotal)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Pago simulado */}
            <section aria-labelledby="payment-summary" className="bg-white rounded-xl border border-surface-200 p-5">
              <h2 id="payment-summary" className="font-semibold text-surface-900 mb-3 flex items-center gap-2">
                <CreditCard aria-hidden="true" size={16} className="text-primary-600" />
                Método de pago
              </h2>
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg border border-surface-200">
                <ShieldCheck aria-hidden="true" size={20} className="text-success-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-surface-800">Pago seguro simulado</p>
                  <p className="text-xs text-surface-500">
                    En producción se integraría con Stripe u otro proveedor de pagos.
                  </p>
                </div>
              </div>
            </section>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setStep('address')}
                leftIcon={<ArrowLeft size={16} />}
              >
                Volver
              </Button>
              <Button
                variant="primary"
                size="lg"
                isLoading={placing}
                loadingText="Procesando pedido..."
                onClick={async () => {
                  if (!address) return;
                  setError(null);
                  setPlacing(true);
                  try {
                    const created = await ordersService.createOrder({
                      items: cart.items.map(i => ({
                        productId: i.productId,
                        variantId: i.variantId,
                        quantity:  i.quantity,
                        unitPrice: i.unitPrice,
                      })),
                      shippingAddress: address,
                      shippingMethod:  'standard',
                    });
                    setOrder(created);
                    clearCart();
                    setStep('confirmed');
                  } catch (err: unknown) {
                    const msg = typeof err === 'object' && err !== null && 'message' in err
                      ? String((err as { message: string }).message)
                      : 'No se pudo procesar el pedido. Inténtalo de nuevo.';
                    setError(msg);
                  } finally {
                    setPlacing(false);
                  }
                }}
                rightIcon={<ArrowRight size={16} />}
              >
                Confirmar y pagar
              </Button>
            </div>
          </div>

          <OrderSidebar cart={cart} />
        </div>
      </div>
    );
  }

  // ── Paso 3: Confirmación ─────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <StepIndicator current="confirmed" />

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 text-center">
        <div
          aria-hidden="true"
          className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle size={36} className="text-success-600" />
        </div>

        <h1 className="text-2xl font-bold text-surface-900 mb-2">
          ¡Pedido confirmado!
        </h1>
        <p className="text-surface-600 mb-1">
          Gracias por tu compra. Recibirás una confirmación en tu correo.
        </p>
        {order && (
          <p className="text-sm font-semibold text-primary-700 mb-6">
            Número de pedido: <span className="font-mono">{order.orderNumber}</span>
          </p>
        )}

        {/* Resumen del pedido confirmado */}
        {order && (
          <div className="text-left bg-surface-50 rounded-xl p-4 mb-6">
            <h2 className="text-sm font-semibold text-surface-700 mb-3">Resumen</h2>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-1 text-surface-600">Subtotal</td>
                  <td className="py-1 text-right font-medium">{formatPrice(order.subtotal)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-surface-600">Envío</td>
                  <td className="py-1 text-right font-medium">
                    {order.shipping === 0
                      ? <span className="text-success-600">Gratis</span>
                      : formatPrice(order.shipping)
                    }
                  </td>
                </tr>
                <tr>
                  <td className="py-1 text-surface-600">Impuestos</td>
                  <td className="py-1 text-right text-surface-500">{formatPrice(order.tax)}</td>
                </tr>
                <tr className="border-t border-surface-200">
                  <td className="py-2 font-bold text-surface-900">Total pagado</td>
                  <td className="py-2 text-right font-bold text-surface-900 text-lg">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center gap-2 justify-center text-sm text-surface-500 mb-6">
          <Truck aria-hidden="true" size={15} />
          <span>Entrega estimada: 2-5 días laborables</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/perfil">
            <Button variant="secondary" leftIcon={<Package size={16} />}>
              Ver mis pedidos
            </Button>
          </Link>
          <Link to="/catalogo">
            <Button variant="primary">
              Seguir comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Formulario de dirección ────────────────────────────────────────────────

function AddressForm({
  defaultName,
  onSubmit,
}: {
  defaultName: string;
  onSubmit: (data: AddressFormData) => void;
}) {
  const { register, handleSubmit, formState: { errors } } =
    useForm<AddressFormData>({
      resolver: zodResolver(addressSchema),
      defaultValues: { recipientName: defaultName, country: 'España' },
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulario de dirección de envío"
      className="bg-white rounded-xl border border-surface-200 p-6 space-y-4"
    >
      <Input
        label="Nombre del destinatario"
        autoComplete="name"
        required
        error={errors.recipientName?.message}
        {...register('recipientName')}
      />

      <Input
        label="Dirección"
        autoComplete="street-address"
        placeholder="Calle, número, piso..."
        required
        error={errors.street?.message}
        {...register('street')}
      />

      <Input
        label="Piso / Apartamento / Bloque"
        autoComplete="address-line2"
        placeholder="Opcional"
        error={errors.apartment?.message}
        {...register('apartment')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Código postal"
          autoComplete="postal-code"
          inputMode="numeric"
          required
          error={errors.zipCode?.message}
          {...register('zipCode')}
        />
        <Input
          label="Ciudad"
          autoComplete="address-level2"
          required
          error={errors.city?.message}
          {...register('city')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Provincia / Estado"
          autoComplete="address-level1"
          required
          error={errors.state?.message}
          {...register('state')}
        />
        <Input
          label="País"
          autoComplete="country-name"
          required
          error={errors.country?.message}
          {...register('country')}
        />
      </div>

      <Input
        label="Teléfono de contacto"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="Opcional, para gestión del envío"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        rightIcon={<ArrowRight size={18} />}
      >
        Continuar a la revisión
      </Button>
    </form>
  );
}

// ── Sidebar con resumen del pedido ────────────────────────────────────────

function OrderSidebar({ cart }: { cart: ReturnType<typeof useCart>['cart'] }) {
  return (
    <aside aria-label="Resumen del pedido" className="bg-surface-50 rounded-xl border border-surface-200 p-5 h-fit">
      <h2 className="text-base font-bold text-surface-900 mb-4">Tu pedido</h2>
      <ul role="list" className="space-y-2 mb-4">
        {cart.items.map(item => (
          <li key={item.id} className="flex justify-between text-sm">
            <span className="text-surface-700 truncate mr-2">
              {item.product.name}
              {item.variant && <span className="text-surface-400"> ({item.variant.value})</span>}
              <span className="text-surface-400"> ×{item.quantity}</span>
            </span>
            <span className="font-medium text-surface-900 flex-shrink-0">
              {formatPrice(item.subtotal)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-surface-200 pt-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-surface-600">Subtotal</span>
          <span className="font-medium">{formatPrice(cart.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-surface-600">Envío</span>
          <span className={cart.shipping === 0 ? 'text-success-600 font-semibold' : 'font-medium'}>
            {cart.shipping === 0 ? 'Gratis' : formatPrice(cart.shipping)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-surface-600">Impuestos</span>
          <span className="text-surface-400">{formatPrice(cart.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-surface-200 pt-2 mt-1">
          <span className="font-bold text-surface-900">Total</span>
          <span className="font-bold text-surface-900 text-lg">{formatPrice(cart.total)}</span>
        </div>
      </div>
    </aside>
  );
}
