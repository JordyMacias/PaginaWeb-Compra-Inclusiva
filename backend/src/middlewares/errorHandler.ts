import type { Request, Response, NextFunction } from 'express';

// =====================================================
// MIDDLEWARE DE MANEJO CENTRALIZADO DE ERRORES
// - Respuestas de error consistentes
// - Registro sin exposición de información sensible
// =====================================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Registrar el error sin datos sensibles
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error('[Error]', {
      message: err.message,
      stack: err.stack?.split('\n').slice(0, 5).join('\n'),
    });
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Errores de Prisma
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as Error & { code?: string };
    if (prismaErr.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Ya existe un registro con esos datos.',
      });
      return;
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'El recurso solicitado no fue encontrado.',
      });
      return;
    }
  }

  // Error genérico — no exponer detalles internos en producción
  res.status(500).json({
    success: false,
    message: isProduction
      ? 'Ha ocurrido un error interno. Inténtalo de nuevo más tarde.'
      : err.message,
  });
}

// Middleware para rutas no encontradas
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
}
