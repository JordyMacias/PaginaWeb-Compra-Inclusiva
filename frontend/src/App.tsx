import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PageSpinner } from './components/common/Spinner';

// ── Páginas de la tienda ──────────────────────────────
const HomePage = lazy(() =>
  import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CatalogPage = lazy(() =>
  import('./pages/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() =>
  import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const HelpPage = lazy(() =>
  import('./pages/HelpPage').then(m => ({ default: m.HelpPage })));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));

// ── Panel de administración ───────────────────────────
const AdminLayout = lazy(() =>
  import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() =>
  import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() =>
  import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() =>
  import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));

export function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<PageSpinner />}>
              <Routes>

                {/* ── Tienda (con header/footer + widget accesibilidad) ── */}
                <Route element={<Layout />}>
                  <Route path="/"              element={<HomePage />} />
                  <Route path="/catalogo"       element={<CatalogPage />} />
                  <Route path="/producto/:slug" element={<ProductDetailPage />} />
                  <Route path="/carrito"        element={<CartPage />} />
                  <Route path="/login"          element={<LoginPage />} />
                  <Route path="/registro"       element={<RegisterPage />} />
                  <Route path="/ayuda"          element={<HelpPage />} />
                  <Route
                    path="/perfil"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Redirecciones */}
                  <Route path="/inicio"    element={<Navigate to="/" replace />} />
                  <Route path="/productos" element={<Navigate to="/catalogo" replace />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* ── Panel de administración (sin header/footer) ── */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index      element={<AdminDashboard />} />
                  <Route path="productos" element={<AdminProducts />} />
                  <Route path="pedidos"   element={<AdminOrders />} />
                </Route>

              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
