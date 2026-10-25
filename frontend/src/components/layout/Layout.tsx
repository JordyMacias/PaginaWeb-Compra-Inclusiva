import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipLinks } from './SkipLinks';
import { LiveRegion } from '../accessibility/LiveRegion';
import { AccessibilityWidget } from '../accessibility/AccessibilityWidget';

// =====================================================
// LAYOUT PRINCIPAL — tienda con header + footer
// Incluye el widget flotante de accesibilidad (esquina
// inferior izquierda) en todas las páginas de la tienda.
// =====================================================

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip links — siempre al inicio del DOM */}
      <SkipLinks />

      {/* Regiones live para lectores de pantalla */}
      <LiveRegion />

      <Header />

      <main
        id="main-content"
        className="flex-1 focus:outline-none"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <Footer />

      {/* Widget flotante de accesibilidad — esquina inferior izquierda */}
      <AccessibilityWidget />
    </div>
  );
}
