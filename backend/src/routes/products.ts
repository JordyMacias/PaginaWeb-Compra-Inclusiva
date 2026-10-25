import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getCategories,
} from '../controllers/productsController';

// =====================================================
// RUTAS DE PRODUCTOS Y CATEGORÍAS
// =====================================================

const router = Router();

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:slug
router.get('/:slug', getProductBySlug);

export default router;

// Rutas de categorías (exportadas por separado para el router principal)
export const categoriesRouter = Router();
categoriesRouter.get('/', getCategories);
