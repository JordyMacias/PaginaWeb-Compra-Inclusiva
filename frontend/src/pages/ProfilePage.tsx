import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Mail, Lock, Eye, EyeOff, ShoppingBag,
  Save, CheckCircle, Package, Calendar, Shield,
  ChevronRight, Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import { mockOrders } from '../data/mockOrders';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { formatPrice, formatDate, formatOrderStatus, orderStatusColor } from '../utils';

// =====================================================
// PÁGINA DE PERFIL DE USUARIO
// =====================================================

const profileSchema = z.object({
  name:  z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('Escribe un correo electrónico válido.'),
});

const passwordSchema = z
  .object({
    currentPassword:    z.string().min(1, 'Escribe tu contraseña actual.'),
    newPassword:        z.string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe incluir mayúscula, minúscula y número.'),
    confirmNewPassword: z.string().min(1, 'Confirma la nueva contraseña.'),
  })
  .refine(d => d.newPassword === d.confirmNewPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmNewPassword'],
  });

type ProfileFormData  = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ─── Página principal ─────────────────────────────────────────────────────

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'orders'>('profile');

  if (!user) return null;

  const myOrders = mockOrders.filter(o => o.userId === user.id);
  const totalSpent = myOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((s, o) => s + o.total, 0);

  const tabs = [
    { id: 'profile'  as const, label: 'Mis datos',    icon: User },
    { id: 'password' as const, label: 'Contraseña',   icon: Lock },
    { id: 'orders'   as const, label: 'Mis pedidos',  icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* ─── Cabecera del perfil ─── */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar grande */}
            <div
              aria-hidden="true"
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur border-4 border-white/40
                         flex items-center justify-center text-3xl font-bold text-white flex-shrink-0
                         shadow-lg"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-primary-100 text-sm mt-0.5">{user.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-primary-100">
                  <Calendar aria-hidden="true" size={13} />
                  Miembro desde {formatDate(user.createdAt, { month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-primary-100">
                  <Shield aria-hidden="true" size={13} />
                  {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="flex gap-6 flex-shrink-0">
              <div className="text-center">
                <p
                  className="text-2xl font-bold text-white"
                  aria-label={`${myOrders.length} pedidos realizados`}
                >
                  {myOrders.length}
                </p>
                <p className="text-xs text-primary-200">Pedidos</p>
              </div>
              <div className="text-center">
                <p
                  className="text-2xl font-bold text-white"
                  aria-label={`Total gastado: ${formatPrice(totalSpent)}`}
                >
                  {formatPrice(totalSpent)}
                </p>
                <p className="text-xs text-primary-200">Gastado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Contenido con pestañas ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Navegación */}
        <div
          role="tablist"
          aria-label="Secciones del perfil"
          className="flex gap-1 bg-white rounded-xl border border-surface-200 p-1 mb-6 shadow-sm w-fit"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              id={`tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                          min-h-[44px] transition-all duration-150
                          focus-visible:ring-2 focus-visible:ring-primary-600
                          ${activeTab === id
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                          }`}
            >
              <Icon aria-hidden="true" size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Paneles */}
        <div
          id="panel-profile"
          role="tabpanel"
          aria-labelledby="tab-profile"
          hidden={activeTab !== 'profile'}
        >
          <ProfileForm user={user} onSave={refreshUser} />
        </div>

        <div
          id="panel-password"
          role="tabpanel"
          aria-labelledby="tab-password"
          hidden={activeTab !== 'password'}
        >
          <PasswordForm userId={user.id} />
        </div>

        <div
          id="panel-orders"
          role="tabpanel"
          aria-labelledby="tab-orders"
          hidden={activeTab !== 'orders'}
        >
          <OrdersPanel userId={user.id} />
        </div>
      </div>
    </div>
  );
}

// ─── Editar datos personales ───────────────────────────────────────────────

function ProfileForm({
  user,
  onSave,
}: {
  user: { id: string; name: string; email: string };
  onSave: () => Promise<void>;
}) {
  const [success, setSuccess]     = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } =
    useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: { name: user.name, email: user.email },
    });

  async function onSubmit(data: ProfileFormData) {
    setServerError(null);
    setSuccess(false);
    try {
      await authService.updateProfile(user.id, data);
      await onSave();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setServerError('No se pudo actualizar el perfil. Inténtalo de nuevo.');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Formulario */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-surface-900 mb-1">
            Información personal
          </h2>
          <p className="text-sm text-surface-500 mb-5">
            Actualiza tu nombre y correo electrónico.
          </p>

          {success && (
            <Alert severity="success" className="mb-5">
              <span className="flex items-center gap-2">
                <CheckCircle aria-hidden="true" size={16} />
                Perfil actualizado correctamente.
              </span>
            </Alert>
          )}
          {serverError && <Alert severity="error" className="mb-5">{serverError}</Alert>}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Formulario de edición de perfil"
            className="space-y-4"
          >
            <Input
              label="Nombre completo"
              type="text"
              autoComplete="name"
              required
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="flex items-center gap-3 pt-1">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                loadingText="Guardando..."
                disabled={!isDirty}
                leftIcon={<Save size={16} />}
              >
                Guardar cambios
              </Button>
              {!isDirty && (
                <p className="text-xs text-surface-400">
                  Modifica un campo para guardar.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Panel lateral de info */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
            <Shield aria-hidden="true" size={15} />
            Seguridad de la cuenta
          </h3>
          <ul className="space-y-2 text-sm text-surface-600">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-success-600"></span>
              Contraseña configurada
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="w-2 h-2 rounded-full bg-success-600"></span>
              Correo verificado
            </li>
          </ul>
          <button
            type="button"
            className="mt-4 text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1
                       focus-visible:ring-2 focus-visible:ring-primary-600 rounded min-h-[44px]"
            onClick={() => {
              // Navegar a la pestaña de contraseña (desde el padre)
              const btn = document.getElementById('tab-password') as HTMLButtonElement | null;
              btn?.click();
            }}
          >
            Cambiar contraseña
            <ChevronRight aria-hidden="true" size={13} />
          </button>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-primary-800 mb-1">
            ¿Quieres ver tus compras?
          </p>
          <p className="text-xs text-primary-700 mb-3">
            Consulta el historial completo de tus pedidos y su estado.
          </p>
          <button
            type="button"
            className="text-xs text-primary-700 font-semibold flex items-center gap-1
                       focus-visible:ring-2 focus-visible:ring-primary-600 rounded min-h-[44px]"
            onClick={() => {
              const btn = document.getElementById('tab-orders') as HTMLButtonElement | null;
              btn?.click();
            }}
          >
            Ver mis pedidos
            <ChevronRight aria-hidden="true" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cambiar contraseña ────────────────────────────────────────────────────

function PasswordForm({ userId }: { userId: string }) {
  const [success, setSuccess]         = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });

  const toggle = (field: 'current' | 'newP' | 'confirm') =>
    setShow(prev => ({ ...prev, [field]: !prev[field] }));

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  async function onSubmit(data: PasswordFormData) {
    setServerError(null);
    setSuccess(false);
    try {
      await authService.changePassword(userId, data.currentPassword, data.newPassword);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = typeof err === 'object' && err !== null && 'message' in err
        ? String((err as { message: string }).message)
        : 'No se pudo cambiar la contraseña.';
      setServerError(msg);
    }
  }

  const EyeBtn = ({
    field, label,
  }: {
    field: 'current' | 'newP' | 'confirm';
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => toggle(field)}
      aria-label={show[field] ? `Ocultar ${label}` : `Mostrar ${label}`}
      aria-pressed={show[field]}
      className="focus-visible:ring-2 focus-visible:ring-primary-600 rounded
                 min-h-[44px] min-w-[44px] flex items-center justify-center"
    >
      {show[field]
        ? <EyeOff aria-hidden="true" size={18} />
        : <Eye    aria-hidden="true" size={18} />
      }
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-surface-900 mb-1">Cambiar contraseña</h2>
          <p className="text-sm text-surface-500 mb-5">
            Usa una contraseña con al menos 8 caracteres, mayúscula, minúscula y número.
          </p>

          {success && <Alert severity="success" className="mb-5">Contraseña cambiada correctamente.</Alert>}
          {serverError && <Alert severity="error" className="mb-5">{serverError}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Contraseña actual"
              type={show.current ? 'text' : 'password'}
              autoComplete="current-password"
              required
              error={errors.currentPassword?.message}
              rightAddon={<EyeBtn field="current" label="contraseña actual" />}
              {...register('currentPassword')}
            />
            <Input
              label="Nueva contraseña"
              type={show.newP ? 'text' : 'password'}
              autoComplete="new-password"
              required
              hint="Mínimo 8 caracteres, con mayúscula, minúscula y número."
              error={errors.newPassword?.message}
              rightAddon={<EyeBtn field="newP" label="nueva contraseña" />}
              {...register('newPassword')}
            />
            <Input
              label="Confirmar nueva contraseña"
              type={show.confirm ? 'text' : 'password'}
              autoComplete="new-password"
              required
              error={errors.confirmNewPassword?.message}
              rightAddon={<EyeBtn field="confirm" label="confirmación" />}
              {...register('confirmNewPassword')}
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              loadingText="Cambiando contraseña..."
              leftIcon={<Lock size={16} />}
            >
              Cambiar contraseña
            </Button>
          </form>
        </div>
      </div>

      {/* Consejos */}
      <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5 h-fit">
        <h3 className="text-sm font-semibold text-surface-700 mb-3">
          Consejos de seguridad
        </h3>
        <ul className="space-y-2 text-xs text-surface-600">
          {[
            'Mínimo 8 caracteres',
            'Al menos una mayúscula (A-Z)',
            'Al menos una minúscula (a-z)',
            'Al menos un número (0-9)',
            'No uses tu nombre ni correo',
            'No repitas contraseñas anteriores',
          ].map(tip => (
            <li key={tip} className="flex items-start gap-2">
              <CheckCircle aria-hidden="true" size={13} className="text-success-600 mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Mis pedidos ───────────────────────────────────────────────────────────

function OrdersPanel({ userId }: { userId: string }) {
  const myOrders = mockOrders
    .filter(o => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (myOrders.length === 0) {
    return (
      <section aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="sr-only">Mis pedidos</h2>
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-16 text-center">
          <Package aria-hidden="true" size={44} className="mx-auto mb-4 text-surface-300" />
          <p className="text-lg font-semibold text-surface-700 mb-1">
            Todavía no tienes pedidos
          </p>
          <p className="text-sm text-surface-500 mb-6">
            Cuando realices tu primera compra aparecerá aquí con todos sus detalles.
          </p>
          <Link to="/catalogo">
            <Button variant="primary">
              Ir al catálogo
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="orders-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="orders-heading" className="text-base font-bold text-surface-900">
          Mis pedidos
          <span className="ml-2 text-sm font-normal text-surface-500">
            ({myOrders.length})
          </span>
        </h2>
      </div>

      <ul role="list" className="space-y-4">
        {myOrders.map(order => (
          <li
            key={order.id}
            className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden"
          >
            {/* Cabecera */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-5 py-4
                            bg-surface-50 border-b border-surface-200">
              <div>
                <p className="text-[11px] text-surface-400 font-medium uppercase tracking-wide mb-0.5">
                  Pedido
                </p>
                <p className="font-bold text-surface-900 text-sm">{order.orderNumber}</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-[11px] text-surface-400 font-medium uppercase tracking-wide mb-0.5">
                  Fecha
                </p>
                <p className="text-sm text-surface-700">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-[11px] text-surface-400 font-medium uppercase tracking-wide mb-0.5">
                  Total
                </p>
                <p className="font-bold text-surface-900 text-sm">{formatPrice(order.total)}</p>
              </div>
              <div>
                <p className="text-[11px] text-surface-400 font-medium uppercase tracking-wide mb-0.5">
                  Estado
                </p>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block
                               ${orderStatusColor(order.status)}`}
                >
                  {formatOrderStatus(order.status)}
                </span>
              </div>
            </div>

            {/* Productos */}
            <ul role="list" className="divide-y divide-surface-100 px-5">
              {order.items.map(item => (
                <li key={item.id} className="flex items-center gap-3 py-3.5">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt=""
                      aria-hidden="true"
                      className="w-11 h-11 rounded-lg object-cover bg-surface-100 flex-shrink-0"
                    />
                  ) : (
                    <div aria-hidden="true"
                      className="w-11 h-11 rounded-lg bg-surface-100 flex-shrink-0
                                 flex items-center justify-center">
                      <Package size={18} className="text-surface-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-surface-500">
                      {item.variantLabel ? `${item.variantLabel} · ` : ''}
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-surface-900 flex-shrink-0">
                    {formatPrice(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Pie */}
            <div className="px-5 py-3 bg-surface-50 border-t border-surface-100
                            flex items-center justify-between text-xs text-surface-500">
              <span>
                Envío:{' '}
                {order.shipping === 0
                  ? <span className="text-success-600 font-semibold">Gratis</span>
                  : formatPrice(order.shipping)
                }
              </span>
              <span className="font-bold text-surface-900 text-sm">
                Total: {formatPrice(order.total)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
