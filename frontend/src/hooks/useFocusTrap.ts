import { useEffect, useRef } from 'react';

// =====================================================
// HOOK useFocusTrap
// Atrapa el foco dentro de un elemento (modal, drawer,
// panel de accesibilidad) para garantizar WCAG 2.1.2.
//
// Uso:
//   const containerRef = useFocusTrap(isOpen);
//   <div ref={containerRef}>...</div>
// =====================================================

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Guardar el elemento que tenía el foco antes de abrir
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Mover el foco al primer elemento enfocable del contenedor
    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter(el => !el.closest('[aria-hidden="true"]'));

    if (focusable.length > 0) {
      focusable[0].focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      const focusableNow = Array.from(
        container!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter(el => !el.closest('[aria-hidden="true"]'));

      if (focusableNow.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusableNow[0];
      const last = focusableNow[focusableNow.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: si el foco está en el primero, ir al último
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: si el foco está en el último, ir al primero
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restaurar el foco al elemento anterior cuando se cierra
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}
