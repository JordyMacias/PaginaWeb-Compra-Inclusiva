import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Star, Package } from 'lucide-react';
import { adminService } from '../../services/admin';
import { mockCategories } from '../../data/mockProducts';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Alert } from '../../components/common/Alert';
import { Badge } from '../../components/common/Badge';
import { formatPrice, toSlug } from '../../utils';
import type { Product, ProductFormData } from '../../types';

// =====================================================
// ADMIN — GESTIÓN DE PRODUCTOS
// CRUD completo: listar, crear, editar, eliminar
// =====================================================

const emptyForm: ProductFormData = {
  name: '', slug: '', description: '', shortDescription: '',
  price: 0, compareAtPrice: undefined, stock: 0, sku: '',
  categoryId: 'cat-1', tags: '', featured: false,
  imageUrl: '', imageAlt: '',
};

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      setProducts(await adminService.getProducts());
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name, slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription ?? '',
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      stock: p.stock, sku: p.sku ?? '',
      categoryId: p.categoryId,
      tags: p.tags?.join(', ') ?? '',
      featured: p.featured,
      imageUrl: p.images[0]?.url ?? '',
      imageAlt: p.images[0]?.alt ?? '',
    });
    setFormErrors({});
    setShowForm(true);
  }

  function validate(): boolean {
    const errors: typeof formErrors = {};
    if (!form.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (form.price <= 0) errors.price = 'El precio debe ser mayor que 0.';
    if (form.stock < 0) errors.stock = 'El stock no puede ser negativo.';
    if (!form.description.trim()) errors.description = 'La descripción es obligatoria.';
    if (form.imageUrl && !form.imageAlt.trim()) errors.imageAlt = 'Si añades imagen, el texto alternativo es obligatorio para accesibilidad.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const dataToSave = {
        ...form,
        slug: form.slug || toSlug(form.name),
      };
      if (editingId) {
        await adminService.updateProduct(editingId, dataToSave);
        setFeedback({ type: 'success', msg: 'Producto actualizado correctamente.' });
      } else {
        await adminService.createProduct(dataToSave);
        setFeedback({ type: 'success', msg: 'Producto creado correctamente.' });
      }
      setShowForm(false);
      await load();
    } catch {
      setFeedback({ type: 'error', msg: 'No se pudo guardar el producto.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteProduct(deleteTarget.id);
      setFeedback({ type: 'success', msg: `"${deleteTarget.name}" eliminado.` });
      setDeleteTarget(null);
      await load();
    } catch {
      setFeedback({ type: 'error', msg: 'No se pudo eliminar el producto.' });
    } finally {
      setDeleting(false);
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de productos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} productos en el catálogo</p>
        </div>
        <Button
          variant="primary"
          onClick={openCreate}
          leftIcon={<Plus size={18} />}
          aria-label="Añadir nuevo producto al catálogo"
        >
          Añadir producto
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mb-4">
          <Alert
            severity={feedback.type}
            onDismiss={() => setFeedback(null)}
          >
            {feedback.msg}
          </Alert>
        </div>
      )}

      {/* Búsqueda */}
      <div className="mb-4 max-w-sm">
        <Input
          label="Buscar producto"
          hideLabel
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          leftAddon={<Search size={16} />}
          aria-label="Filtrar productos por nombre o categoría"
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-center py-12 text-gray-500">Cargando productos...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Package aria-hidden="true" size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No se encontraron productos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]" aria-label="Lista de productos del catálogo">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <img
                            src={p.images[0].url}
                            alt=""
                            aria-hidden="true"
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                        ) : (
                          <div aria-hidden="true" className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {p.name}
                          </p>
                          {p.featured && (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                              <Star aria-hidden="true" size={10} className="fill-yellow-400" />
                              Destacado
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.category.name}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          p.stock === 0 ? 'text-red-600'
                          : p.stock <= 5 ? 'text-yellow-600'
                          : 'text-green-700'
                        }`}
                        aria-label={`Stock: ${p.stock === 0 ? 'Agotado' : `${p.stock} unidades`}`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.stock === 0
                        ? <Badge variant="error">Agotado</Badge>
                        : p.stock <= 5
                        ? <Badge variant="warning">Poco stock</Badge>
                        : <Badge variant="success">Disponible</Badge>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          aria-label={`Editar producto ${p.name}`}
                          className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary-600"
                        >
                          <Pencil aria-hidden="true" size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          aria-label={`Eliminar producto ${p.name}`}
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          <Trash2 aria-hidden="true" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modal: Crear / Editar ── */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingId ? 'Editar producto' : 'Añadir nuevo producto'}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre del producto"
              required
              value={form.name}
              onChange={e => {
                const name = e.target.value;
                setForm(prev => ({ ...prev, name, slug: prev.slug || toSlug(name) }));
              }}
              error={formErrors.name}
            />
            <Input
              label="URL amigable (slug)"
              value={form.slug}
              onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
              hint="Se genera automáticamente desde el nombre."
            />
          </div>

          <div>
            <label htmlFor="prod-desc" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <textarea
              id="prod-desc"
              required
              rows={3}
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full rounded-lg border-2 px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary-600 ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              aria-required="true"
              aria-invalid={!!formErrors.description}
            />
            {formErrors.description && (
              <p role="alert" className="text-xs text-red-600 mt-1">{formErrors.description}</p>
            )}
          </div>

          <Input
            label="Descripción corta"
            value={form.shortDescription}
            onChange={e => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
            hint="Aparece en las tarjetas de producto."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Input
              label="Precio (€)"
              type="number"
              min={0}
              step={0.01}
              required
              value={form.price || ''}
              onChange={e => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              error={formErrors.price}
            />
            <Input
              label="Precio anterior (€)"
              type="number"
              min={0}
              step={0.01}
              value={form.compareAtPrice ?? ''}
              onChange={e => setForm(prev => ({ ...prev, compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined }))}
              hint="Opcional. Precio tachado."
            />
            <Input
              label="Stock"
              type="number"
              min={0}
              required
              value={form.stock}
              onChange={e => setForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              error={formErrors.stock}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prod-category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="prod-category"
                value={form.categoryId}
                onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600 min-h-[44px]"
              >
                {mockCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <Input
              label="SKU (código)"
              value={form.sku}
              onChange={e => setForm(prev => ({ ...prev, sku: e.target.value }))}
              hint="Opcional. Código interno del producto."
            />
          </div>

          <Input
            label="Etiquetas (separadas por comas)"
            value={form.tags}
            onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
            hint='Ejemplo: "bluetooth, inalámbrico, auriculares"'
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="URL de la imagen"
              type="url"
              value={form.imageUrl}
              onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
              hint="Pega la URL de la imagen del producto."
            />
            <Input
              label="Descripción alternativa de la imagen"
              value={form.imageAlt}
              onChange={e => setForm(prev => ({ ...prev, imageAlt: e.target.value }))}
              hint="Obligatorio si hay imagen. Describe la imagen para personas ciegas."
              error={formErrors.imageAlt}
            />
          </div>

          {/* Vista previa de imagen */}
          {form.imageUrl && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Vista previa de la imagen:</p>
              <img
                src={form.imageUrl}
                alt={form.imageAlt || 'Vista previa del producto'}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="featured-check"
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-5 h-5 rounded accent-primary-600"
            />
            <label htmlFor="featured-check" className="text-sm font-medium text-gray-700 cursor-pointer">
              Mostrar como producto destacado en la página de inicio
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={saving}
              loadingText="Guardando..."
            >
              {editingId ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Confirmar eliminación ── */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar producto"
        description={`¿Estás seguro de que quieres eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        size="sm"
      >
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleting}
            loadingText="Eliminando..."
            leftIcon={<Trash2 size={16} />}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
