import React from 'react';

// =====================================================
// COMPONENTE LIVE REGION
// Regiones ARIA live para anunciar cambios dinámicos
// a usuarios de lectores de pantalla.
//
// - polite: anuncios no urgentes (ej: producto añadido al carrito)
// - assertive: anuncios urgentes (ej: error crítico)
//
// Estas regiones están presentes en el DOM todo el tiempo.
// El hook useAnnounce() inserta mensajes en ellas.
// WCAG 4.1.3 — Status Messages
// =====================================================

export function LiveRegion() {
  return (
    <>
      {/* Anuncios no urgentes */}
      <div
        id="live-region-polite"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
        className="sr-only"
      />
      {/* Anuncios urgentes */}
      <div
        id="live-region-assertive"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
}
