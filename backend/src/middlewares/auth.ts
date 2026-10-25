import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, JwtPayload } from '../types';
import { AppError } from './errorHandler';

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN JWT
// =====================================================

export function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Autenticación requerida. Por favor, inicia sesión.', 401));
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new AppError('Error de configuración del servidor.', 500, false));
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError('La sesión ha caducado. Por favor, vuelve a iniciar sesión.', 401));
    }
    return next(new AppError('Token de autenticación inválido.', 401));
  }
}

export function requireAdmin(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(new AppError('Autenticación requerida.', 401));
  }
  if (req.user.role !== 'admin') {
    return next(new AppError('No tienes permisos para realizar esta acción.', 403));
  }
  next();
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) return next();

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = payload;
  } catch {
    // Token inválido en modo opcional — continuar sin autenticar
  }
  next();
}
