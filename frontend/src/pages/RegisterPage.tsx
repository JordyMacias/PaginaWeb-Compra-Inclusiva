import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

// =====================================================
// PÁGINA DE REGISTRO
// =====================================================

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es obligatorio')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(80, 'El nombre no puede tener más de 80 caracteres'),
    email: z
      .string()
      .min(1, 'El correo electrónico es obligatorio')
      .email('Escribe una dirección de correo válida, por ejemplo: nombre@correo.es'),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe incluir al menos una letra mayúscula, una minúscula y un número'
      ),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    try {
      await authRegister(data);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(
        'No se pudo crear la cuenta. Es posible que ese correo ya esté registrado.'
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-surface-900">
            Crear cuenta
          </h1>
          <p className="mt-2 text-surface-600">
            Únete a CompraInclusiva. Es gratis y solo tarda un minuto.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">

          {serverError && (
            <Alert severity="error" className="mb-5">
              {serverError}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Formulario de registro"
          >
            <div className="space-y-5">

              <Input
                label="Nombre completo"
                type="text"
                autoComplete="name"
                placeholder="Tu nombre"
                error={errors.name?.message}
                required
                hint="Escribe tu nombre tal como quieres que aparezca en tus pedidos."
                {...register('name')}
              />

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

              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Al menos 8 caracteres"
                error={errors.password?.message}
                required
                hint="Mínimo 8 caracteres, con mayúscula, minúscula y número."
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

              <Input
                label="Confirmar contraseña"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                error={errors.confirmPassword?.message}
                required
                rightAddon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                    aria-pressed={showConfirm}
                    className="focus-visible:ring-2 focus-visible:ring-primary-600 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {showConfirm
                      ? <EyeOff aria-hidden="true" size={18} />
                      : <Eye aria-hidden="true" size={18} />
                    }
                  </button>
                }
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                loadingText="Creando cuenta..."
                leftIcon={<UserPlus size={18} />}
              >
                Crear cuenta
              </Button>

              <p className="text-xs text-surface-500 text-center">
                Al crear una cuenta aceptas nuestros{' '}
                <Link to="/terminos" className="text-primary-600 underline">
                  términos de uso
                </Link>{' '}
                y{' '}
                <Link to="/privacidad" className="text-primary-600 underline">
                  política de privacidad
                </Link>
                .
              </p>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-surface-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary-600 hover:text-primary-700
                       focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
