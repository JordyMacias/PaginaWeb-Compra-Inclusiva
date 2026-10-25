import type { Product, Category } from '../types';

// =====================================================
// DATOS MOCK — Productos de demostración
// Se usan cuando el backend no está disponible.
// Para conectar el backend real, cambia USE_MOCK_DATA
// a false en src/services/products.ts
// =====================================================

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electrónica',
    slug: 'electronica',
    description: 'Smartphones, tablets, ordenadores y más',
    _count: { products: 4 },
  },
  {
    id: 'cat-2',
    name: 'Ropa',
    slug: 'ropa',
    description: 'Moda para todas las personas',
    _count: { products: 2 },
  },
  {
    id: 'cat-3',
    name: 'Hogar',
    slug: 'hogar',
    description: 'Todo para tu hogar',
    _count: { products: 2 },
  },
  {
    id: 'cat-4',
    name: 'Libros',
    slug: 'libros',
    description: 'Libros para todos los gustos y edades',
    _count: { products: 2 },
  },
  {
    id: 'cat-5',
    name: 'Deportes',
    slug: 'deportes',
    description: 'Equipamiento deportivo',
    _count: { products: 1 },
  },
  {
    id: 'cat-6',
    name: 'Salud',
    slug: 'salud',
    description: 'Salud y bienestar',
    _count: { products: 1 },
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Auriculares inalámbricos con cancelación de ruido',
    slug: 'auriculares-inalambricos-cancelacion-ruido',
    description:
      'Auriculares Bluetooth 5.0 con cancelación activa de ruido. Batería de 30 horas de duración. Perfectos para trabajar, estudiar o disfrutar de la música sin distracciones. Compatibles con cualquier dispositivo Bluetooth. Incluye estuche de carga, cable USB-C y adaptador de avión.',
    shortDescription:
      'Auriculares Bluetooth con cancelación activa de ruido y 30h de batería.',
    price: 79.99,
    compareAtPrice: 129.99,
    stock: 45,
    categoryId: 'cat-1',
    category: mockCategories[0],
    tags: ['auriculares', 'bluetooth', 'cancelación de ruido'],
    featured: true,
    rating: 4.7,
    reviewCount: 324,
    variants: [],
    images: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        alt: 'Auriculares inalámbricos negros sobre fondo blanco, con diadema plegada y almohadillas acolchadas',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Tablet 10 pulgadas con pantalla anti-reflejos',
    slug: 'tablet-10-pulgadas-pantalla-anti-reflejos',
    description:
      'Tablet con pantalla IPS de 10 pulgadas con recubrimiento anti-reflejos, ideal para uso en exteriores o con luz intensa. Procesador de 8 núcleos, 4GB RAM y 128GB de almacenamiento ampliable. Batería de 7000 mAh con hasta 12 horas de uso. Incluye stylus y funda protectora.',
    shortDescription: 'Tablet de 10" anti-reflejos, 4GB RAM, 128GB, stylus incluido.',
    price: 199.99,
    stock: 28,
    categoryId: 'cat-1',
    category: mockCategories[0],
    tags: ['tablet', 'android', 'anti-reflejos'],
    featured: true,
    rating: 4.5,
    reviewCount: 156,
    variants: [],
    images: [
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
        alt: 'Tablet con pantalla encendida mostrando aplicaciones, apoyada verticalmente con funda azul',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Camiseta de algodón orgánico',
    slug: 'camiseta-algodon-organico',
    description:
      'Camiseta confeccionada con 100% algodón orgánico certificado GOTS. Tejido suave y transpirable, ideal para uso diario. Lavable a máquina. Disponible en tallas XS a XL. Fabricada bajo condiciones laborales justas.',
    shortDescription: 'Camiseta de algodón orgánico certificado, suave y transpirable.',
    price: 24.99,
    stock: 120,
    categoryId: 'cat-2',
    category: mockCategories[1],
    tags: ['camiseta', 'algodón orgánico', 'sostenible'],
    featured: true,
    rating: 4.3,
    reviewCount: 89,
    variants: [
      { id: 'v-1', name: 'Talla', value: 'XS', stock: 20, priceAdjustment: 0 },
      { id: 'v-2', name: 'Talla', value: 'S',  stock: 30, priceAdjustment: 0 },
      { id: 'v-3', name: 'Talla', value: 'M',  stock: 40, priceAdjustment: 0 },
      { id: 'v-4', name: 'Talla', value: 'L',  stock: 30, priceAdjustment: 0 },
      { id: 'v-5', name: 'Talla', value: 'XL', stock: 0,  priceAdjustment: 0 },
    ],
    images: [
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
        alt: 'Camiseta blanca de algodón doblada sobre superficie gris, mostrando su textura suave',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Lámpara de escritorio con regulador de intensidad',
    slug: 'lampara-escritorio-regulador-intensidad',
    description:
      'Lámpara LED de escritorio con regulador de intensidad táctil y selección de temperatura de color (luz fría 6000K, neutra 4000K o cálida 3000K). Puerto USB-A integrado para cargar dispositivos. Brazo articulado ajustable. Consumo de solo 12W. Perfecta para trabajar, leer o estudiar.',
    shortDescription: 'Lámpara LED regulable con 3 temperaturas de luz y puerto USB.',
    price: 39.95,
    compareAtPrice: 54.95,
    stock: 67,
    categoryId: 'cat-3',
    category: mockCategories[2],
    tags: ['lámpara', 'led', 'escritorio', 'regulable'],
    featured: true,
    rating: 4.6,
    reviewCount: 210,
    variants: [],
    images: [
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop',
        alt: 'Lámpara de escritorio negra con brazo articulado iluminando un libro sobre escritorio de madera',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: 'prod-5',
    name: 'Diseño para todos: Guía de accesibilidad web',
    slug: 'diseno-para-todos-guia-accesibilidad',
    description:
      'Una guía práctica y completa sobre diseño universal y accesibilidad web. Aprende a crear productos digitales que funcionen para todas las personas, con WCAG 2.2 explicado de forma clara, ejemplos de código reales y ejercicios prácticos. Ideal para diseñadores y desarrolladores.',
    shortDescription: 'Guía práctica de diseño universal y accesibilidad web con WCAG 2.2.',
    price: 28.0,
    stock: 34,
    categoryId: 'cat-4',
    category: mockCategories[3],
    tags: ['accesibilidad', 'diseño universal', 'UX', 'WCAG'],
    featured: true,
    rating: 4.9,
    reviewCount: 45,
    variants: [],
    images: [
      {
        id: 'img-5',
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
        alt: 'Libro con portada azul y blanca sobre mesa de madera, junto a un ordenador portátil',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Teclado ergonómico con teclas retroiluminadas',
    slug: 'teclado-ergonomico-retroiluminado',
    description:
      'Teclado ergonómico de perfil bajo con retroiluminación LED ajustable (7 colores). Diseño dividido en dos mitades que reduce la tensión en las muñecas y hombros. Compatible con Windows, macOS y Linux. Conexión USB tipo C y Bluetooth 5.0. Memoria para 3 dispositivos.',
    shortDescription: 'Teclado ergonómico partido, retroiluminado, USB-C y Bluetooth.',
    price: 89.99,
    stock: 22,
    categoryId: 'cat-1',
    category: mockCategories[0],
    tags: ['teclado', 'ergonómico', 'retroiluminado', 'accesibilidad'],
    featured: false,
    rating: 4.4,
    reviewCount: 67,
    variants: [],
    images: [
      {
        id: 'img-6',
        url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
        alt: 'Teclado ergonómico mecánico negro con retroiluminación azul, dividido en dos mitades, visto desde arriba',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Ratón vertical ergonómico inalámbrico',
    slug: 'raton-vertical-ergonomico',
    description:
      'Ratón de diseño vertical que mantiene la muñeca en posición natural (postura de apretón de mano), reduciendo significativamente el riesgo de síndrome del túnel carpiano y tendinitis. 5 botones programables, DPI ajustable en 4 niveles (800-3200). Conexión inalámbrica 2.4GHz, batería de 6 meses.',
    shortDescription: 'Ratón vertical inalámbrico, reduce tensión en muñeca, 6 meses de batería.',
    price: 45.0,
    stock: 38,
    categoryId: 'cat-1',
    category: mockCategories[0],
    tags: ['ratón', 'ergonómico', 'vertical', 'inalámbrico'],
    featured: false,
    rating: 4.6,
    reviewCount: 112,
    variants: [],
    images: [
      {
        id: 'img-7',
        url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
        alt: 'Ratón vertical ergonómico negro sobre alfombrilla gris, mostrando su diseño vertical que mantiene la muñeca erguida',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Reloj inteligente con pantalla grande AMOLED',
    slug: 'reloj-inteligente-pantalla-grande',
    description:
      'Smartwatch con pantalla AMOLED de 1.8 pulgadas de alta legibilidad incluso bajo luz solar directa. Seguimiento completo de actividad física (pasos, calorías, distancia), monitoreo continuo de frecuencia cardíaca y SpO2. Resistente al agua IP68. Batería de 7 días. Notificaciones y control de música.',
    shortDescription: 'Smartwatch AMOLED 1.8", frecuencia cardíaca, SpO2, IP68, 7 días batería.',
    price: 129.0,
    compareAtPrice: 179.0,
    stock: 15,
    categoryId: 'cat-1',
    category: mockCategories[0],
    tags: ['smartwatch', 'reloj', 'salud', 'actividad física'],
    featured: true,
    rating: 4.2,
    reviewCount: 98,
    variants: [
      { id: 'v-r1', name: 'Color', value: 'Negro',  stock: 8,  priceAdjustment: 0 },
      { id: 'v-r2', name: 'Color', value: 'Plata',  stock: 5,  priceAdjustment: 0 },
      { id: 'v-r3', name: 'Color', value: 'Dorado', stock: 2,  priceAdjustment: 10 },
    ],
    images: [
      {
        id: 'img-8',
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        alt: 'Reloj inteligente con correa negra mostrando la hora y datos de frecuencia cardíaca en pantalla circular',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Zapatillas de running con suela extra amortiguada',
    slug: 'zapatillas-running-amortiguacion',
    description:
      'Zapatillas de running con tecnología de amortiguación reactiva que devuelve energía en cada zancada. Parte superior de malla transpirable. Suela de goma con agarre antideslizante. Ligeras (solo 280g). Disponibles en varias tallas. Diseñadas para corredores de todos los niveles.',
    shortDescription: 'Zapatillas running ligeras (280g) con amortiguación reactiva y malla transpirable.',
    price: 89.95,
    compareAtPrice: 119.95,
    stock: 50,
    categoryId: 'cat-5',
    category: mockCategories[4],
    tags: ['zapatillas', 'running', 'deporte', 'amortiguación'],
    featured: false,
    rating: 4.5,
    reviewCount: 203,
    variants: [
      { id: 'v-z1', name: 'Talla', value: '38', stock: 8,  priceAdjustment: 0 },
      { id: 'v-z2', name: 'Talla', value: '39', stock: 10, priceAdjustment: 0 },
      { id: 'v-z3', name: 'Talla', value: '40', stock: 12, priceAdjustment: 0 },
      { id: 'v-z4', name: 'Talla', value: '41', stock: 10, priceAdjustment: 0 },
      { id: 'v-z5', name: 'Talla', value: '42', stock: 8,  priceAdjustment: 0 },
      { id: 'v-z6', name: 'Talla', value: '43', stock: 2,  priceAdjustment: 0 },
      { id: 'v-z7', name: 'Talla', value: '44', stock: 0,  priceAdjustment: 0 },
    ],
    images: [
      {
        id: 'img-9',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
        alt: 'Zapatillas de running rojas y negras sobre fondo blanco, mostrando la suela amortiguada y la malla transpirable',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z',
  },
  {
    id: 'prod-10',
    name: 'Mochila ergonómica para portátil 15"',
    slug: 'mochila-ergonomica-portatil-15',
    description:
      'Mochila con compartimento acolchado para portátiles de hasta 15.6 pulgadas. Espalda ergonómica con espuma viscoelástica y cinturón lumbar ajustable. Puerto USB externo para cargar mientras caminas. Organizador interno con múltiples bolsillos. Tejido resistente al agua.',
    shortDescription: 'Mochila ergonómica con espalda viscoelástica, USB externo y organización completa.',
    price: 59.99,
    stock: 33,
    categoryId: 'cat-3',
    category: mockCategories[2],
    tags: ['mochila', 'ergonómica', 'portátil', 'viaje'],
    featured: false,
    rating: 4.4,
    reviewCount: 78,
    variants: [
      { id: 'v-m1', name: 'Color', value: 'Negro', stock: 20, priceAdjustment: 0 },
      { id: 'v-m2', name: 'Color', value: 'Azul',  stock: 13, priceAdjustment: 0 },
    ],
    images: [
      {
        id: 'img-10',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
        alt: 'Mochila negra con múltiples compartimentos y sistema de espalda ergonómica con espuma, vista frontal',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'prod-11',
    name: 'Libro: Aprende a programar desde cero',
    slug: 'libro-aprende-programar-desde-cero',
    description:
      'Guía completa para aprender a programar sin conocimientos previos. Escrita en lenguaje claro y accesible, con ejercicios prácticos y proyectos reales. Cubre HTML, CSS, JavaScript y Python con ejemplos del mundo real. Incluye acceso a recursos digitales adicionales.',
    shortDescription: 'Programación desde cero para principiantes, con ejercicios y proyectos reales.',
    price: 32.5,
    stock: 60,
    categoryId: 'cat-4',
    category: mockCategories[3],
    tags: ['programación', 'aprender', 'principiantes', 'libros'],
    featured: false,
    rating: 4.7,
    reviewCount: 134,
    variants: [],
    images: [
      {
        id: 'img-11',
        url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=600&fit=crop',
        alt: 'Libro con portada colorida mostrando código de programación, apoyado en una estantería',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z',
  },
  {
    id: 'prod-12',
    name: 'Báscula digital de cocina con pantalla grande',
    slug: 'bascula-digital-cocina-pantalla-grande',
    description:
      'Báscula de cocina de alta precisión (0.1g a 5kg) con pantalla LCD grande de alta legibilidad. Función tara para medir ingredientes acumulativos. Conversión entre unidades (g, oz, lb, ml). Superficie antideslizante. Apagado automático. Incluye 2 pilas AAA.',
    shortDescription: 'Báscula de cocina con pantalla grande, alta precisión y función tara.',
    price: 19.99,
    stock: 80,
    categoryId: 'cat-3',
    category: mockCategories[2],
    tags: ['báscula', 'cocina', 'precisión', 'hogar'],
    featured: false,
    rating: 4.3,
    reviewCount: 256,
    variants: [],
    images: [
      {
        id: 'img-12',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
        alt: 'Báscula digital de cocina blanca con pantalla LCD negra mostrando una medición en gramos',
        isPrimary: true,
        order: 0,
      },
    ],
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
];

// Función auxiliar para filtrar y paginar los mock products
export function filterMockProducts(filters: {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}) {
  let results = [...mockProducts];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.category.name.toLowerCase().includes(q)
    );
  }

  if (filters.categoryId) {
    results = results.filter(p => p.categoryId === filters.categoryId);
  }

  if (filters.minPrice !== undefined) {
    results = results.filter(p => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter(p => p.price <= filters.maxPrice!);
  }

  if (filters.inStock) {
    results = results.filter(p => p.stock > 0);
  }

  if (filters.featured) {
    results = results.filter(p => p.featured);
  }

  // Ordenamiento
  switch (filters.sortBy) {
    case 'name':
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'price_asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    default:
      // Más recientes primero (por defecto)
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = results.slice(start, start + pageSize);

  return {
    data,
    meta: { total, page, pageSize, totalPages },
  };
}
