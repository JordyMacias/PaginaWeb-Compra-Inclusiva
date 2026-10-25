import { api } from './api';
import type { User, LoginCredentials, RegisterData } from '../types';
import { USE_MOCK_DATA } from './products';

// =====================================================
// SERVICIO DE AUTENTICACIÓN
// En modo mock, simula login/registro con usuarios demo.
// =====================================================

interface AuthResponse {
  user: User;
  token: string;
}

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'user-1',
    email: 'usuario@demo.es',
    name: 'Usuario Demo',
    role: 'customer',
    createdAt: '2024-01-01T00:00:00Z',
    password: 'Demo1234!',
  },
  {
    id: 'user-2',
    email: 'admin@comprainclusiva.es',
    name: 'Administrador',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    password: 'Admin1234!',
  },
];

function makeMockToken(userId: string) {
  // Token falso para modo mock (base64 del payload)
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
  return `mock.${payload}.signature`;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 500));
      const found = MOCK_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      if (!found) {
        throw { success: false, message: 'Correo electrónico o contraseña incorrectos.' };
      }
      const { password: _pw, ...user } = found;
      return { user, token: makeMockToken(user.id) };
    }
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 500));
      const exists = MOCK_USERS.find(u => u.email === data.email);
      if (exists) {
        throw { success: false, message: 'Ya existe una cuenta con ese correo electrónico.' };
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      return { user: newUser, token: makeMockToken(newUser.id) };
    }
    const { confirmPassword: _confirm, ...payload } = data;
    return api.post<AuthResponse>('/auth/register', payload);
  },

  async getMe(): Promise<User> {
    if (USE_MOCK_DATA) {
      // Leer el token mock del localStorage para saber qué usuario es
      const token = localStorage.getItem('compra-inclusiva-token');
      if (!token || !token.startsWith('mock.')) {
        throw new Error('Token inválido');
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      const found = MOCK_USERS.find(u => u.id === payload.userId);
      if (!found) throw new Error('Usuario no encontrado');
      const { password: _pw, ...user } = found;
      return user;
    }
    return api.get<User>('/auth/me');
  },

  async requestPasswordReset(email: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 400));
      // En modo mock siempre devuelve éxito por seguridad
      return;
    }
    await api.post('/auth/password-reset/request', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    if (USE_MOCK_DATA) return;
    await api.post('/auth/password-reset/confirm', { token, password });
  },

  // Actualizar datos del perfil
  async updateProfile(userId: string, data: { name: string; email: string }): Promise<User> {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 400));
      const idx = MOCK_USERS.findIndex(u => u.id === userId);
      if (idx !== -1) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data };
        const { password: _pw, ...user } = MOCK_USERS[idx];
        return user;
      }
      throw new Error('Usuario no encontrado.');
    }
    return api.patch<User>('/auth/profile', data);
  },

  // Cambiar contraseña
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 400));
      const user = MOCK_USERS.find(u => u.id === userId);
      if (!user) throw new Error('Usuario no encontrado.');
      if (user.password !== currentPassword) {
        throw { success: false, message: 'La contraseña actual no es correcta.' };
      }
      user.password = newPassword;
      return;
    }
    await api.post('/auth/change-password', { currentPassword, newPassword });
  },
};
