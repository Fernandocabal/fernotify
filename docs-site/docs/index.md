---
title: "FerNotify — Sistema de Notificaciones"
description: "FerNotify es una librería de notificaciones moderna para la web. Modales y toasts con animaciones CSS nativas y cero dependencias externas."
---

# FerNotify

> Sistema moderno de notificaciones para la web — **cero dependencias externas**.

::: callout tip "v2.0.0 — Sin anime.js ni Boxicons"
Desde la versión 2.0.0, FerNotify no requiere ninguna librería externa. Las animaciones son CSS nativas y los iconos son SVGs inline.
:::

## ¿Qué es FerNotify?

FerNotify es una librería JavaScript/TypeScript que provee dos tipos de notificaciones:

- **Modales** (`notify.success(...)`) — notificaciones bloqueantes con botones, timers y callbacks
- **Toasts** (`notify.toastSuccess(...)`) — notificaciones no bloqueantes tipo snackbar

::: card "✅ Características"
- 5 tipos: `success`, `error`, `warning`, `info`, `question`
- Dark Mode automático (detecta el tema del sistema)
- Animaciones CSS nativas (sin anime.js)
- Iconos SVG inline (sin Boxicons)
- Accesible: teclado completo + ARIA
- Compatible con CDN, npm, React y TypeScript
:::

## Inicio rápido

::: tabs
== tab "CDN (UMD)"
```html
<!-- Agrega este script a tu HTML — sin dependencias externas -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js"></script>

<script>
  notify.success('¡Listo!', 'FerNotify instalado');
</script>
```

== tab "ES Module (CDN)"
```html
<script type="module">
  import NotificationSystem from 'https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.esm.js';
  const notify = new NotificationSystem();
  notify.success('¡Funcionando con módulos!');
</script>
```

== tab "npm"
```bash
npm install fernotify
```
```javascript
import NotificationSystem from 'fernotify';

const notify = new NotificationSystem();
notify.success('¡Instalado vía npm!');
```
:::

## Ejemplo de toast

```javascript
notify.toastSuccess('Datos guardados correctamente');
notify.toastError('Error al conectar con el servidor');
notify.toastLoading('Procesando...', 'Espera');

// Patrón async/await recomendado:
notify.toastLoading('Enviando...', 'Espera');
try {
  await fetch('/api/save', { method: 'POST' });
  await notify.closeToastLoading();
  notify.toastSuccess('Guardado correctamente');
} catch {
  await notify.closeToastLoading();
  notify.toastError('Error al guardar');
}
```

---

Continúa en [Instalación](/installation) →
