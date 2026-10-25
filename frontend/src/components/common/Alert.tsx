import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils';
import type { Severity } from '../../types';

// =====================================================
// COMPONENTE ALERT — Mensajes de retroalimentación
// - role="alert" para errores y advertencias urgentes
// - role="status" para mensajes informativos
// - Icono descriptivo + texto, sin depender solo del color
// =====================================================

interface AlertProps {
  severity: Severity;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const config: Record<
  Severity,
  { icon: React.ElementType; bg: string; border: string; text: string; title: string }
> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-success-100',
    border: 'border-success-600',
    text: 'text-success-700',
    title: 'Correcto',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-error-100',
    border: 'border-error-600',
    text: 'text-error-700',
    title: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-100',
    border: 'border-warning-700',
    text: 'text-warning-700',
    title: 'Advertencia',
  },
  info: {
    icon: Info,
    bg: 'bg-info-100',
    border: 'border-info-600',
    text: 'text-info-700',
    title: 'Información',
  },
};

export function Alert({ severity, title, children, onDismiss, className }: AlertProps) {
  const { icon: Icon, bg, border, text, title: defaultTitle } = config[severity];

  // role="alert" para errores/advertencias (assertive), "status" para info/success (polite)
  const role = severity === 'error' || severity === 'warning' ? 'alert' : 'status';

  return (
    <div
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-3 rounded-lg border-l-4 p-4',
        bg,
        border,
        text,
        className
      )}
    >
      <Icon
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-sm mb-0.5">{title}</p>
        )}
        <div className="text-sm">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar mensaje"
          className={cn(
            'ml-auto flex-shrink-0 rounded p-1',
            'hover:bg-black/10 transition-colors',
            'focus-visible:ring-2 focus-visible:ring-current',
            'min-h-[44px] min-w-[44px] flex items-center justify-center'
          )}
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
