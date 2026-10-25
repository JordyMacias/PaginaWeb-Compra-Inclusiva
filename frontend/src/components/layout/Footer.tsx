import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Heart, Shield } from 'lucide-react';

// =====================================================
// COMPONENTE FOOTER — Pie de página semántico
// - Estructura con <footer> y secciones con <nav>
// - Información de contacto con datos estructurados
// - Links accesibles con propósito claro
// =====================================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-900 text-surface-200 mt-auto">
      {/* Sección principal del footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Información de la empresa */}
          <div>
            <Link
              to="/"
              aria-label="CompraInclusiva — Inicio"
              className="flex items-center gap-2 mb-4 focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
            >
              <div
                aria-hidden="true"
                className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center"
              >
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                CompraInclusiva
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-surface-400 mb-4">
              Una tienda pensada para todas las personas. Compra con comodidad,
              seguridad y sin barreras.
            </p>
            <div className="flex items-center gap-2 text-sm text-surface-400">
              <Heart aria-hidden="true" size={14} className="text-red-400" />
              <span>Hecha con accesibilidad en mente</span>
            </div>
          </div>

          {/* Navegación — Tienda */}
          <nav aria-label="Sección Tienda">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Tienda
            </h2>
            <ul className="space-y-2" role="list">
              {[
                { to: '/catalogo', label: 'Todos los productos' },
                { to: '/catalogo?categoria=novedades', label: 'Novedades' },
                { to: '/catalogo?destacados=true', label: 'Destacados' },
                { to: '/catalogo?ofertas=true', label: 'Ofertas' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-surface-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Navegación — Mi cuenta */}
          <nav aria-label="Sección Mi cuenta">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Mi cuenta
            </h2>
            <ul className="space-y-2" role="list">
              {[
                { to: '/login', label: 'Iniciar sesión' },
                { to: '/registro', label: 'Crear cuenta' },
                { to: '/cuenta/pedidos', label: 'Mis pedidos' },
                { to: '/cuenta', label: 'Mi perfil' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-surface-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto y ayuda */}
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Ayuda y contacto
            </h2>
            <ul className="space-y-3" role="list">
              <li>
                <Link
                  to="/ayuda"
                  className="text-sm text-surface-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
                >
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link
                  to="/accesibilidad"
                  className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
                >
                  <Shield aria-hidden="true" size={14} />
                  Opciones de accesibilidad
                </Link>
              </li>
              <li>
                <a
                  href="mailto:ayuda@comprainclusiva.es"
                  className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
                >
                  <Mail aria-hidden="true" size={14} />
                  ayuda@comprainclusiva.es
                </a>
              </li>
              <li>
                <a
                  href="tel:+34900000000"
                  className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
                >
                  <Phone aria-hidden="true" size={14} />
                  900 000 000 (gratuito)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior del footer */}
      <div className="border-t border-surface-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-surface-500">
              © {currentYear} CompraInclusiva. Todos los derechos reservados.
            </p>
            <nav aria-label="Políticas y términos">
              <ul
                className="flex flex-wrap justify-center gap-x-4 gap-y-1"
                role="list"
              >
                {[
                  { to: '/privacidad', label: 'Privacidad' },
                  { to: '/terminos', label: 'Términos de uso' },
                  { to: '/cookies', label: 'Cookies' },
                  { to: '/accesibilidad-declaracion', label: 'Declaración de accesibilidad' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-xs text-surface-500 hover:text-surface-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary-400 rounded"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
