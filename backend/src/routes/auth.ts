import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, requestPasswordReset } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';

// =====================================================
// RUTAS DE AUTENTICACIÓN
// Rate limiting en endpoints sensibles para proteger
// contra ataques de fuerza bruta.
// =====================================================

const router = Router();

// Rate limit: máx 10 intentos de login/registro por IP en 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Demasiados intentos. Por favor, espera 15 minutos antes de intentarlo de nuevo.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  [
    body('name')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio.')
      .isLength({ min: 2, max: 80 }).withMessage('El nombre debe tener entre 2 y 80 caracteres.'),
    body('email')
      .trim()
      .notEmpty().withMessage('El correo electrónico es obligatorio.')
      .isEmail().withMessage('Escribe un correo electrónico válido.')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria.')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('La contraseña debe incluir mayúscula, minúscula y número.'),
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email')
      .trim()
      .notEmpty().withMessage('El correo electrónico es obligatorio.')
      .isEmail().withMessage('Escribe un correo electrónico válido.')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria.'),
  ],
  validate,
  login
);

// GET /api/auth/me
router.get('/me', requireAuth, getMe);

// POST /api/auth/password-reset/request
router.post(
  '/password-reset/request',
  authLimiter,
  [
    body('email')
      .trim()
      .isEmail().withMessage('Escribe un correo electrónico válido.')
      .normalizeEmail(),
  ],
  validate,
  requestPasswordReset
);

export default router;
