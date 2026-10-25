import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  HeadphonesIcon,
  ChevronRight,
} from 'lucide-react';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/common/Button';
import { useProducts } from '../hooks/useProducts';
import { useAccessibility } from '../context/AccessibilityContext';

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { preferences } = useAccessibility();
  const simplified = preferences.simplifiedView;

  const { products: featuredProducts, isLoading } = useProducts({
    featured: true,
    pageSize: 8,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?busqueda=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <>
      {/* ── HERO ── En vista simplificada: solo el buscador, sin fondo degradado */}
      <section
        aria-labelledby="hero-heading"
        className={
          simplified
            ? 'py-8 px-4 border-b border-surface-200'
            : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 sm:py-24 px-4'
        }
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            id="hero-heading"
            className={
              simplified
                ? 'text-2xl sm:text-3xl font-bold text-surface-900 mb-4'
                : 'text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6'
            }
          >
            {simplified ? 'Buscar productos' : (
              <>
                Compra sin barreras,
                <br />
                <span className="text-primary-200">para todos</span>
              </>
            )}
          </h1>

          {/* Descripción — oculta en vista simplificada */}
          {!simplified && (
            <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Una tienda diseñada para que cualquier persona pueda comprar con
              facilidad, comodidad y seguridad.
            </p>
          )}

          {/* Buscador — siempre visible */}
          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="Buscar productos en la tienda"
            className={`flex flex-col sm:flex-row gap-3 max-w-xl mx-auto ${simplified ? '' : ''}`}
          >
            <div className="relative flex-1">
              <label htmlFor="hero-search" className="sr-only">
                ¿Qué estás buscando?
              </label>
              <input
                id="hero-search"
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className={`w-full pl-12 pr-4 py-4 rounded-xl text-surface-900 text-base
                           focus:outline-none focus:ring-4 min-h-[52px]
                           ${simplified
                             ? 'border-2 border-surface-300 focus:ring-primary-200 focus:border-primary-600'
                             : 'focus:ring-white/50'
                           }`}
              />
              <Search
                aria-hidden="true"
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5
                            ${simplified ? 'text-surface-400' : 'text-surface-400'}`}
              />
            </div>
            <Button
              type="submit"
              variant={simplified ? 'primary' : 'secondary'}
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              className={simplified ? '' : 'bg-white text-primary-700 border-white hover:bg-primary-50'}
            >
              Buscar
            </Button>
          </form>

          {/* Sugerencias — ocultas en vista simplificada */}
          {!simplified && (
            <div
              className="mt-4 flex flex-wrap justify-center gap-2"
              aria-label="Búsquedas sugeridas"
            >
              <span className="text-sm text-primary-200 mr-1">Populares:</span>
              {['Electrónica', 'Ropa', 'Hogar', 'Libros', 'Deportes'].map(term => (
                <Link
                  key={term}
                  to={`/catalogo?busqueda=${encodeURIComponent(term)}`}
                  className="text-sm text-white bg-white/20 hover:bg-white/30 rounded-full px-3 py-1
                             transition-colors focus-visible:ring-2 focus-visible:ring-white"
                >
                  {term}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CARACTERÍSTICAS — ocultas en vista simplificada */}
      {!simplified && (
        <section
          aria-labelledby="features-heading"
          className="py-12 bg-surface-50 border-b border-surface-200"
          aria-hidden={simplified}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="features-heading" className="sr-only">
              Por qué comprar en CompraInclusiva
            </h2>
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6" role="list">
              {[
                { icon: Truck,          title: 'Envío gratis',      desc: 'En pedidos superiores a $50' },
                { icon: RotateCcw,      title: 'Devolución fácil',  desc: '30 días para cambios y devoluciones' },
                { icon: ShieldCheck,    title: 'Compra segura',     desc: 'Pago cifrado y datos protegidos' },
                { icon: HeadphonesIcon, title: 'Atención accesible',desc: 'Soporte por teléfono, chat y email' },
              ].map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex flex-col items-center text-center gap-2 p-4">
                  <div aria-hidden="true" className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-surface-900">{title}</h3>
                  <p className="text-xs text-surface-600">{desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── CATEGORÍAS — versión simplificada: solo texto, sin emojis ni tarjetas */}
      <section
        aria-labelledby="categories-heading"
        className={simplified ? 'py-6 px-4 border-b border-surface-200' : 'py-14 px-4'}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="categories-heading"
              className={simplified
                ? 'text-lg font-bold text-surface-900'
                : 'text-2xl sm:text-3xl font-bold text-surface-900'
              }
            >
              {simplified ? 'Ir a una categoría' : 'Navega por categorías'}
            </h2>
            <Link
              to="/catalogo"
              className="flex items-center gap-1 text-sm font-medium text-primary-600
                         hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
              aria-label="Ver todas las categorías de productos"
            >
              Ver todo
              <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </div>

          {simplified ? (
            /* Vista simplificada: lista de enlaces simples, sin emojis ni tarjetas */
            <ul className="flex flex-wrap gap-2" role="list" aria-label="Categorías de productos">
              {[
                { slug: 'electronica', name: 'Electrónica' },
                { slug: 'ropa',        name: 'Ropa' },
                { slug: 'hogar',       name: 'Hogar' },
                { slug: 'libros',      name: 'Libros' },
                { slug: 'deportes',    name: 'Deportes' },
                { slug: 'salud',       name: 'Salud' },
              ].map(({ slug, name }) => (
                <li key={slug}>
                  <Link
                    to={`/catalogo?categoria=${slug}`}
                    className="inline-flex items-center px-4 py-2.5 rounded-lg border-2 border-surface-300
                               text-sm font-medium text-surface-800 bg-white hover:border-primary-500
                               hover:text-primary-700 min-h-[44px] transition-colors
                               focus-visible:ring-2 focus-visible:ring-primary-600"
                    aria-label={`Ver productos de ${name}`}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            /* Vista normal: tarjetas con emojis */
            <ul
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
              role="list"
              aria-label="Categorías de productos"
            >
              {[
                { slug: 'electronica', name: 'Electrónica', emoji: '📱' },
                { slug: 'ropa',        name: 'Ropa',        emoji: '👕' },
                { slug: 'hogar',       name: 'Hogar',       emoji: '🏠' },
                { slug: 'libros',      name: 'Libros',      emoji: '📚' },
                { slug: 'deportes',    name: 'Deportes',    emoji: '⚽' },
                { slug: 'salud',       name: 'Salud',       emoji: '💊' },
              ].map(({ slug, name, emoji }) => (
                <li key={slug}>
                  <Link
                    to={`/catalogo?categoria=${slug}`}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border
                               border-surface-200 hover:border-primary-400 hover:shadow-sm
                               transition-all duration-200 text-center min-h-[44px]
                               focus-visible:ring-2 focus-visible:ring-primary-600"
                    aria-label={`Ver productos de ${name}`}
                  >
                    <span aria-hidden="true" className="text-3xl">{emoji}</span>
                    <span className="text-sm font-medium text-surface-800">{name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS — siempre visible, título más simple en modo simplificado */}
      <section
        aria-labelledby="featured-heading"
        className={simplified ? 'py-8 px-4' : 'py-14 px-4 bg-surface-50'}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="featured-heading"
              className={simplified
                ? 'text-lg font-bold text-surface-900'
                : 'text-2xl sm:text-3xl font-bold text-surface-900'
              }
            >
              {simplified ? 'Productos destacados' : 'Productos destacados'}
            </h2>
            <Link
              to="/catalogo?destacados=true"
              className="flex items-center gap-1 text-sm font-medium text-primary-600
                         hover:text-primary-700 focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
              aria-label="Ver todos los productos destacados"
            >
              Ver más
              <ChevronRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <ProductGrid
            products={featuredProducts}
            isLoading={isLoading}
            emptyMessage="No hay productos destacados en este momento."
            columns={simplified ? 2 : 4}
            headingLevel={3}
          />
        </div>
      </section>
    </>
  );
}
