import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth';
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetStats,
} from '../controllers/adminController';

// =====================================================
// RUTAS DE ADMINISTRACIÓN — Todas requieren rol admin
// =====================================================

const router = Router();

// Aplicar autenticación y verificación de admin a todas las rutas
router.use(requireAuth, requireAdmin);

// Dashboard
router.get('/stats', adminGetStats);

// Productos
router.get('/products',       adminGetProducts);
router.post('/products',      adminCreateProduct);
router.put('/products/:id',   adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Pedidos
router.get('/orders',              adminGetOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

export default router;
