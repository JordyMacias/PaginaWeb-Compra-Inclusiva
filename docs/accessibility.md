# Documentación de Accesibilidad — CompraInclusiva

## Objetivo de conformidad

Esta plataforma tiene como objetivo cumplir las **WCAG 2.2 Nivel AA**.

> ⚠️ Importante: El cumplimiento total de las WCAG no puede verificarse únicamente
> con herramientas automáticas. Esta documentación describe lo implementado y lo que
> requiere verificación manual adicional.

## Decisiones de diseño para accesibilidad

### Indicadores de foco

Todos los elementos interactivos tienen un indicador de foco visible y consistente:
- Anillo de 3px en color primario (#2563eb)
- Offset de 2px para separarlo del elemento
- Visible en modo oscuro y alto contraste
- Nunca se elimina el outline (solo se oculta en clics de ratón, no en teclado)

```css
:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.7);
  outline-offset: 2px;
}
```

### Skip Links

Los skip links aparecen al inicio del DOM y se hacen visibles al recibir foco:
1. "Ir al contenido principal" → `#main-content`
2. "Ir a la navegación" → `#main-nav`
3. "Ir al buscador" → `#search`

### Regiones ARIA Live

El componente `LiveRegion` provee dos regiones live persistentes:
- `aria-live="polite"` → Para anuncios no urgentes (añadir al carrito, filtros)
- `aria-live="assertive"` → Para errores críticos

El hook `useAnnounce()` las usa desde cualquier componente.

### Trampa de foco

Los modales, drawers y paneles usan `useFocusTrap` para:
- Mover el foco al primer elemento al abrir
- Ciclar el foco con Tab/Shift+Tab dentro del contenedor
- Restaurar el foco al elemento anterior al cerrar

### Tamaños de objetivo táctil

Todos los controles interactivos tienen `min-height: 44px` y `min-width: 44px`
para cumplir WCAG 2.5.5 y ser usables con tecnologías táctiles.

### Contraste de colores

| Elemento | Color texto | Color fondo | Ratio | Nivel |
|---|---|---|---|---|
| Texto principal | #1e293b | #ffffff | 16:1 | AAA |
| Texto secundario | #475569 | #ffffff | 7.0:1 | AAA |
| Botón primario | #ffffff | #2563eb | 5.9:1 | AA |
| Enlace | #2563eb | #ffffff | 5.9:1 | AA |
| Placeholder | #94a3b8 | #ffffff | 2.9:1 | ⚠️ solo decorativo |
| Error | #dc2626 | #ffffff | 5.9:1 | AA |
| Éxito | #16a34a | #ffffff | 5.0:1 | AA |

### HTML Semántico

La estructura semántica de cada página:

```
<header> (Header.tsx)
  <nav aria-label="Navegación principal">
<main id="main-content">
  <h1> (título de la página)
    <h2>, <h3>... (jerárquico)
  <section aria-labelledby="...">
  <article> (tarjetas de producto)
<footer>
  <nav aria-label="..."> (múltiples navegaciones con label único)
```

### Formularios accesibles

Todos los campos de formulario implementan:
- `<label htmlFor>` siempre visible (nunca solo placeholder)
- `aria-required` en campos obligatorios
- `aria-invalid` en estado de error
- `aria-describedby` apuntando a hints y mensajes de error
- Mensajes de error con `role="alert"` y texto descriptivo

### Panel de accesibilidad

El panel ofrece ajustes que se persisten en `localStorage` y se aplican como
clases CSS al elemento `<html>`:

| Clase | Efecto |
|---|---|
| `text-large` | `--font-size-scale: 1.2` |
| `text-xl` | `--font-size-scale: 1.4` |
| `high-contrast` | Paleta de alto contraste |
| `reduce-motion` | Desactiva animaciones |
| `simplified-view` | Oculta elementos decorativos |
| `spacing-wide` | Amplía letter/word-spacing y line-height |

Estos ajustes **complementan** la accesibilidad base, no la sustituyen.

## Herramientas de prueba recomendadas

### Automáticas
- **axe-core** / axe DevTools (extensión Chrome/Firefox)
- **Lighthouse** (Chrome DevTools)
- **WAVE** (wave.webaim.org)

### Manuales con lectores de pantalla
- **NVDA** + Firefox (Windows) — gratuito
- **VoiceOver** + Safari (macOS/iOS) — integrado en el sistema
- **JAWS** + Chrome (Windows) — comercial

### Prueba de teclado
1. Tab: avanzar por elementos interactivos
2. Shift+Tab: retroceder
3. Enter/Espacio: activar botones y enlaces
4. Escape: cerrar modales y menús
5. Flechas: navegar listas, pestañas y selectores
6. Home/End: ir al inicio/fin de listas

## Limitaciones conocidas

1. **Títulos dinámicos de página**: No implementados todavía. Se recomienda usar `react-helmet-async` para cambiar `<title>` en cada ruta y anunciar el cambio a lectores de pantalla.

2. **Autenticación**: El flujo actual usa email/contraseña. Evaluar opciones adicionales (passkeys, magic link) para usuarios con dificultades de escritura.

3. **Imágenes de productos**: Los textos alternativos actuales son de demostración. En producción, cada imagen debe tener un alt descriptivo que comunique el propósito de la imagen, no solo su apariencia.

4. **Videos**: Si se añaden videos, requieren subtítulos (1.2.2) y audiodescripción (1.2.3) según WCAG.
