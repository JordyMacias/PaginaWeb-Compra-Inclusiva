import React from 'react';

// =====================================================
// COMPONENTE SKIP LINKS
// Permite a usuarios de teclado y lectores de pantalla
// saltar al contenido principal o a la navegación.
// WCAG 2.4.1 — Bypass Blocks
// =====================================================

const links = [
  { href: '#main-content', label: 'Ir al contenido principal' },
  { href: '#main-nav', label: 'Ir a la navegación' },
  { href: '#search', label: 'Ir al buscador' },
];

export function SkipLinks() {
  return (
    <nav aria-label="Accesos rápidos de navegación">
      {links.map(({ href, label }) => (
        <a key={href} href={href} className="skip-link">
          {label}
        </a>
      ))}
    </nav>
  );
}
