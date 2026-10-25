import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// =====================================================
// MIDDLEWARE DE VALIDACIÓN DE ENTRADAS
// Procesa los resultados de express-validator y devuelve
// errores en un formato consistente y accesible.
// =====================================================

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Agrupar errores por campo para facilitar el mapeo en el frontend
    const fieldErrors: Record<string, string[]> = {};
    errors.array().forEach(err => {
      if (err.type === 'field') {
        const field = err.path;
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(err.msg as string);
      }
    });

    res.status(422).json({
      success: false,
      message: 'Los datos introducidos no son válidos. Revisa los campos marcados.',
      errors: fieldErrors,
    });
    return;
  }

  next();
}
