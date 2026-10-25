import React, { forwardRef } from 'react';
import { cn } from '../../utils';

// =====================================================
// COMPONENTE BUTTON — Completamente accesible
// - Roles semánticos correctos
// - Estados disabled comunicados a lectores de pantalla
// - Indicadores de foco visibles (WCAG 2.4.7)
// - Target mínimo 44×44px (WCAG 2.5.5)
// - Soporte para estado de carga (aria-busy)
// =====================================================

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 ' +
    'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
  secondary:
    'bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 ' +
    'active:bg-primary-100 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
  danger:
    'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 ' +
    'focus-visible:ring-2 focus-visible:ring-error-600 focus-visible:ring-offset-2',
  ghost:
    'bg-transparent text-surface-700 hover:bg-surface-100 active:bg-surface-200 ' +
    'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
  link:
    'bg-transparent text-primary-600 underline underline-offset-2 hover:text-primary-700 ' +
    'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 p-0 min-h-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm:  'min-h-[44px] px-4 py-2 text-sm',
  md:  'min-h-[44px] px-5 py-2.5 text-base',
  lg:  'min-h-[52px] px-7 py-3.5 text-lg',
};

function Spinner({ label }: { label: string }) {
  return (
    <svg
      aria-hidden="true"
      className="animate-spin h-4 w-4"
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
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
          'transition-colors duration-200 cursor-pointer select-none',
          // Variante
          variantClasses[variant],
          // Tamaño
          sizeClasses[size],
          // Ancho completo
          fullWidth && 'w-full',
          // Estado desactivado
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner label="Cargando" />
            <span>{loadingText ?? children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
