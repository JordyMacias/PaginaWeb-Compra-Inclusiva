import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { User, LoginCredentials, RegisterData, ApiError } from '../types';
import { authService } from '../services/auth';

// =====================================================
// CONTEXTO DE AUTENTICACIÓN
// Gestiona el estado del usuario autenticado, el token
// JWT y las operaciones de login/logout/registro.
// =====================================================

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'compra-inclusiva-token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage no disponible
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage no disponible
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar, verificar si hay un token guardado e intentar cargar el usuario
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      authService
        .getMe()
        .then(userData => setUser(userData))
        .catch(() => {
          // Token expirado o inválido — limpiar sin error
          removeStoredToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { user: loggedUser, token } = await authService.login(credentials);
    setStoredToken(token);
    setUser(loggedUser);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const { user: newUser, token } = await authService.register(data);
    setStoredToken(token);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    removeStoredToken();
    setUser(null);
    // Redirigir al inicio sin recargar (React Router lo maneja)
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch {
      logout();
    }
  }, [logout]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}

// Hook de tipado para errores de API
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    (error as ApiError).success === false
  );
}
