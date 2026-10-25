# CompraInclusiva

Plataforma de comercio electrónico inclusiva y accesible, construida con React, Node.js y PostgreSQL. Diseñada para que cualquier persona pueda comprar con facilidad, independientemente de su edad, experiencia tecnológica o discapacidad.

---

## Características

### Tienda
- Catálogo de productos con búsqueda, filtros y ordenamiento
- Detalle de producto con galería de imágenes y selector de variantes
- Carrito de compras persistente (localStorage + cuenta)
- Proceso de registro e inicio de sesión con JWT
- Perfil de usuario: editar datos, cambiar contraseña, historial de pedidos

### Panel de administración (`/admin`)
- Dashboard con estadísticas en tiempo real (ingresos, pedidos, usuarios, stock)
- CRUD completo de productos: crear, editar, eliminar
- Gestión de pedidos: ver todos los pedidos y cambiar su estado
- Solo accesible con cuenta de rol `admin`

### Accesibilidad (WCAG 2.2 AA)
- Widget flotante en la esquina inferior izquierda con 10 opciones configurables:
  - Alto contraste (fondo negro, texto blanco)
  - Modo oscuro
  - Tamaño de texto (Normal / Grande / Muy grande / Enorme)
  - Fuente fácil de leer (ayuda con dislexia)
  - Espaciado entre letras
  - Altura de línea
  - Reducir animaciones
  - Vista simplificada (solo contenido esencial)
  - Cursor grande
  - Resaltar foco de teclado
- Navegación completa por teclado sin trampas de foco
- Skip links al contenido principal
- Regiones ARIA live para anuncios a lectores de pantalla
- Todos los controles con target mínimo de 44×44 px
- Contraste verificado (mínimo 4.5:1 en texto normal)

---

## Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + TypeScript | 18 |
| Build | Vite | 8 |
| Estilos | Tailwind CSS | 3 |
| Iconos | Lucide React | — |
| Formularios | React Hook Form + Zod | — |
| Estado global | Zustand | — |
| Backend | Node.js + Express | 24 / 5 |
| ORM | Prisma | 5.22 |
| Base de datos | PostgreSQL | 17 |
| Auth | JSON Web Tokens + bcryptjs | — |
| Tests | Vitest + React Testing Library | — |

---

## Requisitos previos

- **Node.js** 18 o superior (`node --version`)
- **npm** 9 o superior
- **PostgreSQL** 14 o superior en ejecución local

---

## Instalación y puesta en marcha

### 1. Clonar y entrar al proyecto

```bash
git clone https://github.com/JordyMacias/PaginaWeb-Compra-Inclusiva
cd CompraInclusiva
```

### 2. Crear el archivo `.env`

Copia el archivo de ejemplo y edítalo con tu configuración:

```bash
cp .env.example .env
```

Contenido mínimo necesario:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/comprainclusiva"
JWT_SECRET="cambia-esto-por-un-secreto-seguro-de-al-menos-32-caracteres"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

### 3. Crear la base de datos

```bash
# En PowerShell (Windows)
$env:PGPASSWORD = "TU_CONTRASEÑA"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE comprainclusiva;"
```

### 4. Instalar dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 5. Generar el cliente Prisma y crear las tablas

```bash
# Desde /backend
node_modules/.bin/prisma generate
node_modules/.bin/prisma migrate dev --name inicio
```

### 6. Cargar datos de demostración

```bash
# Desde /backend
node_modules/.bin/tsx seed.ts
```

Esto inserta en la base de datos:
- 2 usuarios (admin y demo)
- 6 categorías
- 8 productos con imágenes
- 1 pedido de ejemplo

### 7. Iniciar en desarrollo

Abre **dos terminales**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5174
```

---

## Credenciales de demostración

> Solo disponibles después de ejecutar el seed del paso 6.

| Rol | Correo | Contraseña | Acceso |
|---|---|---|---|
| Administrador | admin@comprainclusiva.es | Admin1234! | `/admin` |
| Cliente | usuario@demo.es | Usuario1234! | Tienda |

⚠️ Cambia estas contraseñas antes de cualquier despliegue a producción.

---

## Estructura del proyecto

```
CompraInclusiva/
├── .env                        ← Variables de entorno (no versionar)
├── .env.example                ← Plantilla de variables de entorno
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── accessibility/  ← Widget flotante de accesibilidad
│       │   ├── cart/           ← Carrito y resumen de pedido
│       │   ├── common/         ← Button, Input, Modal, Alert, Spinner...
│       │   ├── layout/         ← Header, Footer, SkipLinks, Layout
│       │   └── products/       ← ProductCard, ProductGrid, ProductFilters
│       ├── context/            ← AuthContext, CartContext, AccessibilityContext
│       ├── data/               ← Datos mock (fallback sin backend)
│       ├── hooks/              ← useAnnounce, useFocusTrap, useProducts...
│       ├── pages/
│       │   ├── admin/          ← Dashboard, Productos, Pedidos (solo admin)
│       │   ├── HomePage.tsx
│       │   ├── CatalogPage.tsx
│       │   ├── ProductDetailPage.tsx
│       │   ├── CartPage.tsx
│       │   ├── ProfilePage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── HelpPage.tsx
│       │   └── AccessibilityPage.tsx
│       ├── services/           ← api.ts, auth.ts, products.ts, admin.ts
│       ├── styles/             ← globals.css (variables, modos, accesibilidad)
│       └── types/              ← Tipos TypeScript centrales
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       ← Esquema de base de datos
│   ├── seed.ts                 ← Script de datos de demostración
│   └── src/
│       ├── controllers/        ← auth, products, orders, admin
│       ├── lib/                ← Instancia singleton de Prisma
│       ├── middlewares/        ← auth (JWT), errorHandler, validate
│       ├── routes/             ← auth, products, orders, admin
│       └── utils/              ← slug.ts
├── database/
│   └── seed.ts                 ← Versión original del seed (referencia)
├── docs/
│   ├── accessibility.md        ← Documentación WCAG y decisiones de diseño
│   └── setup-database.md       ← Guía para recuperar contraseña de PostgreSQL
└── tests/
    ├── unit/                   ← Tests unitarios (Vitest)
    └── accessibility/          ← Lista de comprobación WCAG 2.2
```

---

## API REST

### Autenticación
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Crear cuenta nueva | — |
| POST | `/api/auth/login` | Iniciar sesión | — |
| GET | `/api/auth/me` | Obtener perfil del usuario | JWT |
| POST | `/api/auth/password-reset/request` | Solicitar reseteo de contraseña | — |

### Catálogo
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/products` | Listar productos (filtros, búsqueda, paginación) | — |
| GET | `/api/products/:slug` | Detalle de un producto | — |
| GET | `/api/categories` | Listar categorías | — |

### Pedidos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/orders` | Mis pedidos | JWT |
| GET | `/api/orders/:id` | Detalle de un pedido | JWT |
| POST | `/api/orders` | Crear pedido | JWT |
| PATCH | `/api/orders/:id/cancel` | Cancelar pedido | JWT |

### Administración (solo rol admin)
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/admin/stats` | Estadísticas del dashboard | JWT + Admin |
| GET | `/api/admin/products` | Listar todos los productos | JWT + Admin |
| POST | `/api/admin/products` | Crear producto | JWT + Admin |
| PUT | `/api/admin/products/:id` | Editar producto | JWT + Admin |
| DELETE | `/api/admin/products/:id` | Eliminar producto | JWT + Admin |
| GET | `/api/admin/orders` | Listar todos los pedidos | JWT + Admin |
| PATCH | `/api/admin/orders/:id/status` | Cambiar estado de un pedido | JWT + Admin |

---

## Pruebas

```bash
cd frontend

# Ejecutar tests unitarios
npm run test

# Tests con informe de cobertura
npm run test:coverage

# Verificar tipos TypeScript
npm run type-check
```

---

## Modo de datos mock

El proyecto incluye datos mock en `frontend/src/data/` que permiten usar la tienda sin backend. Esto se controla con una sola variable en `frontend/src/services/products.ts`:

```typescript
// true  → usa datos locales (sin backend ni base de datos)
// false → usa el backend real con PostgreSQL
export const USE_MOCK_DATA = false;
```

---

## Seguridad implementada

- Contraseñas hasheadas con **bcryptjs** (12 rondas de salt)
- Autenticación stateless con **JWT** firmado
- Rate limiting en endpoints sensibles (login, registro: 10 req/15min)
- Headers de seguridad con **Helmet**
- CORS restringido al origen del frontend
- Validación de entradas en cliente (Zod) y servidor (express-validator)
- Autorización por rol en el backend para todas las rutas admin
- Variables sensibles en `.env` (nunca versionadas)

---

## Preparación para producción

Antes de desplegar a un entorno real, revisar:

- [ ] Cambiar `JWT_SECRET` por un valor seguro de al menos 32 caracteres
- [ ] Cambiar las contraseñas de las cuentas de demostración
- [ ] Configurar `FRONTEND_URL` con el dominio real
- [ ] Habilitar HTTPS (SSL/TLS)
- [ ] Configurar un servicio de correo para recuperación de contraseña
- [ ] Integrar pasarela de pago real (Stripe u otro) — el actual es simulado
- [ ] Ejecutar `npm audit` y corregir vulnerabilidades
- [ ] Auditoría con Lighthouse en todas las páginas principales
- [ ] Pruebas manuales con NVDA y VoiceOver

---

## Licencia

MIT
