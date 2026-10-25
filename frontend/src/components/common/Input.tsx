import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils';

// =====================================================
// COMPONENTE INPUT — Completamente accesible
// - Label siempre visible y asociada al input (WCAG 1.3.1)
// - Mensajes de error con aria-describedby (WCAG 1.3.3)
// - aria-invalid en estado de error
// - aria-required para campos obligatorios
// - Instrucciones de ayuda asociadas al campo
// =====================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;   // Solo oculta visualmente, accesible con sr-only
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      hideLabel = false,
      leftAddon,
      rightAddon,
      className,
      id: idProp,
      required,
      ...props
    },
    ref
  ) => {
    // Generar IDs únicos y estables para la asociación ARIA
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const describedBy = [
      hint ? hintId : '',
      error ? errorId : '',
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label — siempre presente en el DOM */}
        <label
          htmlFor={id}
          className={cn(
            'text-sm font-medium text-surface-700',
            hideLabel && 'sr-only'
          )}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="text-error-600 ml-1">
              *
            </span>
          )}
        </label>

        {/* Hint opcional */}
        {hint && (
          <p id={hintId} className="text-sm text-surface-500">
            {hint}
          </p>
        )}

        {/* Input con addons opcionales */}
        <div className="relative flex items-center">
          {leftAddon && (
            <span
              aria-hidden="true"
              className="absolute left-3 text-surface-400 pointer-events-none"
            >
              {leftAddon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              'w-full rounded-lg border-2 bg-white px-4 py-3',
              'text-base text-surface-800 placeholder:text-surface-400',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Estado normal
              !error && 'border-surface-300 focus:border-primary-600 focus:ring-primary-600',
              // Estado de error
              error && 'border-error-600 focus:border-error-700 focus:ring-error-600',
              // Padding para addons
              leftAddon ? 'pl-10' : '',
              rightAddon ? 'pr-10' : '',
              className
            )}
            {...props}
          />

          {rightAddon && (
            <span
              className="absolute right-3 text-surface-400"
            >
              {rightAddon}
            </span>
          )}
        </div>

        {/* Mensaje de error — asociado con aria-describedby */}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-error-600 flex items-center gap-1.5"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
