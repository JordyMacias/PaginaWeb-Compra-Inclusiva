import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Settings,
  HelpCircle,
  Package,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';
import { cn } from '../../utils';
import { Button } from '../common/Button';

// =====================================================
// COMPONENTE HEADER — Barra de navegación principal
// - Navegación semántica con <nav> y aria-label
// - Menú hamburguesa accesible con aria-expanded
// - Indicador del carrito con aria-live
// - Búsqueda integrada accesible
// - Menú de usuario con dropdown accesible
// =====================================================

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [navigate]);

  // Cerrar menus con Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsSearchExpanded(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?busqueda=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  }

  function handleLogout() {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  }

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Productos' },
    { to: '/ayuda', label: 'Ayuda' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo y marca */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              aria-label="CompraInclusiva — Ir a la página de inicio"
              className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary-600 rounded-lg"
            >
              <div
                aria-hidden="true"
                className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center"
              >
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900 hidden sm:block">
                CompraInclusiva
              </span>
            </Link>
          </div>

          {/* Navegación principal — escritorio */}
          <nav
            id="main-nav"
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-1"
          >
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium text-surface-700',
                  'hover:bg-surface-100 hover:text-surface-900',
                  'transition-colors duration-200',
                  'focus-visible:ring-2 focus-visible:ring-primary-600',
                  'min-h-[44px] flex items-center'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Buscador — escritorio */}
          <form
            id="search"
            role="search"
            aria-label="Buscar productos"
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-4"
          >
            <div className="relative flex-1">
              <label htmlFor="header-search" className="sr-only">
                Buscar productos
              </label>
              <input
                id="header-search"
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className={cn(
                  'w-full pl-4 pr-10 py-2 rounded-lg border-2 border-surface-300',
                  'text-sm text-surface-800 placeholder:text-surface-400',
                  'focus:border-primary-600 focus:outline-none focus:ring-2',
                  'focus:ring-primary-600 focus:ring-offset-0',
                  'transition-colors duration-200',
                  'min-h-[44px]'
                )}
              />
              <button
                type="submit"
                aria-label="Buscar"
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2',
                  'p-1.5 rounded-md text-surface-400 hover:text-primary-600',
                  'focus-visible:ring-2 focus-visible:ring-primary-600',
                  'transition-colors duration-200'
                )}
              >
                <Search aria-hidden="true" size={16} />
              </button>
            </div>
          </form>

          {/* Acciones de la derecha */}
          <div className="flex items-center gap-1">

            {/* Búsqueda móvil */}
            <button
              type="button"
              onClick={() => {
                setIsSearchExpanded(!isSearchExpanded);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              aria-label={isSearchExpanded ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
              aria-expanded={isSearchExpanded}
              className={cn(
                'md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100',
                'focus-visible:ring-2 focus-visible:ring-primary-600',
                'min-h-[44px] min-w-[44px] flex items-center justify-center'
              )}
            >
              <Search aria-hidden="true" size={20} />
            </button>

            {/* Carrito */}
            <Link
              to="/carrito"
              aria-label={`Carrito de compras. ${cart.itemCount} ${cart.itemCount === 1 ? 'artículo' : 'artículos'}`}
              className={cn(
                'relative p-2 rounded-lg text-surface-600 hover:bg-surface-100',
                'focus-visible:ring-2 focus-visible:ring-primary-600',
                'min-h-[44px] min-w-[44px] flex items-center justify-center'
              )}
            >
              <ShoppingCart aria-hidden="true" size={22} />
              {cart.itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]',
                    'bg-primary-600 text-white text-xs font-bold',
                    'rounded-full flex items-center justify-center px-1',
                    'leading-none'
                  )}
                >
                  {cart.itemCount > 99 ? '99+' : cart.itemCount}
                </span>
              )}
            </Link>

            {/* Enlace al panel de admin — solo visible para administradores */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                aria-label="Ir al panel de administración"
                className={cn(
                  'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold',
                  'bg-amber-100 text-amber-800 hover:bg-amber-200',
                  'focus-visible:ring-2 focus-visible:ring-amber-600',
                  'min-h-[44px] transition-colors'
                )}
              >
                <Settings aria-hidden="true" size={15} />
                Admin
              </Link>
            )}

            {/* Usuario */}
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                  aria-label={`Menú de cuenta de ${user?.name}`}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg',
                    'text-surface-700 hover:bg-surface-100',
                    'focus-visible:ring-2 focus-visible:ring-primary-600',
                    'min-h-[44px] text-sm font-medium'
                  )}
                >
                  <User aria-hidden="true" size={18} />
                  <span className="hidden sm:block max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    size={14}
                    className={cn(
                      'transition-transform duration-200',
                      isUserMenuOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isUserMenuOpen && (
                  <div
                    role="menu"
                    aria-label={`Opciones de cuenta de ${user?.name}`}
                    className={cn(
                      'absolute right-0 top-full mt-1 w-48',
                      'bg-white rounded-xl border border-surface-200 shadow-lg',
                      'py-1 animate-slide-up z-50'
                    )}
                  >
                    <Link
                      to="/perfil"
                      role="menuitem"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-surface-700 hover:bg-surface-50 focus-visible:bg-surface-50 focus:outline-none"
                    >
                      <User aria-hidden="true" size={16} />
                      Mi cuenta
                    </Link>
                    <Link
                      to="/perfil?tab=orders"
                      role="menuitem"
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-surface-700 hover:bg-surface-50 focus-visible:bg-surface-50 focus:outline-none"
                    >
                      <Package aria-hidden="true" size={16} />
                      Mis pedidos
                    </Link>
                    {/* Panel de admin — solo si es administrador */}
                    {user?.role === 'admin' && (
                      <>
                        <hr className="my-1 border-surface-200" aria-hidden="true" />
                        <Link
                          to="/admin"
                          role="menuitem"
                          className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 focus-visible:bg-amber-50 focus:outline-none"
                        >
                          <Settings aria-hidden="true" size={16} />
                          Panel de administración
                        </Link>
                      </>
                    )}
                    <hr className="my-1 border-surface-200" aria-hidden="true" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-error-600 hover:bg-error-100 focus-visible:bg-error-100 focus:outline-none"
                    >
                      <LogOut aria-hidden="true" size={16} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg',
                  'text-sm font-semibold text-white bg-primary-600',
                  'hover:bg-primary-700 transition-colors duration-200',
                  'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
                  'min-h-[44px]'
                )}
              >
                <User aria-hidden="true" size={16} />
                <span>Entrar</span>
              </Link>
            )}

            {/* Botón menú hamburguesa — móvil */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className={cn(
                'md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100',
                'focus-visible:ring-2 focus-visible:ring-primary-600',
                'min-h-[44px] min-w-[44px] flex items-center justify-center'
              )}
            >
              {isMobileMenuOpen
                ? <X aria-hidden="true" size={22} />
                : <Menu aria-hidden="true" size={22} />
              }
            </button>
          </div>
        </div>

        {/* Buscador expandido en móvil */}
        {isSearchExpanded && (
          <div className="md:hidden pb-3">
            <form
              role="search"
              aria-label="Buscar productos"
              onSubmit={handleSearch}
            >
              <label htmlFor="mobile-search" className="sr-only">
                Buscar productos
              </label>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  id="mobile-search"
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className={cn(
                    'w-full pl-4 pr-12 py-3 rounded-lg border-2 border-surface-300',
                    'text-base focus:border-primary-600 focus:outline-none',
                    'focus:ring-2 focus:ring-primary-600'
                  )}
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Search aria-hidden="true" size={20} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-surface-200 bg-white animate-slide-up"
        >
          <nav
            aria-label="Navegación móvil"
            className="py-2 px-4"
          >
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center px-3 py-3 rounded-lg text-base font-medium',
                  'text-surface-700 hover:bg-surface-100',
                  'focus-visible:ring-2 focus-visible:ring-primary-600',
                  'min-h-[44px]'
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/accesibilidad"
              className={cn(
                'flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium',
                'text-surface-700 hover:bg-surface-100 min-h-[44px]'
              )}
            >
              <Settings aria-hidden="true" size={18} />
              Accesibilidad
            </Link>
            <Link
              to="/ayuda"
              className={cn(
                'flex items-center gap-2 px-3 py-3 rounded-lg text-base font-medium',
                'text-surface-700 hover:bg-surface-100 min-h-[44px]'
              )}
            >
              <HelpCircle aria-hidden="true" size={18} />
              Centro de ayuda
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
