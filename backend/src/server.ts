import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno antes que cualquier otro módulo
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import authRouter from './routes/auth';
import productsRouter, { categoriesRouter } from './routes/products';
import ordersRouter from './routes/orders';
import adminRouter from './routes/admin';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// =====================================================
// SERVIDOR EXPRESS
// =====================================================

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// --- Seguridad ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// CORS — solo permite el origen del frontend
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting general (100 req/15min por IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Por favor, espera antes de intentarlo de nuevo.',
  },
});
app.use(generalLimiter);

// --- Parseo de cuerpo ---
app.use(express.json({ limit: '10kb' }));  // Limitar tamaño para evitar ataques
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- Rutas de salud ---
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// --- Rutas de la API ---
app.use('/api/auth',     authRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders',   ordersRouter);
app.use('/api/admin',    adminRouter);

// --- Manejo de errores ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Iniciar servidor ---
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV ?? 'development'}`);
});

export default app;
