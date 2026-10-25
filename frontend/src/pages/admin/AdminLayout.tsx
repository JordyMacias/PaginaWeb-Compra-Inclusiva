import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils';

// =====================================================
// LAYOUT DEL PANEL DE ADMINISTRACIÓN
// Solo accesible si user.role === 'admin'
// =====================================================

const navItems = [
  { to: '/admin',          label: 'Resumen',   icon: LayoutDashboard, end: true },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/pedidos',   label: 'Pedidos',   icon: ShoppingBag },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside
        aria-label="Navegación del panel de administración"
        className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0 z-30"
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package aria-hidden="true" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">CompraInclusiva</p>
              <p className="text-xs text-gray-400 mt-0.5">Panel de administración</p>
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label="Secciones del administrador" className="flex-1 py-4 px-3">
          <ul role="list" className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                      'transition-colors duration-150 min-h-[44px]',
                      'focus-visible:ring-2 focus-visible:ring-primary-400',
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )
                  }
                >
                  <Icon aria-hidden="true" size={18} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Acciones inferiores */}
        <div className="p-3 border-t border-gray-700 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <Store aria-hidden="true" size={16} />
            Ver la tienda
            <ChevronRight aria-hidden="true" size={14} className="ml-auto" />
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label="Cerrar sesión de administrador"
          >
            <LogOut aria-hidden="true" size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main
        id="main-content"
        className="flex-1 ml-64 min-h-screen"
        tabIndex={-1}
      >
        <Outlet />
      </main>
    </div>
  );
}
