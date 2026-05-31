# Notification System

> Sistema moderno de notificaciones con animaciones fluidas, soporte completo de Dark Mode y **cero dependencias externas**.

[![Demo](https://img.shields.io/badge/Demo-Live-success)](https://fernotify.pages.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/Fernandocabal/notification-system/badge)](https://www.jsdelivr.com/package/gh/Fernandocabal/fernotify)

## Características

- **5 tipos de notificaciones**: Success, Error, Warning, Info, Question
- **Dark Mode automático**: Detecta el tema de tu web
- **Animaciones fluidas**: CSS transitions nativas — sin anime.js ni dependencias externas
- **Cero dependencias**: No requiere anime.js, Boxicons ni ninguna otra librería
- **Ligero y rápido**: ~34KB minificado, auto-contenido
- **Accesible**: Soporte completo de teclado y ARIA
- **Responsive**: Se adapta a todos los tamaños de pantalla
- **Personalizable**: Colores, textos, temporizadores y callbacks
- **Sin dependencias de npm**: Usa directamente desde CDN

## Instalación

### Método 1: CDN Clásico (UMD) - Lo mas fácil 🚀

```html
<!-- FerNotify v2 — sin dependencias externas -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js"></script>

<!-- Usar directamente -->
<script>
  notify.success('¡Listo para usar!');
</script>
```

### Método 2: ES6 Module (Import)

```html
<script type="module">
  import NotificationSystem from 'https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.esm.js';
  
  // Crear instancia global
  window.notify = new NotificationSystem();
  
  notify.success('¡Funcionando con módulos!');
</script>
```

### Método 3: NPM (Node Package Manager)

```bash
npm install fernotify
```

Luego importa y usa en tu proyecto:

```javascript
import NotificationSystem from 'fernotify';

// Crear instancia
const notify = new NotificationSystem();

// Usar
notify.success('¡Instalado vía npm!');
```

Con Webpack/Vite/bundler:

```javascript
import NotificationSystem from 'fernotify/dist/notification-system.esm.js';

window.notify = new NotificationSystem();
```

### Versión Específica (Recomendado en producción)

```html
<!-- UMD -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@2.0.0/dist/notification-system.js"></script>

<!-- ES Module -->
<script type="module">
  import NotificationSystem from 'https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@2.0.0/dist/notification-system.esm.js';
</script>
```

## Uso Básico

### Notificaciones Rápidas

```javascript
// Success
notify.success('Operación completada exitosamente');

// Error
notify.error('Ocurrió un error inesperado');

// Warning
notify.warning('Esta acción no se puede deshacer');

// Info
notify.info('Hay una nueva actualización disponible');

// Question (nuevo)
notify.question('¿Seguro que quieres continuar?', 'Confirmación');
```

### Con Título Personalizado

```javascript
notify.success(
  'Tu perfil ha sido actualizado correctamente',
  '¡Cambios Guardados!'
);

notify.error(
  'No tienes permisos para realizar esta acción',
  'Acceso Denegado'
);
```

### Opciones Avanzadas

```javascript
notify.show({
  type: 'warning',
  title: 'Sesión por Expirar',
  message: '¿Deseas continuar?',
  buttonText: 'Renovar Sesión',
  timer: 5000,  // Auto-cerrar en 5 segundos
  onClose: () => {
    console.log('Notificación cerrada');
  }
});
```

## Dark Mode

El sistema detecta automáticamente el tema de tu web usando la clase `.dark` en el elemento `<html>`:

```javascript
// Activar modo oscuro
document.documentElement.classList.add('dark');

// Activar modo claro
document.documentElement.classList.remove('dark');

// Toggle
document.documentElement.classList.toggle('dark');
```

### Integración con Tailwind CSS

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    darkMode: 'class'  // ← Configuración necesaria
  }
</script>
```

Las notificaciones cambiarán automáticamente sus colores según el tema activo.

## API Completa

### `notify.show(options)`

```javascript
notify.show({
  type: 'success',              // 'success' | 'error' | 'warning' | 'info'
  title: 'Título',              // Opcional
  message: 'Mensaje',           // Requerido
  buttonText: 'OK',             // Opcional (default: 'OK')
  // Para confirmaciones rápidas hay atajos:
  // `onConfirm` (función) se ejecuta al pulsar el botón de confirmar.
  // `onCancel` (función) se ejecuta al pulsar el botón de cancelar.
  // Puedes personalizar textos con `confirmText` / `cancelText` y colores con
  // `confirmColor` / `cancelColor`.
  timer: 3000,                  // Opcional (ms, null = sin timer)
  allowOutsideClick: true,      // Opcional (default: true)
  allowEscapeKey: true,         // Opcional (default: true)
  hideButton: false,            // Opcional (ocultar botón principal)
  showCloseButton: false,       // Opcional (mostrar X en esquina)
  onClose: () => {}             // Opcional (callback al cerrar)
});
```

### Métodos de Acceso Rápido

```javascript
notify.success(message, title?, options?)
notify.error(message, title?, options?)
notify.warning(message, title?, options?)
notify.info(message, title?, options?)
notify.question(message, title?, options?)
notify.close()  // Cerrar la notificación actual
```

### Notificaciones de Carga (NEW) 🆕

```javascript
// Mostrar spinner de carga
notify.loading('Procesando solicitud...', 'Por favor espera');

// Cerrar la notificación de carga
notify.closeLoading();

// Con callback automático
notify.loading('Cargando...', 'Espera', {
  timer: 3000  // Auto-cerrar en 3 segundos
}).then(() => {
  console.log('Carga completada');
});
```

### Toast — Notificaciones no bloqueantes 🍞

Los toasts aparecen en la esquina de la pantalla **sin interrumpir al usuario**, se apilan automáticamente y se cierran solos (o con el botón ×).

```javascript
// Métodos abreviados (mismo patrón que los modales)
notify.toastSuccess('Cambios guardados.', 'Título opcional');
notify.toastError('Error al procesar.', 'Error');
notify.toastWarning('Revisa los datos.');
notify.toastInfo('Nueva versión disponible.');
notify.toastQuestion('Nueva solicitud pendiente.');

// Método genérico con opciones completas
notify.toast('Mensaje aquí', {
  type: 'success',          // 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading'
  title: 'Título opcional',
  duration: 4000,           // ms hasta auto-cierre (0 = sin auto-cierre, default: 4000)
  position: 'top-right',   // 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left'
  id: 'my-toast',          // ID para deduplicación (optional)
  closeable: true           // false = oculta el botón × (default: true)
});
```

**Características:**
- Sin overlay — no bloquea la UI
- Apilables: se acumulan uno bajo otro
- Progress bar que indica el tiempo restante
- Botón × para cierre manual
- Animación de entrada/salida suave
- Soporte completo de dark mode

### Toast de carga 🔄

Muestra un toast con spinner para operaciones asíncronas. Solo puede existir uno a la vez y no se puede cerrar manualmente; ciérralo con `closeToastLoading()`.

```javascript
async function fetchData() {
  notify.toastLoading('Obteniendo datos...', 'Cargando');

  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    notify.closeToastLoading();
    notify.toastSuccess('Datos cargados correctamente');
  } catch {
    notify.closeToastLoading();
    notify.toastError('No se pudieron cargar los datos');
  }
}

fetchData();
```

```javascript
// Firma completa
notify.toastLoading(message?, title?, options?)
notify.closeToastLoading()
```

### Deduplicación de toasts por ID

Asigna un `id` a un toast para evitar duplicados. Si ya hay un toast visible con ese ID, se resetea su cuenta regresiva en lugar de crear uno nuevo.

```javascript
// Aunque el usuario haga clic muchas veces, solo existe un toast
button.addEventListener('click', () => {
  notify.toastError('Email o contraseña incorrectos', 'Error', {
    id: 'login-error',
    duration: 4000
  });
});
```

### Personalización de Animaciones

```javascript
notify.show({
  type: 'success',
  message: 'Animación personalizada',
  anim: {
    overlayDuration: 200,      // Duración fade del overlay (ms)
    overlayOpacity: 0.85,      // Opacidad del overlay (0-1)
    boxDuration: 250,          // Duración animación del modal (ms)
    boxStartScale: 0.8,        // Escala inicial del modal (0-1)
    iconRotate: 360,           // Rotación del icono (grados)
    iconDuration: 500          // Duración animación del icono (ms)
  }
});
```

## Ejemplos de Uso

### Validación de Formulario

```javascript
document.getElementById('myForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  
  if (!email) {
    notify.warning('Por favor ingresa tu email');
    return;
  }
  
  // Simular envío
  notify.success('Formulario enviado correctamente', '¡Éxito!');
});
```

### Operación Asincrónica con Carga (Recomendado)

```javascript
async function fetchData() {
  // Mostrar spinner
  notify.loading('Obteniendo datos...', 'Cargando');
  
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    
    // Cerrar loading
    notify.closeLoading();
    
    // Mostrar resultado
    notify.success('Datos cargados correctamente!');
    console.log(data);
  } catch (error) {
    // Cerrar loading
    notify.closeLoading();
    
    // Mostrar error
    notify.error('No se pudieron cargar los datos');
  }
}

fetchData();
```

### Confirmación de Operación (dos botones)

```javascript
notify.show({
  type: 'warning',
  title: '¿Estás seguro?',
  message: 'Esta acción no se puede deshacer',
  buttons: [
    {
      text: 'Cancelar',
      color: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
      onClick: () => {
        console.log('Operación cancelada');
      }
    },
    {
      text: 'Sí, continuar',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      onClick: () => {
        deleteUser();
      }
    }
  ],
  allowOutsideClick: false,
  allowEscapeKey: false
});
```

### Notificación con Contenido HTML

### Confirmación (atajo `onConfirm` / `onCancel`)

```javascript
notify.show({
  type: 'warning',
  title: '¿Eliminar registro?',
  message: 'Esta acción no se puede deshacer.',
  confirmText: 'Sí, eliminar',
  cancelText: 'Cancelar',
  onConfirm: async () => {
    await performDelete(id);
    notify.success('Registro eliminado correctamente');
  },
  onCancel: () => {
    console.log('El usuario canceló la operación');
  },
  allowOutsideClick: false,
  allowEscapeKey: false
});
```

### Personalizar colores y sombras (ejemplo)

```javascript
notify.show({
  type: 'warning',
  title: 'Eliminar elemento',
  message: '¿Estás seguro?',
  confirmText: 'Sí, borrar',
  cancelText: 'No, cancelar',
  onConfirm: () => fetch('/api/delete', { method: 'POST' }),
  onCancel: () => console.log('Cancelado'),
  // Colores y sombras pueden ser cualquier string CSS (gradiente o color simple)
  confirmColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  confirmShadow: 'rgba(5,150,105,0.22)',
  cancelColor: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
  cancelShadow: 'rgba(0,0,0,0.08)'
});
```

```javascript
const form = document.createElement('form');
form.innerHTML = `
  <label>Nombre:
    <input type="text" id="name" class="px-2 py-1 border rounded" />
  </label>
  <button type="submit" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded">
    Enviar
  </button>
`;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.querySelector('#name').value;
  console.log('Nombre:', name);
  notify.close();
});

notify.show({
  title: 'Ingresa tu nombre',
  content: form,
  allowOutsideClick: false,
  showCloseButton: true
});
```

## Estructura del Proyecto

```
notification-system/
├── dist/
│   ├── notification-system.js       # UMD (uso directo en <script>)
│   └── notification-system.esm.js   # ES Module (import/export)
├── docs/
│   ├── index.html                   # Demo interactiva
│   └── assets/
│       └── demo.js                  # Código de la demo
├── NOTIFICATION_SYSTEM_GUIDE.md     # Guía completa
├── README.md
├── LICENSE
└── .gitignore
```

## Demo en Vivo

👉 **[Ver Demo Completa](https://fernotify.pages.dev/)**

La demo incluye:
- Ejemplos interactivos de todos los tipos
- Playground para probar opciones
- Documentación visual del Dark Mode
- Ejemplos de código copiables

## Versiones

Para usar una versión específica, usa tags en la URL del CDN:

```html
<!-- Última versión (auto-actualiza) -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js"></script>

<!-- Versión fija (recomendado en producción) -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@1.2.1/dist/notification-system.js"></script>
```

### Crear una nueva versión

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Colores del Dark Mode

**Modo Claro:**
- Fondo del modal: `#ffffff`
- Texto principal: `#111827`
- Overlay: `rgba(0, 0, 0, 0.4)`

**Modo Oscuro:**
- Fondo del modal: `#0f1724`
- Texto principal: `#e6eef8`
- Overlay: `rgba(0, 0, 0, 0.6)`

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## Migración v1 → v2

En v2.0.0 se eliminaron todas las dependencias externas:

- **Eliminar**: `<script src="anime.min.js">` y `<link href="boxicons.min.css">` — ya no son necesarios.
- **Easings personalizados**: Los nombres de easing de anime.js (`easeOutQuad`, `easeInBack`, etc.) siguen funcionando vía mapa interno de `cubic-bezier`. Easings específicos de anime.js sin equivalente CSS (`easeInElastic`, `spring`, etc.) se ignoran silenciosamente.
- **Iconos**: Ahora son SVGs inline — no se necesita Boxicons.

## Créditos

- Iconos: Estilo [Feather Icons](https://feathericons.com/) (SVG inline)

## Soporte

- [Documentación Completa](NOTIFICATION_SYSTEM_GUIDE.md)
- [Reportar un Bug](https://github.com/Fernandocabal/notification-system/issues)
- [Solicitar Feature](https://github.com/Fernandocabal/notification-system/issues)

---

Hecho para la comunidad de desarrolladores
