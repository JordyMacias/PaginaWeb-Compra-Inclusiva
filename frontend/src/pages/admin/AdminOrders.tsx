import React, { useState, useEffect } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import { adminService } from '../../services/admin';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { formatPrice, formatDate, formatOrderStatus } from '../../utils';
import type { Order, OrderStatus } from '../../types';

// =====================================================
// ADMIN — GESTIÓN DE PEDIDOS
// Listado completo, cambio de estado, detalle
// =====================================================

const ALL_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded',
];

const statusConfig: Record<OrderStatus, { label: string; cls: string }> = {
  pending:    { label: 'Pendiente',      cls: 'bg-yellow-100 text-yellow-800' },
  confirmed:  { label: 'Confirmado',     cls: 'bg-blue-100 text-blue-800' },
  processing: { label: 'En preparación', cls: 'bg-indigo-100 text-indigo-800' },
  shipped:    { label: 'Enviado',        cls: 'bg-cyan-100 text-cyan-800' },
  delivered:  { label: 'Entregado',      cls: 'bg-green-100 text-green-800' },
  cancelled:  { label: 'Cancelado',      cls: 'bg-red-100 text-red-800' },
  refunded:   { label: 'Reembolsado',    cls: 'bg-gray-100 text-gray-800' },
};

const paymentConfig: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'Pendiente',    cls: 'bg-yellow-100 text-yellow-800' },
  paid:     { label: 'Pagado',       cls: 'bg-green-100 text-green-800' },
  failed:   { label: 'Fallido',      cls: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado',  cls: 'bg-gray-100 text-gray-800' },
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      setOrders(await adminService.getOrders());
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId);
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (detailOrder?.id === orderId) setDetailOrder(updated);
      setFeedback({ type: 'success', msg: `Estado actualizado a "${statusConfig[status].label}".` });
    } catch {
      setFeedback({ type: 'error', msg: 'No se pudo actualizar el estado.' });
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de pedidos</h1>
        <p className="text-sm text-gray-500 mt-0.5">{orders.length} pedidos en total</p>
      </div>

      {feedback && (
        <div className="mb-4">
          <Alert severity={feedback.type} onDismiss={() => setFeedback(null)}>
            {feedback.msg}
          </Alert>
        </div>
      )}

      {/* Filtro por estado */}
      <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Filtrar pedidos por estado">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          aria-pressed={filterStatus === 'all'}
          className={`px-4 py-2 rounded-full text-sm font-medium min-h-[44px] border-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 ${
            filterStatus === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
          }`}
        >
          Todos ({orders.length})
        </button>
        {ALL_STATUSES.map(s => {
          const count = orders.filter(o => o.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              aria-pressed={filterStatus === s}
              className={`px-4 py-2 rounded-full text-sm font-medium min-h-[44px] border-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary-600 ${
                filterStatus === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }`}
            >
              {statusConfig[s].label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-center py-12 text-gray-500" role="status">Cargando pedidos...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-12 text-gray-500">No hay pedidos con este estado.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]" aria-label="Lista de pedidos de clientes">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Pedido</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Pago</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => {
                  const sc = statusConfig[order.status];
                  const pc = paymentConfig[order.paymentStatus] ?? paymentConfig.pending;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.items.length} artículo{order.items.length !== 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{order.userName}</p>
                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(order.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pc.cls}`}>
                          {pc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {/* Selector de estado inline */}
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={e => changeStatus(order.id, e.target.value as OrderStatus)}
                            disabled={updatingId === order.id}
                            aria-label={`Estado del pedido ${order.orderNumber}`}
                            className={`appearance-none pl-2 pr-7 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer min-h-[36px] focus:outline-none focus:ring-2 focus:ring-primary-600 ${sc.cls}`}
                          >
                            {ALL_STATUSES.map(s => (
                              <option key={s} value={s}>{statusConfig[s].label}</option>
                            ))}
                          </select>
                          <ChevronDown aria-hidden="true" size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setDetailOrder(order)}
                          aria-label={`Ver detalle del pedido ${order.orderNumber}`}
                          className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-primary-600"
                        >
                          <Eye aria-hidden="true" size={14} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal: Detalle del pedido ── */}
      <Modal
        isOpen={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        title={`Pedido ${detailOrder?.orderNumber ?? ''}`}
        size="lg"
      >
        {detailOrder && (
          <div className="space-y-4">
            {/* Info cliente */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700 mb-1">Cliente</p>
                <p className="text-gray-900">{detailOrder.userName}</p>
                <p className="text-gray-500">{detailOrder.userEmail}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Fecha</p>
                <p className="text-gray-900">{formatDate(detailOrder.createdAt)}</p>
              </div>
            </div>

            {/* Dirección */}
            <div className="text-sm">
              <p className="font-semibold text-gray-700 mb-1">Dirección de entrega</p>
              <address className="not-italic text-gray-700 leading-relaxed">
                {detailOrder.shippingAddress.recipientName}<br />
                {detailOrder.shippingAddress.street}
                {detailOrder.shippingAddress.apartment && `, ${detailOrder.shippingAddress.apartment}`}<br />
                {detailOrder.shippingAddress.zipCode} {detailOrder.shippingAddress.city}, {detailOrder.shippingAddress.country}
                {detailOrder.shippingAddress.phone && <><br />{detailOrder.shippingAddress.phone}</>}
              </address>
            </div>

            {/* Artículos */}
            <div>
              <p className="font-semibold text-gray-700 mb-2 text-sm">Artículos</p>
              <ul role="list" className="space-y-2">
                {detailOrder.items.map(item => (
                  <li key={item.id} className="flex items-center gap-3 text-sm bg-gray-50 rounded-lg p-2.5">
                    {item.productImage && (
                      <img src={item.productImage} alt="" aria-hidden="true" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                      {item.variantLabel && <p className="text-xs text-gray-500">{item.variantLabel}</p>}
                      <p className="text-xs text-gray-500">Cantidad: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                    </div>
                    <p className="font-bold text-gray-900 flex-shrink-0">{formatPrice(item.subtotal)}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Totales */}
            <table className="w-full text-sm" aria-label="Desglose del pedido">
              <tbody>
                <tr><td className="py-1 text-gray-600">Subtotal</td><td className="py-1 text-right font-medium">{formatPrice(detailOrder.subtotal)}</td></tr>
                <tr><td className="py-1 text-gray-600">Envío</td><td className="py-1 text-right font-medium">{detailOrder.shipping === 0 ? 'Gratis' : formatPrice(detailOrder.shipping)}</td></tr>
                <tr><td className="py-1 text-gray-600">IVA (21%)</td><td className="py-1 text-right text-gray-500">{formatPrice(detailOrder.tax)}</td></tr>
                <tr className="border-t border-gray-200">
                  <td className="py-2 font-bold text-gray-900">Total</td>
                  <td className="py-2 text-right font-bold text-gray-900 text-lg">{formatPrice(detailOrder.total)}</td>
                </tr>
              </tbody>
            </table>

            {/* Cambio de estado desde el detalle */}
            <div>
              <label htmlFor="detail-status" className="block text-sm font-semibold text-gray-700 mb-1">
                Cambiar estado del pedido
              </label>
              <select
                id="detail-status"
                value={detailOrder.status}
                onChange={e => changeStatus(detailOrder.id, e.target.value as OrderStatus)}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[44px]"
              >
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{statusConfig[s].label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
