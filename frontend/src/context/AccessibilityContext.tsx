import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { AccessibilityPreferences } from '../types';

// =====================================================
// CONTEXTO DE ACCESIBILIDAD AMPLIADO
// Cubre: tipografía, contraste, movimiento, dislexia,
// cursor, foco, altura de línea, modo oscuro.
// =====================================================

interface AccessibilityContextValue {
  preferences: AccessibilityPreferences;
  setFontSize: (size: AccessibilityPreferences['fontSize']) => void;
  setLineHeight: (lh: AccessibilityPreferences['lineHeight']) => void;
  toggleHighContrast: () => void;
  toggleDarkMode: () => void;
  toggleReducedMotion: () => void;
  toggleSimplifiedView: () => void;
  toggleWideSpacing: () => void;
  toggleDyslexiaFont: () => void;
  toggleLargeCursor: () => void;
  toggleFocusHighlight: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: AccessibilityPreferences = {
  fontSize: 'normal',
  wideSpacing: false,
  highContrast: false,
  darkMode: false,
  reducedMotion: false,
  simplifiedView: false,
  dyslexiaFont: false,
  largeCursor: false,
  focusHighlight: false,
  lineHeight: 'normal',
};

const STORAGE_KEY = 'compra-inclusiva-a11y';
const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function loadPreferences(): AccessibilityPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultPreferences, ...JSON.parse(stored) };
  } catch { /* ignorar */ }

  return {
    ...defaultPreferences,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

function applyPreferencesToDOM(prefs: AccessibilityPreferences): void {
  const html = document.documentElement;

  // Tamaño de texto (también via style para que el calc() de html funcione)
  html.classList.remove('text-large', 'text-xl', 'text-xxl');
  if (prefs.fontSize === 'large') html.classList.add('text-large');
  if (prefs.fontSize === 'xl')    html.classList.add('text-xl');
  if (prefs.fontSize === 'xxl')   html.classList.add('text-xxl');
  html.style.setProperty('--font-size-scale',
    prefs.fontSize === 'xxl' ? '1.6'
    : prefs.fontSize === 'xl' ? '1.4'
    : prefs.fontSize === 'large' ? '1.2'
    : '1'
  );

  // Alto contraste y modo oscuro son mutuamente excluyentes
  html.classList.toggle('high-contrast', prefs.highContrast);
  html.classList.toggle('dark', prefs.darkMode && !prefs.highContrast);

  // Movimiento
  html.classList.toggle('reduce-motion', prefs.reducedMotion);

  // Vista simplificada
  html.classList.toggle('simplified-view', prefs.simplifiedView);

  // Espaciado
  html.classList.toggle('spacing-wide', prefs.wideSpacing);

  // Fuente dislexia
  html.classList.toggle('dyslexia-font', prefs.dyslexiaFont);

  // Cursor grande
  html.classList.toggle('large-cursor', prefs.largeCursor);

  // Foco destacado
  html.classList.toggle('focus-highlight', prefs.focusHighlight);

  // Altura de línea
  html.classList.remove('line-height-wide', 'line-height-wider');
  if (prefs.lineHeight === 'wide')  html.classList.add('line-height-wide');
  if (prefs.lineHeight === 'wider') html.classList.add('line-height-wider');
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(loadPreferences);

  useEffect(() => {
    applyPreferencesToDOM(preferences);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch { /* ignorar */ }
  }, [preferences]);

  // Escuchar cambios del sistema
  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = (e: MediaQueryListEvent) =>
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }));
    mqMotion.addEventListener('change', onMotion);
    return () => mqMotion.removeEventListener('change', onMotion);
  }, []);

  const setFontSize = useCallback(
    (size: AccessibilityPreferences['fontSize']) =>
      setPreferences(prev => ({ ...prev, fontSize: size })), []);

  const setLineHeight = useCallback(
    (lh: AccessibilityPreferences['lineHeight']) =>
      setPreferences(prev => ({ ...prev, lineHeight: lh })), []);

  // Alto contraste desactiva modo oscuro al activarse
  const toggleHighContrast = useCallback(() =>
    setPreferences(prev => ({
      ...prev,
      highContrast: !prev.highContrast,
      darkMode: prev.highContrast ? prev.darkMode : false,
    })), []);

  // Modo oscuro desactiva alto contraste al activarse
  const toggleDarkMode = useCallback(() =>
    setPreferences(prev => ({
      ...prev,
      darkMode: !prev.darkMode,
      highContrast: prev.darkMode ? prev.highContrast : false,
    })), []);

  const toggleReducedMotion = useCallback(() =>
    setPreferences(prev => ({ ...prev, reducedMotion: !prev.reducedMotion })), []);

  const toggleSimplifiedView = useCallback(() =>
    setPreferences(prev => ({ ...prev, simplifiedView: !prev.simplifiedView })), []);

  const toggleWideSpacing = useCallback(() =>
    setPreferences(prev => ({ ...prev, wideSpacing: !prev.wideSpacing })), []);

  const toggleDyslexiaFont = useCallback(() =>
    setPreferences(prev => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont })), []);

  const toggleLargeCursor = useCallback(() =>
    setPreferences(prev => ({ ...prev, largeCursor: !prev.largeCursor })), []);

  const toggleFocusHighlight = useCallback(() =>
    setPreferences(prev => ({ ...prev, focusHighlight: !prev.focusHighlight })), []);

  const resetPreferences = useCallback(() =>
    setPreferences(defaultPreferences), []);

  return (
    <AccessibilityContext.Provider value={{
      preferences,
      setFontSize, setLineHeight,
      toggleHighContrast, toggleDarkMode,
      toggleReducedMotion,
      toggleSimplifiedView, toggleWideSpacing,
      toggleDyslexiaFont, toggleLargeCursor, toggleFocusHighlight,
      resetPreferences,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  return ctx;
}
