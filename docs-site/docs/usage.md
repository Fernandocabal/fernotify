---
title: "Uso Básico"
description: "Cómo usar las notificaciones modales y los toasts de FerNotify."
---

# Uso Básico

## Modales (notify)

Los modales son notificaciones **bloqueantes** que requieren interacción del usuario.

### Métodos rápidos

```javascript
notify.success('Operación completada', '¡Éxito!');
notify.error('No se pudo conectar', 'Error');
notify.warning('Esta acción no se puede deshacer', '¿Continuar?');
notify.info('Tu sesión expira en 5 minutos');
notify.question('¿Deseas eliminar este elemento?', 'Confirmar');
```

### Método completo `notify.show()`

```javascript
const result = await notify.show({
  type: 'question',
  title: 'Confirmar eliminación',
  message: '¿Estás seguro de que deseas eliminar este registro?',
  buttonText: 'Eliminar',
  showCloseButton: true,
  allowOutsideClick: false,
  timer: 0,
  buttons: [
    { text: 'Cancelar', color: '#6b7280', action: 'close' },
    { text: 'Eliminar', color: '#ef4444', action: 'confirm' }
  ],
  onClose: () => console.log('Modal cerrado')
});
```

### Timer automático

```javascript
// El modal se cierra automáticamente tras 5 segundos
notify.info('Este mensaje desaparecerá en 5 segundos', 'Info', { timer: 5000 });
```

### Modal de carga

```javascript
// Modal bloqueante sin botón — ideal para operaciones en progreso
notify.show({
  type: 'info',
  title: 'Procesando',
  message: 'Por favor espera...',
  hideButton: true,
  allowOutsideClick: false,
  allowEscapeKey: false
});

await doLongOperation();

notify.close(); // Cerrar programáticamente
```

---

## Toasts

Los toasts son notificaciones **no bloqueantes** que aparecen en la esquina de la pantalla.

### Métodos rápidos

```javascript
notify.toastSuccess('Guardado correctamente');
notify.toastError('Error al procesar');
notify.toastWarning('Conexión inestable');
notify.toastInfo('Hay actualizaciones disponibles');
notify.toastQuestion('¿Quieres guardar los cambios?');
```

### Toast genérico

```javascript
notify.toast('Mensaje personalizado', {
  type: 'success',
  title: 'Título opcional',
  duration: 4000,        // ms (0 = no cierra automáticamente)
  closeable: true,       // muestra botón ×
  position: 'top-right'
});
```

### Toast de carga (`toastLoading`)

Solo puede existir uno a la vez. No se puede cerrar manualmente.

```javascript
notify.toastLoading('Subiendo archivo...', 'Espera');

try {
  await uploadFile(file);
  await notify.closeToastLoading(); // espera la animación de salida
  notify.toastSuccess('Archivo subido correctamente');
} catch (err) {
  await notify.closeToastLoading();
  notify.toastError('Error al subir el archivo');
}
```

### Reemplazar toast de carga

```javascript
notify.toastLoading('Procesando pago...');
await processPayment();
// Reemplaza el loading por el resultado sin animación de salida
notify.replaceToastLoading('¡Pago confirmado!', { type: 'success' });
```

### Deduplicación por ID

Si muestras el mismo toast varias veces rápidamente, puedes evitar duplicados:

```javascript
notify.toastInfo('El archivo ya existe', { id: 'file-exists', duration: 3000 });
// Si se llama otra vez con el mismo id, resetea el contador en lugar de crear otro
```

---

## Posición de los toasts

```javascript
notify.toastSuccess('Mensaje', { position: 'top-right' });    // por defecto
notify.toastSuccess('Mensaje', { position: 'top-left' });
notify.toastSuccess('Mensaje', { position: 'bottom-right' });
notify.toastSuccess('Mensaje', { position: 'bottom-left' });
notify.toastSuccess('Mensaje', { position: 'top-center' });
notify.toastSuccess('Mensaje', { position: 'bottom-center' });
```

---

## Swipe to dismiss

Los toasts soportan deslizarse para cerrar, tanto con el dedo en móvil como con el mouse en escritorio. El gesto está activo por defecto y convive con el botón × y el timer.

```javascript
// Desactivar para un toast puntual
notify.toastInfo('No deslizable', { swipeToDismiss: false });
```

---

## Configuración global con `configure()`

Establece defaults que se aplican a todos los toasts o modales. Útil para evitar repetir las mismas opciones en cada llamada.

```javascript
const notify = new NotificationSystem();

notify.configure({
  toast: {
    position: 'top-center',
    swipeToDismiss: true,
  },
  modal: {
    confirmColor: '#49a9b5',
  }
});

// A partir de aquí, todos los toasts van al centro con swipe habilitado
notify.toastSuccess('Guardado correctamente');
```

Las opciones pasadas en cada llamada siempre tienen prioridad sobre los defaults.
