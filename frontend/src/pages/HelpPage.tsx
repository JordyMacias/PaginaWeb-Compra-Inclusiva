import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  HelpCircle,
  ShoppingCart,
  CreditCard,
  Package,
  RotateCcw,
} from 'lucide-react';
import { cn } from '../utils';

// =====================================================
// PÁGINA DE AYUDA — Centro de ayuda con FAQs
// - Acordeón accesible con aria-expanded/aria-controls
// - Secciones con headings jerárquicos
// - Información de contacto semántica
// =====================================================

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: FaqItem[];
}

const faqSections: FaqSection[] = [
  {
    id: 'comprar',
    title: 'Cómo comprar',
    icon: ShoppingCart,
    items: [
      {
        id: 'como-comprar-1',
        question: '¿Cómo puedo añadir un producto al carrito?',
        answer:
          'Entra en la página del producto que quieres comprar y pulsa el botón "Añadir al carrito". Si el producto tiene opciones como talla o color, selecciónalas primero. El producto aparecerá en tu carrito, al que puedes acceder desde el icono del carrito en la parte superior de la página.',
      },
      {
        id: 'como-comprar-2',
        question: '¿Necesito crear una cuenta para comprar?',
        answer:
          'Puedes añadir productos al carrito sin cuenta, pero para finalizar la compra necesitarás registrarte o iniciar sesión. Crear una cuenta es gratuito y te permite hacer seguimiento de tus pedidos.',
      },
      {
        id: 'como-comprar-3',
        question: '¿Cómo puedo buscar un producto?',
        answer:
          'Usa el buscador que está en la parte superior de la página. Escribe el nombre del producto o una palabra clave y pulsa Intro o el botón de búsqueda. También puedes navegar por categorías haciendo clic en la sección "Navega por categorías" en la página de inicio.',
      },
    ],
  },
  {
    id: 'pago',
    title: 'Pagos',
    icon: CreditCard,
    items: [
      {
        id: 'pago-1',
        question: '¿Qué métodos de pago aceptáis?',
        answer:
          'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) y PayPal. Todos los pagos se procesan de forma segura y nunca guardamos los datos completos de tu tarjeta.',
      },
      {
        id: 'pago-2',
        question: '¿Es seguro comprar en esta tienda?',
        answer:
          'Sí. Usamos conexión cifrada (https) en toda la web y todos los pagos se procesan a través de proveedores certificados. Nunca almacenamos tu número de tarjeta ni tu código de seguridad.',
      },
      {
        id: 'pago-3',
        question: '¿Cuándo se cobra el pago?',
        answer:
          'El cargo se realiza en el momento en que confirmas el pedido. Recibirás un correo de confirmación con el resumen y el número de pedido.',
      },
    ],
  },
  {
    id: 'envio',
    title: 'Envíos',
    icon: Package,
    items: [
      {
        id: 'envio-1',
        question: '¿Cuánto tarda en llegar mi pedido?',
        answer:
          'El envío estándar tarda entre 2 y 5 días laborables. El envío urgente llega en 24-48 horas. Recibirás un correo con el número de seguimiento cuando tu pedido salga del almacén.',
      },
      {
        id: 'envio-2',
        question: '¿El envío es gratuito?',
        answer:
          'Sí, el envío es gratuito en pedidos superiores a 50 €. Para pedidos de menor importe, el coste de envío estándar es de 4,99 €.',
      },
      {
        id: 'envio-3',
        question: '¿Puedo cambiar la dirección de entrega?',
        answer:
          'Puedes cambiar la dirección de entrega antes de confirmar el pedido. Una vez confirmado, entra en "Mis pedidos" e intenta modificarlo. Si el pedido ya está en camino, contacta con nosotros lo antes posible.',
      },
    ],
  },
  {
    id: 'devoluciones',
    title: 'Devoluciones',
    icon: RotateCcw,
    items: [
      {
        id: 'dev-1',
        question: '¿Puedo devolver un producto?',
        answer:
          'Sí. Tienes 30 días desde la fecha de recepción para devolver cualquier producto en buen estado. La devolución es gratuita. Ve a "Mis pedidos", selecciona el pedido y pulsa "Solicitar devolución".',
      },
      {
        id: 'dev-2',
        question: '¿Cuándo recibiré el reembolso?',
        answer:
          'Una vez que recibamos y comprobemos el producto devuelto, procesaremos el reembolso en un plazo de 5-7 días laborables. El dinero se devolverá al método de pago original.',
      },
    ],
  },
];

// Componente de acuerdo individual accesible
function FaqItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  const answerId = `answer-${item.id}`;
  const buttonId = `button-${item.id}`;

  return (
    <div className="border-b border-surface-200 last:border-0">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
          className={cn(
            'w-full flex items-center justify-between gap-4 py-4 px-0',
            'text-left text-base font-medium text-surface-800',
            'hover:text-primary-700 transition-colors',
            'focus-visible:ring-2 focus-visible:ring-primary-600 rounded min-h-[44px]'
          )}
        >
          <span>{item.question}</span>
          {isOpen
            ? <ChevronUp aria-hidden="true" size={18} className="flex-shrink-0 text-primary-600" />
            : <ChevronDown aria-hidden="true" size={18} className="flex-shrink-0 text-surface-400" />
          }
        </button>
      </h3>
      <div
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
      >
        <div className="pb-4 text-sm text-surface-700 leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export function HelpPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggleItem(id: string) {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Encabezado */}
      <div className="text-center mb-12">
        <div
          aria-hidden="true"
          className="mx-auto mb-4 w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center"
        >
          <HelpCircle className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-surface-900 mb-3">
          Centro de ayuda
        </h1>
        <p className="text-lg text-surface-600 max-w-xl mx-auto">
          Encuentra respuesta a tus preguntas o contacta con nuestro equipo de
          atención al cliente.
        </p>
      </div>

      {/* Secciones de FAQs */}
      <div className="space-y-8">
        {faqSections.map(section => (
          <section
            key={section.id}
            aria-labelledby={`section-${section.id}`}
            className="bg-white rounded-2xl border border-surface-200 p-6"
          >
            <h2
              id={`section-${section.id}`}
              className="flex items-center gap-2.5 text-xl font-bold text-surface-900 mb-4"
            >
              <section.icon
                aria-hidden="true"
                size={22}
                className="text-primary-600"
              />
              {section.title}
            </h2>

            <div>
              {section.items.map(item => (
                <FaqItem
                  key={item.id}
                  item={item}
                  isOpen={openItems.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contacto */}
      <section
        aria-labelledby="contact-heading"
        className="mt-12 bg-primary-50 rounded-2xl p-8 text-center border border-primary-200"
      >
        <h2
          id="contact-heading"
          className="text-2xl font-bold text-surface-900 mb-2"
        >
          ¿No encontraste lo que buscabas?
        </h2>
        <p className="text-surface-600 mb-6">
          Nuestro equipo está aquí para ayudarte. Puedes contactarnos por correo
          o teléfono.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="mailto:ayuda@comprainclusiva.es"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-lg
                       border-2 border-primary-600 text-primary-700 font-semibold
                       hover:bg-primary-50 transition-colors
                       focus-visible:ring-2 focus-visible:ring-primary-600 min-h-[44px]"
          >
            <Mail aria-hidden="true" size={18} />
            ayuda@comprainclusiva.es
          </a>
          <a
            href="tel:+34900000000"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600
                       rounded-lg text-white font-semibold hover:bg-primary-700 transition-colors
                       focus-visible:ring-2 focus-visible:ring-white min-h-[44px]"
          >
            <Phone aria-hidden="true" size={18} />
            900 000 000 (gratuito)
          </a>
        </div>
        <p className="mt-4 text-sm text-surface-500">
          Horario de atención: lunes a viernes, de 9:00 a 18:00 h.
        </p>
      </section>
    </div>
  );
}
