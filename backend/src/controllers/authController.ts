import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../types';
import { AppError } from '../middlewares/errorHandler';
import { prisma } from '../lib/prisma';

// =====================================================
// CONTROLADOR DE AUTENTICACIÓN
// =====================================================

const SALT_ROUNDS = 12;

function generateToken(userId: string, email: string, role: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError('Error de configuración del servidor.', 500, false);

  return jwt.sign(
    { userId, email, role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
  );
}

function sanitizeUser(user: { id: string; email: string; name: string; role: string; createdAt: Date }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    // Verificar si el correo ya existe
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return next(
        new AppError(
          'Ya existe una cuenta con ese correo electrónico.',
          409
        )
      );
    }

    // Hash de la contraseña con bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: 'customer' },
    });

    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({ where: { email } });

    // Comparar siempre para evitar ataques de timing
    const isValid =
      user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !isValid) {
      return next(
        new AppError(
          'Correo electrónico o contraseña incorrectos.',
          401
        )
      );
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      return next(new AppError('No autenticado.', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    if (!user) {
      return next(new AppError('Usuario no encontrado.', 404));
    }

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

export async function requestPasswordReset(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body as { email: string };

    // Verificar si existe el usuario (sin revelar si existe o no por seguridad)
    await prisma.user.findUnique({ where: { email } });

    // En producción: enviar correo con token de restablecimiento
    // Por seguridad, siempre devolvemos el mismo mensaje
    res.json({
      success: true,
      data: null,
      message:
        'Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.',
    });
  } catch (err) {
    next(err);
  }
}
