import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Eye, EyeOff, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

// =====================================================
// PÁGINA DE INICIO DE SESIÓN
// - Formulario accesible con react-hook-form + zod
// - Mostrar/ocultar contraseña accesible
// - Mensajes de error claros y asociados a los campos
// =====================================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Escribe una dirección de correo válida, por ejemplo: nombre@correo.es'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: string })?.from ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError(null);
    try {
      await login(data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(
        'Correo electrónico o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.'
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Cabecera */}
        <div className="text-center mb-8">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center"
          >
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-surface-600">
            Accede a tu cuenta para ver tus pedidos y comprar más rápido.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">

          {serverError && (
            <Alert severity="error" className="mb-5">
              {serverError}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Formulario de inicio de sesión"
          >
            <div className="space-y-5">

              <Input
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="tu@correo.es"
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <div className="flex flex-col gap-1.5">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  error={errors.password?.message}
                  required
                  rightAddon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      aria-pressed={showPassword}
                      className="focus-visible:ring-2 focus-visible:ring-primary-600 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      {showPassword
                        ? <EyeOff aria-hidden="true" size={18} />
                        : <Eye aria-hidden="true" size={18} />
                      }
                    </button>
                  }
                  {...register('password')}
                />
                <div className="flex justify-end">
                  <Link
                    to="/recuperar-contrasena"
                    className="text-sm text-primary-600 hover:text-primary-700
                               focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                loadingText="Iniciando sesión..."
                leftIcon={<LogIn size={18} />}
              >
                Iniciar sesión
              </Button>
            </div>
          </form>
        </div>

        {/* Enlace a registro */}
        <p className="mt-6 text-center text-sm text-surface-600">
          ¿No tienes cuenta?{' '}
          <Link
            to="/registro"
            className="font-semibold text-primary-600 hover:text-primary-700
                       focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
          >
            Crear cuenta gratuita
          </Link>
        </p>
      </div>
    </div>
  );
}
