---
title: "Ejemplos"
description: "Ejemplos prácticos de FerNotify para casos de uso comunes."
---

# Ejemplos

## CRUD — Confirmación antes de eliminar

```javascript
async function deleteUser(userId) {
  let confirmed = false;

  await notify.show({
    type: 'question',
    title: 'Eliminar usuario',
    message: '¿Estás seguro? Esta acción no se puede deshacer.',
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

  if (!confirmed) return;

  notify.toastLoading('Eliminando usuario...');
  try {
    await api.delete(`/users/${userId}`);
    await notify.closeToastLoading();
    notify.toastSuccess('Usuario eliminado correctamente');
    refreshList();
  } catch (err) {
    await notify.closeToastLoading();
    notify.toastError(err.message || 'Error al eliminar el usuario');
  }
}
```

---

## Formulario con validación y feedback

```javascript
document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  // Validación básica
  if (!data.email || !data.name) {
    notify.toastWarning('Completa todos los campos requeridos');
    return;
  }

  notify.toastLoading('Enviando formulario...');
  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    await notify.closeToastLoading();
    notify.toastSuccess('Formulario enviado. Te contactaremos pronto.');
    e.target.reset();
  } catch {
    await notify.closeToastLoading();
    notify.toastError('Error de red. Inténtalo de nuevo.');
  }
});
```

---

## React — Hook personalizado

```tsx
import { useCallback } from 'react';
import NotificationSystem from 'fernotify';

// Singleton fuera del componente para evitar múltiples instancias
const notifyInstance = new NotificationSystem();

export function useNotify() {
  const confirmDelete = useCallback(async (message: string): Promise<boolean> => {
    let confirmed = false;
    await notifyInstance.show({
      type: 'question',
      title: 'Confirmar eliminación',
      message,
      showCloseButton: false,
      allowOutsideClick: false,
      buttons: [
        { text: 'Cancelar', color: '#6b7280', action: 'close' },
        {
          text: 'Eliminar',
          color: '#ef4444',
          action: 'custom',
          onClick: () => { confirmed = true; notifyInstance.close(); }
        }
      ]
    });
    return confirmed;
  }, []);

  return { notify: notifyInstance, confirmDelete };
}

// Uso en componente:
function UserCard({ user, onDelete }) {
  const { notify, confirmDelete } = useNotify();

  const handleDelete = async () => {
    const ok = await confirmDelete(`¿Eliminar a ${user.name}?`);
    if (ok) {
      notify.toastLoading('Eliminando...');
      await deleteUser(user.id);
      await notify.closeToastLoading();
      notify.toastSuccess('Usuario eliminado');
      onDelete(user.id);
    }
  };

  return <button onClick={handleDelete}>Eliminar</button>;
}
```

---

## Notificaciones de estado de conexión

```javascript
const notify = new NotificationSystem();
let offlineToastId = 'connection-status';

window.addEventListener('offline', () => {
  notify.toastError('Sin conexión a Internet', {
    id: offlineToastId,
    duration: 0,  // no auto-cierra
    closeable: false
  });
});

window.addEventListener('online', () => {
  // El toast anterior con el mismo id se resetea/cierra
  notify.toastSuccess('Conexión restaurada', { id: offlineToastId, duration: 3000 });
});
```

---

## Upload de archivo con progreso

```javascript
async function uploadFile(file) {
  notify.toastLoading(`Subiendo ${file.name}...`, 'Upload');

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const { url } = await res.json();
    await notify.closeToastLoading();
    notify.toastSuccess('Archivo subido correctamente');
    return url;
  } catch (err) {
    await notify.closeToastLoading();
    notify.toastError(`Error al subir: ${err.message}`);
    throw err;
  }
}
```

---

## Uso con `@latest` vs versión fija

::: callout warning "Producción"
En producción usa siempre una versión específica en la URL del CDN para evitar cambios inesperados:
:::

```html
<!-- ✅ Producción: versión fija -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@2.0.0/dist/notification-system.js"></script>

<!-- ⚠️ Desarrollo: última versión -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js"></script>
```
