import React from 'react';
import { Type, Contrast, Minus, Eye, AlignLeft, RotateCcw } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Button } from '../common/Button';
import { cn } from '../../utils';

// =====================================================
// PANEL DE ACCESIBILIDAD
// Permite al usuario personalizar su experiencia de lectura.
// IMPORTANTE: estas opciones COMPLEMENTAN la accesibilidad
// del diseño base, no la sustituyen.
// =====================================================

export function AccessibilityPanel() {
  const {
    preferences,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleSimplifiedView,
    toggleWideSpacing,
    resetPreferences,
  } = useAccessibility();

  return (
    <div
      aria-labelledby="a11y-panel-title"
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h1
          id="a11y-panel-title"
          className="text-2xl font-bold text-surface-900"
        >
          Opciones de accesibilidad
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetPreferences}
          leftIcon={<RotateCcw size={16} />}
          aria-label="Restablecer todas las opciones a sus valores predeterminados"
        >
          Restablecer
        </Button>
      </div>

      <p className="text-surface-600 mb-8 text-base leading-relaxed">
        Personaliza cómo se ve la página para que sea más cómoda de usar.
        Tus preferencias se guardarán para tu próxima visita.
      </p>

      <div className="space-y-6">

        {/* Tamaño del texto */}
        <fieldset className="bg-surface-50 rounded-xl p-5 border border-surface-200">
          <legend className="flex items-center gap-2 text-base font-semibold text-surface-800 mb-3">
            <Type aria-hidden="true" size={18} />
            Tamaño del texto
          </legend>
          <p className="text-sm text-surface-600 mb-4">
            Elige el tamaño de letra que te resulte más cómodo para leer.
          </p>
          <div
            role="radiogroup"
            aria-label="Tamaño del texto"
            className="flex flex-wrap gap-3"
          >
            {(
              [
                { value: 'normal', label: 'Normal', description: 'Tamaño estándar' },
                { value: 'large', label: 'Grande', description: '20% más grande' },
                { value: 'xl', label: 'Muy grande', description: '40% más grande' },
              ] as const
            ).map(({ value, label, description }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={preferences.fontSize === value}
                onClick={() => setFontSize(value)}
                className={cn(
                  'flex flex-col items-center gap-1 px-5 py-3 rounded-lg border-2',
                  'transition-colors duration-200 min-h-[44px]',
                  'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
                  preferences.fontSize === value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-surface-300 bg-white text-surface-700 hover:border-primary-300'
                )}
              >
                <span className="font-semibold">{label}</span>
                <span className="text-xs opacity-75">{description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Alto contraste */}
        <div className="bg-surface-50 rounded-xl p-5 border border-surface-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Contrast aria-hidden="true" size={18} />
                <h2 className="text-base font-semibold text-surface-800">
                  Alto contraste
                </h2>
              </div>
              <p className="text-sm text-surface-600">
                Aumenta el contraste entre el texto y el fondo para que sea
                más fácil de leer.
              </p>
            </div>
            <ToggleSwitch
              id="toggle-contrast"
              checked={preferences.highContrast}
              onChange={toggleHighContrast}
              label="Activar alto contraste"
            />
          </div>
        </div>

        {/* Movimiento reducido */}
        <div className="bg-surface-50 rounded-xl p-5 border border-surface-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Minus aria-hidden="true" size={18} />
                <h2 className="text-base font-semibold text-surface-800">
                  Reducir animaciones
                </h2>
              </div>
              <p className="text-sm text-surface-600">
                Desactiva o reduce los efectos de movimiento y animaciones de
                la página.
              </p>
            </div>
            <ToggleSwitch
              id="toggle-motion"
              checked={preferences.reducedMotion}
              onChange={toggleReducedMotion}
              label="Reducir animaciones"
            />
          </div>
        </div>

        {/* Vista simplificada */}
        <div className="bg-surface-50 rounded-xl p-5 border border-surface-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Eye aria-hidden="true" size={18} />
                <h2 className="text-base font-semibold text-surface-800">
                  Vista simplificada
                </h2>
              </div>
              <p className="text-sm text-surface-600">
                Muestra solo lo esencial. Oculta elementos decorativos y
                simplifica el diseño.
              </p>
            </div>
            <ToggleSwitch
              id="toggle-simplified"
              checked={preferences.simplifiedView}
              onChange={toggleSimplifiedView}
              label="Activar vista simplificada"
            />
          </div>
        </div>

        {/* Espaciado ampliado */}
        <div className="bg-surface-50 rounded-xl p-5 border border-surface-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlignLeft aria-hidden="true" size={18} />
                <h2 className="text-base font-semibold text-surface-800">
                  Espaciado ampliado
                </h2>
              </div>
              <p className="text-sm text-surface-600">
                Aumenta el espacio entre letras, palabras y líneas para
                facilitar la lectura.
              </p>
            </div>
            <ToggleSwitch
              id="toggle-spacing"
              checked={preferences.wideSpacing}
              onChange={toggleWideSpacing}
              label="Activar espaciado ampliado"
            />
          </div>
        </div>
      </div>

      {/* Nota informativa */}
      <div
        role="note"
        className="mt-8 p-4 bg-info-100 text-info-700 rounded-lg text-sm"
      >
        <strong>Nota:</strong> Estas opciones se guardan en tu dispositivo.
        Si usas un lector de pantalla, teclado u otras tecnologías de asistencia,
        esta página ya es compatible con ellas sin necesidad de configuración
        adicional.
      </div>
    </div>
  );
}

// --- Componente interruptor (toggle) accesible ---

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}

function ToggleSwitch({ id, checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-7 w-14 flex-shrink-0 rounded-full border-2',
        'transition-colors duration-200 cursor-pointer',
        'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
        'min-h-[44px] items-center justify-center',
        checked
          ? 'bg-primary-600 border-primary-600'
          : 'bg-surface-300 border-surface-300'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow',
          'transition-transform duration-200',
          checked ? 'translate-x-3' : '-translate-x-3'
        )}
      />
    </button>
  );
}
