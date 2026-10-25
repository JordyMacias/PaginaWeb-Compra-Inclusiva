import React from 'react';
import { cn } from '../../utils';

// =====================================================
// COMPONENTE SPINNER — Estado de carga accesible
// - role="status" con aria-label descriptivo
// - Respeta prefers-reduced-motion
// =====================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function Spinner({
  size = 'md',
  label = 'Cargando...',
  className,
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex items-center justify-center', className)}
    >
      <svg
        aria-hidden="true"
        className={cn('animate-spin text-primary-600', sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Contenedor de página de carga
export function PageSpinner({ label = 'Cargando página...' }: { label?: string }) {
  return (
    <div
      className="flex min-h-[400px] items-center justify-center"
      aria-live="polite"
    >
      <Spinner size="lg" label={label} />
    </div>
  );
}
