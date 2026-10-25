import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// =====================================================
// SEED DE BASE DE DATOS
// Datos de demostración para desarrollo y pruebas.
// Ejecutar con: npm run db:seed (desde /backend)
// =====================================================

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // =====================================================
  // USUARIOS DE DEMOSTRACIÓN
  // =====================================================

  const adminPassword = await bcrypt.hash('Admin1234!', 12);
  const userPassword = await bcrypt.hash('Usuario1234!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@comprainclusiva.es',
      passwordHash: adminPassword,
      name: 'Administrador',
      role: 'admin',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'usuario@demo.es',
      passwordHash: userPassword,
      name: 'Usuario Demo',
      role: 'customer',
    },
  });

  console.log(`✅ Usuarios creados: ${admin.email}, ${demoUser.email}`);

  // =====================================================
  // CATEGORÍAS
  // =====================================================

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electrónica',
        slug: 'electronica',
        description: 'Smartphones, tablets, ordenadores y más',
        imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Ropa',
        slug: 'ropa',
        description: 'Moda para todas las personas',
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hogar',
        slug: 'hogar',
        description: 'Todo para tu hogar',
        imageUrl: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Libros',
        slug: 'libros',
        description: 'Libros para todos los gustos y edades',
        imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Deportes',
        slug: 'deportes',
        description: 'Equipamiento deportivo y ropa de actividad física',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Salud',
        slug: 'salud',
        description: 'Productos de salud, bienestar y cuidado personal',
        imageUrl: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400',
      },
    }),
  ]);

  const [electronica, ropa, hogar, libros] = categories;
  console.log(`✅ ${categories.length} categorías creadas`);

  // =====================================================
  // PRODUCTOS DE DEMOSTRACIÓN
  // =====================================================

  const products = await Promise.all([
    // ELECTRÓNICA
    prisma.product.create({
      data: {
        name: 'Auriculares inalámbricos con cancelación de ruido',
        slug: 'auriculares-inalambricos-cancelacion-ruido',
        description: 'Auriculares Bluetooth 5.0 con cancelación activa de ruido. Batería de 30 horas de duración. Perfectos para trabajar, estudiar o disfrutar de la música sin distracciones. Compatibles con cualquier dispositivo Bluetooth.',
        shortDescription: 'Auriculares Bluetooth con cancelación activa de ruido y 30h de batería.',
        price: 79.99,
        compareAtPrice: 129.99,
        stock: 45,
        categoryId: electronica.id,
        tags: ['auriculares', 'bluetooth', 'inalámbrico', 'cancelación de ruido'],
        featured: true,
        rating: 4.7,
        reviewCount: 324,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
              alt: 'Auriculares inalámbricos negros sobre fondo blanco, mostrando la diadema y los auriculares plegados',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: 'Tablet 10 pulgadas con pantalla anti-reflejos',
        slug: 'tablet-10-pulgadas-pantalla-anti-reflejos',
        description: 'Tablet con pantalla IPS de 10 pulgadas con recubrimiento anti-reflejos, ideal para uso en exteriores. Procesador de 8 núcleos, 4GB RAM y 128GB de almacenamiento. Batería de 7000 mAh.',
        shortDescription: 'Tablet de 10" con pantalla anti-reflejos, 4GB RAM y 128GB.',
        price: 199.99,
        stock: 28,
        categoryId: electronica.id,
        tags: ['tablet', 'android', 'pantalla anti-reflejos'],
        featured: true,
        rating: 4.5,
        reviewCount: 156,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
              alt: 'Tablet con pantalla encendida mostrando la pantalla de inicio, apoyada verticalmente sobre una mesa',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),

    // ROPA
    prisma.product.create({
      data: {
        name: 'Camiseta de algodón orgánico — Varios colores',
        slug: 'camiseta-algodon-organico',
        description: 'Camiseta confeccionada con 100% algodón orgánico certificado. Tejido suave y transpirable, ideal para uso diario. Disponible en varios colores y tallas.',
        shortDescription: 'Camiseta de algodón orgánico, suave y transpirable.',
        price: 24.99,
        stock: 120,
        categoryId: ropa.id,
        tags: ['camiseta', 'algodón orgánico', 'ropa sostenible'],
        featured: true,
        rating: 4.3,
        reviewCount: 89,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
              alt: 'Camiseta blanca de algodón doblada sobre fondo gris claro',
              isPrimary: true,
              order: 0,
            },
          ],
        },
        variants: {
          create: [
            { name: 'Talla', value: 'XS', stock: 20, priceAdjustment: 0 },
            { name: 'Talla', value: 'S',  stock: 30, priceAdjustment: 0 },
            { name: 'Talla', value: 'M',  stock: 40, priceAdjustment: 0 },
            { name: 'Talla', value: 'L',  stock: 30, priceAdjustment: 0 },
            { name: 'Talla', value: 'XL', stock: 0,  priceAdjustment: 0 },
          ],
        },
      },
    }),

    // HOGAR
    prisma.product.create({
      data: {
        name: 'Lámpara de escritorio con regulador de intensidad',
        slug: 'lampara-escritorio-regulador-intensidad',
        description: 'Lámpara LED de escritorio con regulador de intensidad táctil y selección de temperatura de color (luz fría, neutra o cálida). Puerto USB integrado para cargar dispositivos. Perfecta para trabajar, leer o estudiar.',
        shortDescription: 'Lámpara LED regulable con luz fría/cálida y puerto USB.',
        price: 39.95,
        compareAtPrice: 54.95,
        stock: 67,
        categoryId: hogar.id,
        tags: ['lámpara', 'led', 'escritorio', 'regulable'],
        featured: true,
        rating: 4.6,
        reviewCount: 210,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
              alt: 'Lámpara de escritorio negra con brazo articulado sobre un escritorio de madera, encendida con luz cálida',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),

    // LIBROS
    prisma.product.create({
      data: {
        name: 'Diseño para todos: Guía de accesibilidad',
        slug: 'diseno-para-todos-guia-accesibilidad',
        description: 'Una guía práctica sobre diseño universal y accesibilidad web. Aprende a crear productos digitales que funcionen para todas las personas, independientemente de sus capacidades. Con ejemplos reales y ejercicios prácticos.',
        shortDescription: 'Guía práctica de diseño universal y accesibilidad web.',
        price: 28.00,
        stock: 34,
        categoryId: libros.id,
        tags: ['accesibilidad', 'diseño universal', 'UX', 'libros'],
        featured: true,
        rating: 4.9,
        reviewCount: 45,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
              alt: 'Libro con portada azul y blanca sobre una mesa de madera',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: 'Teclado ergonómico con teclas retroiluminadas',
        slug: 'teclado-ergonomico-retroiluminado',
        description: 'Teclado ergonómico de perfil bajo con retroiluminación LED ajustable. Diseño dividido que reduce la tensión en las muñecas. Compatible con Windows, macOS y Linux. Conexión USB tipo C.',
        shortDescription: 'Teclado ergonómico retroiluminado, compatible con todos los sistemas.',
        price: 89.99,
        stock: 22,
        categoryId: electronica.id,
        tags: ['teclado', 'ergonómico', 'retroiluminado', 'accesibilidad'],
        featured: false,
        rating: 4.4,
        reviewCount: 67,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
              alt: 'Teclado ergonómico mecánico negro con retroiluminación azul, visto desde arriba',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: 'Ratón vertical ergonómico',
        slug: 'raton-vertical-ergonomico',
        description: 'Ratón de diseño vertical que mantiene la muñeca en posición natural, reduciendo el riesgo de síndrome del túnel carpiano. 5 botones programables, DPI ajustable. Ideal para uso prolongado.',
        shortDescription: 'Ratón vertical ergonómico que reduce la tensión en la muñeca.',
        price: 45.00,
        stock: 38,
        categoryId: electronica.id,
        tags: ['ratón', 'ergonómico', 'vertical', 'accesibilidad'],
        featured: false,
        rating: 4.6,
        reviewCount: 112,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
              alt: 'Ratón vertical ergonómico negro sobre una alfombrilla gris, vista lateral que muestra el diseño vertical',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: 'Reloj inteligente con pantalla grande',
        slug: 'reloj-inteligente-pantalla-grande',
        description: 'Smartwatch con pantalla AMOLED de 1.8 pulgadas de alta legibilidad. Seguimiento de actividad física, monitoreo de frecuencia cardíaca y SpO2. Resistente al agua IP68. Batería de 7 días.',
        shortDescription: 'Smartwatch con pantalla grande, frecuencia cardíaca y 7 días de batería.',
        price: 129.00,
        compareAtPrice: 179.00,
        stock: 15,
        categoryId: electronica.id,
        tags: ['smartwatch', 'reloj', 'actividad física', 'salud'],
        featured: true,
        rating: 4.2,
        reviewCount: 98,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
              alt: 'Reloj inteligente con correa negra y pantalla mostrando la hora 10:08, sobre fondo blanco',
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ ${products.length} productos creados`);

  // =====================================================
  // PEDIDO DE DEMOSTRACIÓN
  // =====================================================

  const demoAddress = await prisma.address.create({
    data: {
      userId: demoUser.id,
      recipientName: 'Usuario Demo',
      street: 'Calle Mayor 123',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
      zipCode: '28001',
      phone: '+34 600 000 000',
      isDefault: true,
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'CI-DEMO001',
      userId: demoUser.id,
      status: 'delivered',
      paymentStatus: 'paid',
      subtotal: 79.99,
      tax: 16.80,
      shipping: 0,
      total: 96.79,
      shippingAddressId: demoAddress.id,
      items: {
        create: [
          {
            productId: products[0].id,
            productName: products[0].name,
            quantity: 1,
            unitPrice: 79.99,
            subtotal: 79.99,
          },
        ],
      },
    },
  });

  console.log('✅ Pedido de demostración creado');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📋 Credenciales de demostración:');
  console.log('   Admin:   admin@comprainclusiva.es / Admin1234!');
  console.log('   Usuario: usuario@demo.es / Usuario1234!');
}

main()
  .catch(err => {
    console.error('❌ Error en el seed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
