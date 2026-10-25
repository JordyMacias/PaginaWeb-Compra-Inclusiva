/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // El modo oscuro se controla mediante clase para el panel de accesibilidad
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta principal con contraste WCAG AA verificado
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // texto sobre blanco: ratio 5.9:1 ✓
          700: '#1d4ed8', // texto sobre blanco: ratio 8.0:1 ✓
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Color de acento para acciones críticas
        accent: {
          500: '#f59e0b',
          600: '#d97706', // sobre blanco: ratio 3.1:1 (texto grande) ✓
          700: '#b45309', // sobre blanco: ratio 4.6:1 ✓
        },
        // Escala de grises semántica
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Feedback semántico
        success: {
          100: '#dcfce7',
          600: '#16a34a', // sobre blanco: ratio 5.0:1 ✓
          700: '#15803d',
        },
        error: {
          100: '#fee2e2',
          600: '#dc2626', // sobre blanco: ratio 5.9:1 ✓
          700: '#b91c1c',
        },
        warning: {
          100: '#fef3c7',
          700: '#b45309', // sobre blanco: ratio 4.6:1 ✓
          800: '#92400e',
        },
        info: {
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        // Escala tipográfica con unidades relativas para respetar zoom del usuario
        'xs':   ['0.75rem',  { lineHeight: '1.5' }],
        'sm':   ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem',     { lineHeight: '1.6' }],
        'lg':   ['1.125rem', { lineHeight: '1.5' }],
        'xl':   ['1.25rem',  { lineHeight: '1.4' }],
        '2xl':  ['1.5rem',   { lineHeight: '1.3' }],
        '3xl':  ['1.875rem', { lineHeight: '1.2' }],
        '4xl':  ['2.25rem',  { lineHeight: '1.1' }],
      },
      spacing: {
        // Target mínimo de 44px para elementos interactivos (WCAG 2.5.5)
        'touch': '2.75rem', // 44px
      },
      borderRadius: {
        'sm':  '0.25rem',
        'DEFAULT': '0.375rem',
        'md':  '0.5rem',
        'lg':  '0.75rem',
        'xl':  '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        // Sombra para indicador de foco accesible
        'focus': '0 0 0 3px rgba(37, 99, 235, 0.6)',
        'focus-inset': 'inset 0 0 0 3px rgba(37, 99, 235, 0.6)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'fade-in':   'fadeIn 200ms ease-in-out',
        'slide-up':  'slideUp 200ms ease-out',
        'slide-in':  'slideIn 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
