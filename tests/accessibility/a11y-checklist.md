# Lista de comprobación de accesibilidad — CompraInclusiva

> Esta lista complementa las pruebas automáticas con axe-core.
> La accesibilidad real requiere pruebas manuales con usuarios y lectores de pantalla.

## WCAG 2.2 Nivel AA — Criterios críticos

### 1. Perceptible

| Criterio | Estado | Notas |
|---|---|---|
| 1.1.1 Texto alternativo en imágenes | ✅ Implementado | `alt` descriptivo en ProductCard, ProductDetail; `alt=""` para decorativas |
| 1.3.1 Información y relaciones | ✅ Implementado | HTML semántico, `<table>` para datos, `fieldset/legend` en filtros |
| 1.3.3 Características sensoriales | ✅ Implementado | No se usa color como única forma de transmitir información |
| 1.4.1 Uso del color | ✅ Implementado | Iconos + texto en estados, no solo color |
| 1.4.3 Contraste mínimo (4.5:1 texto) | ✅ Verificado | Paleta diseñada con ratios de contraste verificados |
| 1.4.4 Cambio de tamaño (200%) | ✅ Implementado | Unidades relativas, diseño fluido |
| 1.4.10 Reajuste (320px) | ✅ Implementado | Responsive, sin desplazamiento horizontal |
| 1.4.11 Contraste no textual (3:1) | ✅ Implementado | Bordes de inputs, iconos verificados |
| 1.4.12 Espaciado de texto | ✅ Implementado | Sin overflow con espaciado ampliado; panel accesibilidad |
| 1.4.13 Contenido en hover/focus | 🔄 Verificar manualmente | Tooltips, desplegables |

### 2. Operable

| Criterio | Estado | Notas |
|---|---|---|
| 2.1.1 Teclado | ✅ Implementado | Todos los componentes son navegables por teclado |
| 2.1.2 Sin trampa de teclado | ✅ Implementado | `useFocusTrap` libera foco al cerrar modales |
| 2.4.1 Saltar bloques | ✅ Implementado | Skip links al inicio del DOM |
| 2.4.2 Título de página | 🔄 Pendiente | Añadir títulos dinámicos por página con `<title>` |
| 2.4.3 Orden de foco | ✅ Implementado | Orden lógico del DOM, tabIndex solo cuando necesario |
| 2.4.4 Propósito de enlaces | ✅ Implementado | `aria-label` descriptivos en todos los enlaces |
| 2.4.7 Foco visible | ✅ Implementado | `focus-visible` con anillo azul visible en todos los elementos |
| 2.4.11 Apariencia de foco (WCAG 2.2) | ✅ Implementado | 3px de anillo de foco |
| 2.5.3 Etiqueta en nombre | ✅ Implementado | Texto visible incluido en el nombre accesible |
| 2.5.5 Tamaño del objetivo | ✅ Implementado | `min-h-[44px] min-w-[44px]` en todos los controles |

### 3. Comprensible

| Criterio | Estado | Notas |
|---|---|---|
| 3.1.1 Idioma de la página | ✅ Implementado | `lang="es"` en `<html>` |
| 3.2.2 Entrada de datos | ✅ Implementado | Sin cambios de contexto inesperados |
| 3.3.1 Identificación de errores | ✅ Implementado | Mensajes específicos con `role="alert"` |
| 3.3.2 Instrucciones | ✅ Implementado | `hint` en campos de formulario |
| 3.3.3 Sugerencia de error | ✅ Implementado | Mensajes descriptivos con solución |
| 3.3.4 Prevención de errores | ✅ Implementado | Confirmación antes de eliminar del carrito |

### 4. Robusto

| Criterio | Estado | Notas |
|---|---|---|
| 4.1.1 Análisis sintáctico | ✅ Implementado | HTML válido, IDs únicos |
| 4.1.2 Nombre, función, valor | ✅ Implementado | ARIA solo cuando necesario |
| 4.1.3 Mensajes de estado | ✅ Implementado | `LiveRegion`, `aria-live="polite/assertive"` |

## Pruebas pendientes de ejecución manual

- [ ] Probar toda la aplicación con NVDA + Firefox
- [ ] Probar toda la aplicación con VoiceOver + Safari (macOS/iOS)
- [ ] Probar navegación completa con teclado únicamente
- [ ] Probar con zoom del navegador al 200% y 400%
- [ ] Probar con modo de alto contraste del sistema operativo
- [ ] Probar con Windows High Contrast Mode
- [ ] Ejecutar Lighthouse en todas las páginas principales
- [ ] Ejecutar WAVE en todas las páginas principales
- [ ] Ejecutar axe DevTools en todas las páginas principales
- [ ] Probar con texto al 400% de tamaño

## Herramientas para pruebas automáticas

```bash
# Instalar axe-core para pruebas automáticas
npm install --save-dev @axe-core/react

# En desarrollo, añadir en main.tsx:
if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react')
  axe(React, ReactDOM, 1000)
}
```

## Problemas conocidos / pendientes

| Problema | Prioridad | Acción requerida |
|---|---|---|
| Títulos dinámicos de página | Alta | Implementar `react-helmet` o similar |
| Gestión de historial en SPA | Media | Anunciar cambios de ruta a lectores de pantalla |
| Sesión de checkout - tiempos | Baja | Añadir advertencia antes de expirar sesión |
