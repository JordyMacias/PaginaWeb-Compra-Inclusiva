import React from 'react';
import { cn } from '../../utils';
import type { Severity } from '../../types';

// =====================================================
// COMPONENTE BADGE / ETIQUETA
// Transmite información de estado de forma visual
// Y textual, sin depender solo del color (WCAG 1.4.1)
// =====================================================

type BadgeVariant = Severity | 'neutral' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:  'bg-primary-100 text-primary-800',
  success:  'bg-success-100 text-success-600',
  error:    'bg-error-100 text-error-700',
  warning:  'bg-warning-100 text-warning-700',
  info:     'bg-info-100 text-info-700',
  neutral:  'bg-surface-100 text-surface-700',
};

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
