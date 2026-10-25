import { Router } from 'express';
import { body } from 'express-validator';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
} from '../controllers/ordersController';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

// =====================================================
// RUTAS DE PEDIDOS
// Todas requieren autenticación.
// =====================================================

const router = Router();

// Todas las rutas de pedidos requieren autenticación
router.use(requireAuth);

// GET /api/orders
router.get('/', getMyOrders);

// GET /api/orders/:id
router.get('/:id', getOrderById);

// POST /api/orders
router.post(
  '/',
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('El pedido debe tener al menos un artículo.'),
    body('items.*.productId')
      .notEmpty().withMessage('El ID del producto es obligatorio.'),
    body('items.*.quantity')
      .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1.'),
    body('items.*.unitPrice')
      .isFloat({ min: 0 }).withMessage('El precio unitario debe ser positivo.'),
    body('shippingAddress.recipientName')
      .notEmpty().withMessage('El nombre del destinatario es obligatorio.'),
    body('shippingAddress.street')
      .notEmpty().withMessage('La dirección es obligatoria.'),
    body('shippingAddress.city')
      .notEmpty().withMessage('La ciudad es obligatoria.'),
    body('shippingAddress.country')
      .notEmpty().withMessage('El país es obligatorio.'),
    body('shippingAddress.zipCode')
      .notEmpty().withMessage('El código postal es obligatorio.'),
  ],
  validate,
  createOrder
);

// PATCH /api/orders/:id/cancel
router.patch('/:id/cancel', cancelOrder);

export default router;
