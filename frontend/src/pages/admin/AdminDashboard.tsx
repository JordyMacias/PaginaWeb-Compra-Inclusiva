import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils';

// =====================================================
// DASHBOARD DEL ADMINISTRADOR — datos reales del backend
// =====================================================

interface Stats {
  totalProducts:    number;
  totalOrders:      number;
  totalUsers:       number;
  totalRevenue:     number;
  recentOrders:     Array<{
    id: string; orderNumber: string; status: string;
    total: number; userEmail: string; createdAt: string;
  }>;
  lowStockProducts: Array<{ id: string; name: string; stock: number }>;
}

const statusLabel: Record<string, { text: string; cls: string }> = {
  pending:    { text: 'Pendiente',      cls: 'bg-yellow-100 text-yellow-800' },
  confirmed:  { text: 'Confirmado',     cls: 'bg-blue-100 text-blue-800' },
  processing: { text: 'En preparación', cls: 'bg-indigo-100 text-indigo-800' },
  shipped:    { text: 'Enviado',        cls: 'bg-cyan-100 text-cyan-800' },
  delivered:  { text: 'Entregado',      cls: 'bg-green-100 text-green-800' },
  cancelled:  { text: 'Cancelado',      cls: 'bg-red-100 text-red-800' },
  refunded:   { text: 'Reembolsado',    cls: 'bg-gray-100 text-gray-800' },
};

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('compra-inclusiva-token');
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setStats(d.data); setLoading(false); })
      .catch(() => { setError('No se pudieron cargar las estadísticas.'); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500" role="status">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <p className="text-red-600 bg-red-50 rounded-lg p-4">{error ?? 'Error al cargar datos.'}</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Ingresos totales',     value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'bg-green-100 text-green-700',  desc: 'Pedidos pagados' },
    { label: 'Pedidos totales',      value: String(stats.totalOrders),       icon: ShoppingBag, color: 'bg-blue-100 text-blue-700',   desc: 'Todos los estados' },
    { label: 'Productos en catálogo',value: String(stats.totalProducts),     icon: Package,     color: 'bg-purple-100 text-purple-700', desc: 'Artículos activos' },
    { label: 'Clientes registrados', value: String(stats.totalUsers),        icon: Users,       color: 'bg-orange-100 text-orange-700', desc: 'Cuentas de usuario' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Resumen general</h1>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, desc }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon aria-hidden="true" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pedidos recientes */}
        <section aria-labelledby="recent-orders-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 id="recent-orders-heading" className="text-base font-bold text-gray-900">
              Pedidos recientes
            </h2>
            <Link to="/admin/pedidos" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Ver todos <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-500 text-center">No hay pedidos todavía.</p>
          ) : (
            <ul role="list" className="divide-y divide-gray-100">
              {stats.recentOrders.map(order => {
                const s = statusLabel[order.status] ?? statusLabel['pending'];
                return (
                  <li key={order.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 truncate">{order.userEmail}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
                        {s.text}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Productos con poco stock */}
        <section aria-labelledby="low-stock-heading" className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 id="low-stock-heading" className="text-base font-bold text-gray-900">
              Avisos de stock
            </h2>
            <Link to="/admin/productos" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Gestionar <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center text-gray-500">
              Todos los productos tienen stock suficiente. ✓
            </p>
          ) : (
            <ul role="list" className="divide-y divide-gray-100">
              {stats.lowStockProducts.map(p => (
                <li key={p.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-900 min-w-0 truncate">{p.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {p.stock === 0 ? 'Agotado' : `${p.stock} uds.`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
