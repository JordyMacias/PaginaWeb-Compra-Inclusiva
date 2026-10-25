import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cn } from '../../utils';

// =====================================================
// COMPONENTE MODAL — Completamente accesible
// - role="dialog" con aria-modal="true"
// - aria-labelledby para el título
// - aria-describedby para la descripción
// - Trampa de foco con useFocusTrap (WCAG 2.1.2)
// - Cerrar con Escape (WCAG 2.1.1)
// - Bloqueo de scroll en el body
// =====================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  closeOnOverlayClick?: boolean;
}

const sizeClasses = {
  sm:  'max-w-sm',
  md:  'max-w-md',
  lg:  'max-w-lg',
  xl:  'max-w-2xl',
};

let modalCounter = 0;

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
  closeOnOverlayClick = true,
}: ModalProps) {
  const trapRef = useFocusTrap(isOpen);
  const titleId = `modal-title-${++modalCounter}`;
  const descId = description ? `modal-desc-${modalCounter}` : undefined;

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Fondo semitransparente */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Diálogo */}
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-xl',
          'animate-slide-up',
          sizeClasses[size],
          className
        )}
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between p-6 border-b border-surface-200">
          <div>
            <h2
              id={titleId}
              className="text-xl font-bold text-surface-900"
            >
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-surface-600">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar diálogo"
            className={cn(
              'ml-4 p-2 rounded-lg text-surface-400 hover:text-surface-700',
              'hover:bg-surface-100 transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
              'min-h-[44px] min-w-[44px] flex items-center justify-center'
            )}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
