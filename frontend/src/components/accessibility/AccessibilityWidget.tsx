import React, { useState, useRef } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cn } from '../../utils';
import type { AccessibilityPreferences } from '../../types';

// =====================================================
// WIDGET FLOTANTE DE ACCESIBILIDAD
// Botón circular en la esquina inferior izquierda con
// el símbolo internacional de accesibilidad (ISA).
// Al pulsar, abre un panel lateral con todas las opciones.
// =====================================================

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useFocusTrap(isOpen);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Cerrar con Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <>
      {/* ── Botón circular con símbolo ISA ── */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir opciones de accesibilidad"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={cn(
          'fixed bottom-6 left-6 z-40',
          'w-14 h-14 rounded-full',
          'bg-primary-700 hover:bg-primary-800 text-white',
          'shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'transition-all duration-200',
          'focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2',
          'a11y-widget-btn',
          isOpen && 'opacity-0 pointer-events-none'
        )}
      >
        {/* Símbolo Internacional de Accesibilidad (ISA) en SVG */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 fill-white"
        >
          {/* Cabeza */}
          <circle cx="50" cy="14" r="10" />
          {/* Cuerpo y rueda — versión moderna ISA */}
          <path d="M 35 28 L 28 55 L 20 55 L 20 63 L 32 63 L 38 40 L 52 40 L 60 55 L 70 55 L 56 28 Z" />
          {/* Rueda de silla */}
          <circle cx="38" cy="74" r="14" fill="none" stroke="white" strokeWidth="6" />
          {/* Pie extendido */}
          <path d="M 55 58 L 70 72 L 65 77 L 52 64 Z" />
        </svg>
        <span className="sr-only">Opciones de accesibilidad</span>
      </button>

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Panel lateral ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-widget-title"
        className={cn(
          'fixed bottom-0 left-0 z-50',
          'w-full sm:w-96 max-h-[90vh]',
          'bg-white rounded-t-2xl sm:rounded-tr-2xl sm:rounded-br-none sm:rounded-bl-none',
          'sm:h-full sm:max-h-screen sm:rounded-none sm:rounded-r-2xl',
          'shadow-2xl flex flex-col',
          'transition-transform duration-300',
          isOpen ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:-translate-x-full'
        )}
        hidden={!isOpen}
      >
        {/* Cabecera del panel */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
              <svg aria-hidden="true" viewBox="0 0 100 100" className="w-5 h-5 fill-white">
                <circle cx="50" cy="14" r="10" />
                <path d="M 35 28 L 28 55 L 20 55 L 20 63 L 32 63 L 38 40 L 52 40 L 60 55 L 70 55 L 56 28 Z" />
                <circle cx="38" cy="74" r="14" fill="none" stroke="white" strokeWidth="6" />
                <path d="M 55 58 L 70 72 L 65 77 L 52 64 Z" />
              </svg>
            </div>
            <h2 id="a11y-widget-title" className="text-lg font-bold text-gray-900">
              Accesibilidad
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar opciones de accesibilidad"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary-600"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          <PanelContent onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
}

// ─── Contenido del panel ───────────────────────────────────────────────────

function PanelContent({ onClose: _onClose }: { onClose: () => void }) {
  const {
    preferences,
    setFontSize,
    setLineHeight,
    toggleHighContrast,
    toggleDarkMode,
    toggleReducedMotion,
    toggleSimplifiedView,
    toggleWideSpacing,
    toggleDyslexiaFont,
    toggleLargeCursor,
    toggleFocusHighlight,
    resetPreferences,
  } = useAccessibility();

  return (
    <>
      {/* ─── Sección: Visión ─── */}
      <Section title="Visión y color">

        {/* Alto contraste */}
        <OptionRow
          label="Alto contraste"
          description="Fondo negro, texto blanco, botones amarillos. Máximo contraste para baja visión."
          icon="◑"
          checked={preferences.highContrast}
          onChange={toggleHighContrast}
          id="opt-contrast"
        />

        {/* Modo oscuro */}
        <OptionRow
          label="Modo oscuro"
          description="Fondo oscuro con texto claro. Reduce el brillo para mayor comodidad."
          icon="🌙"
          checked={preferences.darkMode}
          onChange={toggleDarkMode}
          id="opt-dark"
        />

        {/* Vista simplificada */}
        <OptionRow
          label="Vista simplificada"
          description="Oculta elementos decorativos. Solo el contenido esencial."
          icon="▣"
          checked={preferences.simplifiedView}
          onChange={toggleSimplifiedView}
          id="opt-simple"
        />
      </Section>

      {/* ─── Sección: Texto ─── */}
      <Section title="Texto y lectura">

        {/* Tamaño de texto */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Tamaño del texto</p>
          <p className="text-xs text-gray-500 mb-2">Elige el tamaño que te resulte más cómodo para leer.</p>
          <div role="radiogroup" aria-label="Tamaño del texto" className="grid grid-cols-4 gap-1.5">
            {([
              { value: 'normal', label: 'Normal', sample: 'A' },
              { value: 'large',  label: 'Grande', sample: 'A' },
              { value: 'xl',     label: 'Muy\ngrande', sample: 'A' },
              { value: 'xxl',    label: 'Enorme', sample: 'A' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={preferences.fontSize === opt.value}
                onClick={() => setFontSize(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 px-1 rounded-lg border-2 text-center',
                  'min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-primary-600',
                  preferences.fontSize === opt.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-700 hover:border-primary-300'
                )}
              >
                <span className={cn(
                  'font-bold leading-none',
                  opt.value === 'normal' && 'text-sm',
                  opt.value === 'large'  && 'text-base',
                  opt.value === 'xl'     && 'text-lg',
                  opt.value === 'xxl'    && 'text-xl',
                )}>
                  {opt.sample}
                </span>
                <span className="text-[10px] leading-tight whitespace-pre-line">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Altura de línea */}
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Altura de línea</p>
          <p className="text-xs text-gray-500 mb-2">Más espacio entre líneas facilita la lectura.</p>
          <div role="radiogroup" aria-label="Altura de línea" className="grid grid-cols-3 gap-1.5">
            {([
              { value: 'normal', label: 'Normal' },
              { value: 'wide',   label: 'Amplia' },
              { value: 'wider',  label: 'Muy amplia' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={preferences.lineHeight === opt.value}
                onClick={() => setLineHeight(opt.value)}
                className={cn(
                  'py-2 px-2 rounded-lg border-2 text-xs font-medium',
                  'min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-primary-600',
                  preferences.lineHeight === opt.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-700 hover:border-primary-300'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Espaciado ampliado */}
        <OptionRow
          label="Espaciado entre letras"
          description="Aumenta el espacio entre letras y palabras (WCAG 1.4.12)."
          icon="↔"
          checked={preferences.wideSpacing}
          onChange={toggleWideSpacing}
          id="opt-spacing"
        />

        {/* Fuente para dislexia */}
        <OptionRow
          label="Fuente fácil de leer"
          description="Cambia la fuente a una más sencilla que ayuda con la dislexia."
          icon="Aa"
          checked={preferences.dyslexiaFont}
          onChange={toggleDyslexiaFont}
          id="opt-dyslexia"
        />
      </Section>

      {/* ─── Sección: Movimiento ─── */}
      <Section title="Movimiento y animaciones">
        <OptionRow
          label="Reducir animaciones"
          description="Desactiva o reduce los efectos visuales animados de la página."
          icon="⏸"
          checked={preferences.reducedMotion}
          onChange={toggleReducedMotion}
          id="opt-motion"
        />
      </Section>

      {/* ─── Sección: Navegación ─── */}
      <Section title="Navegación y foco">
        <OptionRow
          label="Cursor grande"
          description="Aumenta el tamaño del cursor del ratón para verlo mejor."
          icon="↖"
          checked={preferences.largeCursor}
          onChange={toggleLargeCursor}
          id="opt-cursor"
        />
        <OptionRow
          label="Resaltar foco de teclado"
          description="Marca con un contorno naranja visible dónde está el foco al navegar con Tab."
          icon="⬡"
          checked={preferences.focusHighlight}
          onChange={toggleFocusHighlight}
          id="opt-focus"
        />
      </Section>

      {/* ─── Restablecer ─── */}
      <button
        type="button"
        onClick={resetPreferences}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                   border-2 border-gray-300 text-gray-700 text-sm font-medium
                   hover:bg-gray-50 min-h-[44px] transition-colors
                   focus-visible:ring-2 focus-visible:ring-primary-600"
        aria-label="Restablecer todas las opciones de accesibilidad a los valores predeterminados"
      >
        <RotateCcw aria-hidden="true" size={15} />
        Restablecer opciones
      </button>

      <p className="text-xs text-gray-500 text-center pb-2">
        Tus preferencias se guardan automáticamente.
      </p>
    </>
  );
}

// ─── Componentes auxiliares ────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`section-${title.replace(/\s/g, '-').toLowerCase()}`}>
      <h3
        id={`section-${title.replace(/\s/g, '-').toLowerCase()}`}
        className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-1"
      >
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

interface OptionRowProps {
  label: string;
  description: string;
  icon: string;
  checked: boolean;
  onChange: () => void;
  id: string;
}

function OptionRow({ label, description, icon, checked, onChange, id }: OptionRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-2.5 flex-1 min-w-0">
        <span aria-hidden="true" className="text-lg mt-0.5 flex-shrink-0 w-6 text-center leading-none">
          {icon}
        </span>
        <div className="min-w-0">
          <label
            htmlFor={id}
            className="text-sm font-semibold text-gray-800 cursor-pointer block"
          >
            {label}
          </label>
          <p className="text-xs text-gray-500 leading-snug mt-0.5">{description}</p>
        </div>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? 'activado' : 'desactivado'}`}
        onClick={onChange}
        className={cn(
          'relative flex-shrink-0 w-12 h-7 rounded-full border-2 transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
          'min-h-[44px] min-w-[44px] flex items-center justify-center',
          checked
            ? 'bg-primary-600 border-primary-600'
            : 'bg-gray-200 border-gray-300'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-2.5' : '-translate-x-2.5'
          )}
        />
        <span className="sr-only">{checked ? 'Activado' : 'Desactivado'}</span>
      </button>
    </div>
  );
}
