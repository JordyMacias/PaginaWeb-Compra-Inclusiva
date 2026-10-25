import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '../components/common/Button';

// =====================================================
// PÁGINA 404 — No encontrado
// =====================================================

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p
          aria-hidden="true"
          className="text-8xl font-bold text-primary-200 mb-2"
        >
          404
        </p>
        <h1 className="text-3xl font-bold text-surface-900 mb-3">
          Página no encontrada
        </h1>
        <p className="text-surface-600 mb-8">
          La página que buscas no existe o ha sido movida. Puedes volver al
          inicio o buscar en nuestro catálogo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg" leftIcon={<Home size={18} />}>
              Ir al inicio
            </Button>
          </Link>
          <Link to="/catalogo">
            <Button variant="secondary" size="lg" leftIcon={<Search size={18} />}>
              Ver productos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
