---
title: "Instalación"
description: "Cómo instalar FerNotify via CDN, npm o ES Modules."
---

# Instalación

FerNotify v2.1.1 no requiere ninguna dependencia externa. Solo incluye el script y listo.

## CDN (recomendado para webs estáticas)

### UMD — `<script>` global

El método más sencillo. Agrega el script a tu HTML y tendrás `window.notify` disponible globalmente.

```html
<!-- Última versión -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js"></script>

<!-- Versión específica (recomendado en producción) -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@2.1.1/dist/notification-system.js"></script>
```

Uso:

```javascript
// notify está disponible como variable global
notify.success('¡Hola!');
notify.toastInfo('Mensaje informativo');
```

### ES Module — `import`

Para proyectos con módulos nativos o bundlers:

```html
<script type="module">
  import NotificationSystem from 'https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.esm.js';

  const notify = new NotificationSystem();
  notify.success('¡Funcionando con módulos!');
</script>
```

## npm

```bash
npm install fernotify
```

### JavaScript / TypeScript

```javascript
import NotificationSystem from 'fernotify';

const notify = new NotificationSystem();
notify.success('¡Instalado!');
```

### React + TypeScript

```tsx
import { useEffect, useRef } from 'react';
import NotificationSystem from 'fernotify';

// Instancia singleton — créala fuera del componente
const notify = new NotificationSystem();

export default function App() {
  const handleSave = async () => {
    notify.toastLoading('Guardando...', 'Espera');
    try {
      await saveData();
      await notify.closeToastLoading();
      notify.toastSuccess('Guardado correctamente');
    } catch {
      await notify.closeToastLoading();
      notify.toastError('Error al guardar');
    }
  };

  return <button onClick={handleSave}>Guardar</button>;
}
```

### Vite / Webpack

```javascript
// Con bundler moderno
import NotificationSystem from 'fernotify/dist/notification-system.esm.js';

window.notify = new NotificationSystem();
```

## Versiones disponibles

| Archivo | Formato | Uso |
|---------|---------|-----|
| `dist/notification-system.js` | UMD (auto-ejecutable) | `<script src="...">` |
| `dist/notification-system.min.js` | UMD minificado | Producción CDN |
| `dist/notification-system.esm.js` | ES Module | `import` / bundlers |
| `dist/notification-system.esm.min.js` | ES Module minificado | Producción ESM |

::: callout info "Sin dependencias"
A diferencia de v1.x, **no necesitas** incluir anime.js ni Boxicons. FerNotify v2 es completamente auto-contenido.
:::
