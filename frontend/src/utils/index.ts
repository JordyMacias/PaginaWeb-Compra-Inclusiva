// =====================================================
// UTILIDADES GENERALES
// =====================================================

/**
 * Formatea un número como precio en moneda local.
 * Usa el API Intl para respetar la configuración regional del usuario.
 */
export function formatPrice(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Combina clases CSS condicionales.
 * Alternativa liviana a clsx/classnames.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Genera un ID único simple para elementos de UI.
 * No usar para IDs de base de datos.
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Retrasa la ejecución de una función (debounce).
 * Útil para búsqueda en tiempo real.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Formatea una fecha de forma legible y accesible.
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale = 'es-ES'
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(dateString));
}

/**
 * Trunca un texto a una longitud máxima, añadiendo elipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Convierte un string a slug URL-friendly.
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calcula el porcentaje de descuento.
 */
export function discountPercent(
  original: number,
  current: number
): number {
  if (original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Formatea el estado de un pedido en español.
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending:    'Pendiente',
    confirmed:  'Confirmado',
    processing: 'En preparación',
    shipped:    'Enviado',
    delivered:  'Entregado',
    cancelled:  'Cancelado',
    refunded:   'Reembolsado',
  };
  return statusMap[status] ?? status;
}

/**
 * Verifica si un string es un email válido.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Clamp — limita un número entre un mínimo y un máximo.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Obtiene el color semántico para un estado de pedido.
 */
export function orderStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending:    'text-warning-700 bg-warning-100',
    confirmed:  'text-info-600 bg-info-100',
    processing: 'text-info-600 bg-info-100',
    shipped:    'text-primary-700 bg-primary-100',
    delivered:  'text-success-600 bg-success-100',
    cancelled:  'text-error-600 bg-error-100',
    refunded:   'text-surface-600 bg-surface-100',
  };
  return colorMap[status] ?? 'text-surface-600 bg-surface-100';
}
