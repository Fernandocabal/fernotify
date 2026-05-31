---
title: "API — Modales"
description: "Referencia completa de la API de modales de FerNotify."
---

# API — Modales (`notify`)

## Métodos abreviados

| Método | Descripción |
|--------|-------------|
| `notify.success(msg, title?, opts?)` | Modal de éxito (verde) |
| `notify.error(msg, title?, opts?)` | Modal de error (rojo) |
| `notify.warning(msg, title?, opts?)` | Modal de advertencia (amarillo) |
| `notify.info(msg, title?, opts?)` | Modal informativo (azul) |
| `notify.question(msg, title?, opts?)` | Modal de pregunta (morado) |

Todos retornan `Promise<void>` que resuelve cuando el modal se cierra.

```javascript
await notify.success('¡Usuario creado!', 'Éxito');
// continúa aquí después de que el usuario cierre el modal
```

---

## `notify.show(options)`

Método principal que acepta todas las opciones.

```typescript
notify.show(options: NotificationOptions): Promise<void>
```

### `NotificationOptions`

| Propiedad | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info' \| 'question'` | `'info'` | Tipo de notificación |
| `title` | `string` | — | Título del modal |
| `message` | `string` | — | Mensaje principal |
| `buttonText` | `string` | `'Aceptar'` | Texto del botón principal |
| `buttons` | `ButtonOptions[]` | — | Múltiples botones personalizados |
| `showCloseButton` | `boolean` | `true` | Muestra el botón × |
| `allowOutsideClick` | `boolean` | `true` | Cerrar al hacer click fuera |
| `allowEscapeKey` | `boolean` | `true` | Cerrar con tecla Escape |
| `timer` | `number` | `0` | Auto-cierre en ms (`0` = desactivado) |
| `hideButton` | `boolean` | `false` | Oculta el botón (útil para loading) |
| `onClose` | `() => void` | — | Callback al cerrar |
| `anim` | `AnimationOptions` | — | Opciones de animación |

### `ButtonOptions`

```typescript
interface ButtonOptions {
  text: string;
  color?: string;        // color de fondo del botón
  textColor?: string;    // color del texto
  action?: 'confirm' | 'close' | 'custom';
  onClick?: () => void;  // callback personalizado
}
```

### `AnimationOptions`

```typescript
interface AnimationOptions {
  duration?: number;     // duración en ms (por defecto: 400)
  easing?: string;       // nombre easing (ver tabla de easings)
  overlayEasing?: string;
  boxEasing?: string;
}
```

#### Tabla de easings disponibles

| Nombre | Equivalente CSS |
|--------|----------------|
| `easeOutQuad` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| `easeOutCubic` | `cubic-bezier(0.215, 0.61, 0.355, 1)` |
| `easeOutQuart` | `cubic-bezier(0.165, 0.84, 0.44, 1)` |
| `easeOutQuint` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| `easeOutBack` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `easeInBack` | `cubic-bezier(0.6, -0.28, 0.735, 0.045)` |
| `easeInOutCubic` | `cubic-bezier(0.645, 0.045, 0.355, 1)` |
| `ease` | `ease` (CSS nativo) |
| `ease-in` | `ease-in` (CSS nativo) |
| `ease-out` | `ease-out` (CSS nativo) |
| `ease-in-out` | `ease-in-out` (CSS nativo) |
| `cubic-bezier(...)` | Passthrough — cualquier valor CSS válido |

::: callout info "Easings de anime.js"
Los nombres de easing de anime.js (`easeOutQuad`, `easeInBack`, etc.) siguen siendo válidos en v2. Los easings sin equivalente CSS (`easeInElastic`, `spring`, etc.) se ignoran silenciosamente.
:::

---

## `notify.close()`

Cierra el modal activo programáticamente.

```javascript
notify.close();
```

---

## Ejemplos avanzados

### Confirmación con dos botones

```javascript
let confirmed = false;

await notify.show({
  type: 'question',
  title: '¿Eliminar registro?',
  message: 'Esta acción no se puede deshacer.',
  showCloseButton: false,
  allowOutsideClick: false,
  buttons: [
    { text: 'Cancelar', color: '#6b7280', action: 'close' },
    {
      text: 'Eliminar',
      color: '#ef4444',
      action: 'custom',
      onClick: () => { confirmed = true; notify.close(); }
    }
  ]
});

if (confirmed) {
  await deleteRecord();
}
```

### Modal de progreso

```javascript
notify.show({
  type: 'info',
  title: 'Exportando...',
  message: 'Generando el archivo PDF',
  hideButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false
});

await generatePDF();
notify.close();
notify.toastSuccess('PDF generado correctamente');
```
