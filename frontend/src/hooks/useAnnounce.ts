import { useCallback } from 'react';

// =====================================================
// HOOK useAnnounce
// Envía mensajes a las regiones live de ARIA para
// que los lectores de pantalla los anuncien.
//
// Uso:
//   const { announce } = useAnnounce();
//   announce('Producto añadido al carrito', 'polite');
//   announce('Error: campo requerido', 'assertive');
// =====================================================

type AriaLive = 'polite' | 'assertive';

export function useAnnounce() {
  const announce = useCallback((message: string, priority: AriaLive = 'polite') => {
    const regionId =
      priority === 'assertive'
        ? 'live-region-assertive'
        : 'live-region-polite';

    const region = document.getElementById(regionId);
    if (!region) return;

    // Limpiar primero para asegurar que el cambio se detecte
    region.textContent = '';

    // Usar un timeout para asegurar que el lector de pantalla detecte el cambio
    setTimeout(() => {
      region.textContent = message;
    }, 50);

    // Limpiar después de un tiempo prudencial
    setTimeout(() => {
      region.textContent = '';
    }, 3000);
  }, []);

  return { announce };
}
