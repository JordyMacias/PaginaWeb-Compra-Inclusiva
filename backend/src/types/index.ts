import type { Request } from 'express';

// =====================================================
// TIPOS COMPARTIDOS DEL BACKEND
// =====================================================

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
}

// Extiende Request de Express para incluir el usuario autenticado
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
