---
title: "API — Toasts"
description: "Referencia completa de la API de toasts de FerNotify."
---

# API — Toasts

Los toasts son notificaciones no bloqueantes que aparecen en la esquina de la pantalla.

## Métodos abreviados

| Método | Tipo | Descripción |
|--------|------|-------------|
| `notify.toastSuccess(msg, title?, opts?)` | success | Toast verde |
| `notify.toastError(msg, title?, opts?)` | error | Toast rojo |
| `notify.toastWarning(msg, title?, opts?)` | warning | Toast amarillo |
| `notify.toastInfo(msg, title?, opts?)` | info | Toast azul |
| `notify.toastQuestion(msg, title?, opts?)` | question | Toast morado |

---

## `notify.toast(msgOrOpts, opts?)`

Método genérico para crear un toast con control total.

```typescript
notify.toast(message: string, options?: ToastOptions): void
notify.toast(options: ToastOptions): void
```

### `ToastOptions`

| Propiedad | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info' \| 'question'` | `'info'` | Estilo visual |
| `title` | `string` | — | Título del toast |
| `duration` | `number` | `4000` | Auto-cierre en ms (`0` = sin límite) |
| `closeable` | `boolean` | `true` | Muestra botón × |
| `swipeToDismiss` | `boolean` | `true` | Habilita deslizar para cerrar (mouse o dedo) |
| `position` | `ToastPosition` | `'top-right'` | Posición en pantalla |
| `id` | `string` | — | ID para deduplicación |

### Posiciones disponibles

```typescript
type ToastPosition =
  | 'top-right'      // por defecto
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';
```

---

## `notify.toastLoading(msg?, title?, opts?)`

Toast de carga con spinner. Solo puede existir uno a la vez. No se puede cerrar manualmente.

```javascript
notify.toastLoading('Procesando pago...', 'Espera');
```

- `closeable` es `false` automáticamente
- `duration` es `0` por defecto (sin auto-cierre)

---

## `notify.closeToastLoading()`

Cierra el toast de carga activo. Retorna `Promise<void>` que resuelve tras la animación de salida (~300ms).

```javascript
await notify.closeToastLoading();
```

::: callout tip "Patrón recomendado"
Siempre usa `await notify.closeToastLoading()` antes de mostrar el toast de resultado para evitar solapamiento visual.
:::

```javascript
notify.toastLoading('Enviando datos...', 'Espera');
try {
  await fetch('/api/save', { method: 'POST', body: JSON.stringify(data) });
  await notify.closeToastLoading();
  notify.toastSuccess('Guardado correctamente');
} catch {
  await notify.closeToastLoading();
  notify.toastError('Error al guardar');
}
```

---

## `notify.replaceToastLoading(message, options?)`

Reemplaza el toast de carga por un toast de resultado **sin animación de salida/entrada**. Más suave visualmente que `closeToastLoading` + nuevo toast.

```javascript
notify.toastLoading('Procesando...');
await process();
notify.replaceToastLoading('¡Completado!', { type: 'success' });
```

Si no hay un toast de carga activo, funciona como `notify.toast()` normal.

---

## Deduplicación con `id`

Si un toast con el mismo `id` ya está visible, se resetea su cuenta regresiva en lugar de crear un duplicado.

```javascript
function showSyncError() {
  notify.toastError('Error de sincronización', { id: 'sync-error', duration: 5000 });
  // Múltiples llamadas no crean múltiples toasts
}
```

---

## Ejemplos

### Notificaciones de formulario

```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!form.checkValidity()) {
    notify.toastWarning('Por favor completa todos los campos requeridos');
    return;
  }

  notify.toastLoading('Enviando formulario...');
  try {
    await submitForm(new FormData(form));
    await notify.closeToastLoading();
    notify.toastSuccess('Formulario enviado correctamente');
    form.reset();
  } catch (err) {
    await notify.closeToastLoading();
    notify.toastError(err.message || 'Error al enviar el formulario');
  }
});
```

### Toast sin auto-cierre

```javascript
// duration: 0 → el usuario debe cerrarlo manualmente
notify.toastInfo('Nueva versión disponible. Recarga para actualizar.', {
  duration: 0,
  closeable: true
});
```

### Stack de toasts en posición diferente

```javascript
notify.toastSuccess('Cambio 1 guardado', { position: 'bottom-right' });
notify.toastSuccess('Cambio 2 guardado', { position: 'bottom-right' });
// Los toasts se apilan verticalmente
```

---

## Swipe to dismiss

Los toasts se pueden cerrar deslizando con el dedo (o con el mouse) en cualquier dirección. El gesto está **habilitado por defecto** y convive con el botón × y el timer automático.

```javascript
// Deshabilitar el swipe para un toast puntual
notify.toastInfo('No se puede deslizar', { swipeToDismiss: false });
```

::: callout info "Movimiento reducido"
Si el usuario tiene activada la preferencia del sistema `prefers-reduced-motion`, el swipe-to-dismiss se desactiva automáticamente.
:::

::: callout warning "toastLoading"
`notify.toastLoading()` siempre desactiva el swipe (`swipeToDismiss: false`) ya que el toast de carga no debe cerrarse manualmente.
:::

---

## `notify.configure(defaults)`

Establece opciones globales que se aplican a todos los toasts (y/o modales) sin necesidad de repetirlas en cada llamada. Las opciones por llamada siempre tienen prioridad.

```typescript
notify.configure(defaults: {
  toast?: Partial<ToastOptions>;
  modal?: Partial<NotificationOptions>;
}): this
```

Retorna `this` para permitir encadenamiento.

### Ejemplo — configuración global

```javascript
const notify = new NotificationSystem();

notify.configure({
  toast: {
    position: 'top-center',
    swipeToDismiss: true,
    showProgress: false,
  }
});

// Todos los toasts usarán top-center y tendrán swipe habilitado
notify.toastSuccess('Guardado');
notify.toastError('Error al conectar');

// Puedes sobreescribir por llamada
notify.toastInfo('Aviso', { position: 'bottom-right', swipeToDismiss: false });
```

### Ejemplo — React/TypeScript con patrón singleton

```typescript
// src/lib/notify.ts
import NotificationSystem from 'fernotify';

const notify = new NotificationSystem();

notify.configure({
  toast: { position: 'top-center', swipeToDismiss: true },
  modal: { confirmColor: '#49a9b5', cancelColor: '#6a6a6a' },
});

export default notify;
```

```tsx
// En cualquier componente
import notify from '@/lib/notify';

function MyComponent() {
  return (
    <button onClick={() => notify.toastSuccess('¡Listo!')}>
      Guardar
    </button>
  );
}
```
