---
title: "Migración v1 → v2"
description: "Guía para migrar de FerNotify v1.x a v2.0.0."
---

# Migración v1 → v2

FerNotify v2.0.0 elimina todas las dependencias externas. La API pública no cambia, pero hay que actualizar la instalación.

## Cambios principales

| | v1.x | v2.0.0 |
|---|------|--------|
| anime.js | Requerido (CDN) | ❌ No necesario |
| Boxicons | Requerido (CDN) | ❌ No necesario |
| Iconos | `<i class="bx bx-...">` | SVG inline |
| Animaciones | anime.js | CSS transitions nativas |
| API pública | — | Sin cambios breaking |

---

## Pasos de migración

### 1. Eliminar dependencias externas del HTML

**Antes (v1.x):**
```html
<head>
  <!-- Eliminar estas líneas: -->
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
</head>
<body>
  ...
  <!-- Eliminar esta línea: -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@1.2.12/dist/notification-system.js"></script>
</body>
```

**Después (v2.0.0):**
```html
<body>
  ...
  <!-- Solo este script, sin dependencias: -->
  <script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@2.0.0/dist/notification-system.js"></script>
</body>
```

### 2. Actualizar npm (si usas npm)

```bash
npm install fernotify@latest
```

### 3. Actualizar la URL en imports ESM

```javascript
// Antes:
import NotificationSystem from 'https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@1.2.12/dist/notification-system.esm.js';

// Después:
import NotificationSystem from 'https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@2.0.0/dist/notification-system.esm.js';
```

---

## Cambios en easings

Los nombres de easing de anime.js **siguen siendo válidos** en v2 via un mapa interno. Sin embargo, algunos easings específicos de anime.js sin equivalente CSS son ignorados silenciosamente:

| Easing | v1 | v2 |
|--------|----|----|
| `easeOutQuad`, `easeInBack`, etc. | ✅ (anime.js) | ✅ (cubic-bezier CSS) |
| `easeInElastic`, `spring(...)` | ✅ (anime.js) | ⚠️ Ignorado (fallback a `ease`) |
| `cubic-bezier(...)` | ✅ | ✅ (passthrough) |
| `ease`, `ease-in`, `ease-out` | ✅ | ✅ |

Si usabas easings elásticos o de resorte, cámbialos por un `cubic-bezier` equivalente.

---

## No hay cambios en la API

El código de tu aplicación **no necesita cambios**. Todos los métodos, opciones y callbacks son compatibles:

```javascript
// Esto funciona igual en v1 y v2:
notify.success('¡Guardado!', 'Éxito');
notify.toastLoading('Cargando...');
await notify.closeToastLoading();
notify.show({ type: 'question', buttons: [...] });
```

::: callout tip "¿Algo no funciona?"
Si encuentras una regresión al migrar, [abre un issue en GitHub](https://github.com/Fernandocabal/fernotify/issues).
:::
