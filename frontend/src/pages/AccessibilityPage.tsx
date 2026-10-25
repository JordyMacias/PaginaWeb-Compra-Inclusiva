import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AccessibilityWidget } from '../components/accessibility/AccessibilityWidget';

// La página /accesibilidad ahora simplemente explica que las opciones
// están en el botón flotante de la esquina inferior izquierda.

export function AccessibilityPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-8 focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        Volver al inicio
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Opciones de accesibilidad
      </h1>

      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        Las opciones de accesibilidad están disponibles en todo momento
        pulsando el botón circular con el símbolo de accesibilidad
        que aparece en la <strong>esquina inferior izquierda</strong> de la pantalla.
      </p>

      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-primary-900 mb-3">
          ¿Qué puedes ajustar?
        </h2>
        <ul className="space-y-2 text-sm text-primary-800">
          {[
            'Alto contraste — fondo negro, texto blanco, máxima legibilidad',
            'Modo oscuro — reduce el brillo para mayor comodidad',
            'Tamaño del texto — Normal, Grande, Muy grande o Enorme',
            'Fuente fácil de leer — ayuda con la dislexia y dificultades de lectura',
            'Espaciado entre letras — más separación para leer mejor',
            'Altura de línea — más espacio entre líneas de texto',
            'Reducir animaciones — desactiva efectos de movimiento',
            'Vista simplificada — solo el contenido esencial, sin decoración',
            'Cursor grande — para verlo mejor en la pantalla',
            'Resaltar foco de teclado — contorno naranja visible al navegar con Tab',
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span aria-hidden="true" className="text-primary-500 mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-1">Nota importante</p>
        <p>
          Estas opciones se guardan automáticamente en tu dispositivo.
          La web también respeta automáticamente las preferencias de tu
          sistema operativo para movimiento reducido y contraste.
          Si usas un lector de pantalla o teclado, la web es totalmente
          compatible sin necesidad de ajustes adicionales.
        </p>
      </div>
    </div>
  );
}
