# Notification System

> Sistema moderno de notificaciones con animaciones fluidas y soporte completo de Dark Mode.

[![Demo](https://img.shields.io/badge/Demo-Live-success)](https://TU_DOMINIO.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/gh/Fernandocabal/notification-system/badge)](https://www.jsdelivr.com/package/gh/Fernandocabal/fernotify)

## Características

- **4 tipos de notificaciones**: Success, Error, Warning, Info
- **Dark Mode automático**: Detecta el tema de tu web
- **Animaciones fluidas**: Powered by anime.js
- **Ligero y rápido**: ~10KB sin dependencias (excepto anime.js)
- **Accesible**: Soporte completo de teclado y ARIA
- **Responsive**: Se adapta a todos los tamaños de pantalla
- **Personalizable**: Colores, textos, temporizadores y callbacks
- **Sin dependencias de npm**: Usa directamente desde CDN

## Instalación

### Método 1: CDN Clásico (UMD)

```html
<!-- Dependencia: anime.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>

<!-- Notification System -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/notification-system@latest/dist/notification-system.js"></script>

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

### Versión Específica (Recomendado en producción)

```html
<!-- UMD -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/notification-system@1.0.0/dist/notification-system.js"></script>

<!-- ES Module -->
<script type="module">
  import NotificationSystem from 'https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@1.0.0/dist/notification-system.esm.js';
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
notify.close()  // Cerrar la notificación actual
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

### Confirmación de Operación

```javascript
notify.show({
  type: 'warning',
  title: '¿Estás seguro?',
  message: 'Esta acción no se puede deshacer',
  buttonText: 'Sí, continuar',
  allowOutsideClick: false,
  allowEscapeKey: false,
  onClose: () => {
    // Ejecutar acción después de confirmar
    deleteUser();
  }
});
```

### Notificación con Contenido HTML

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

👉 **[Ver Demo Completa](https://TU_DOMINIO.dev)**

La demo incluye:
- Ejemplos interactivos de todos los tipos
- Playground para probar opciones
- Documentación visual del Dark Mode
- Ejemplos de código copiables

## Versiones

Para usar una versión específica, usa tags en la URL del CDN:

```html
<!-- Última versión (auto-actualiza) -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/notification-system@latest/dist/notification-system.js"></script>

<!-- Versión fija (recomendado en producción) -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/notification-system@1.0.0/dist/notification-system.js"></script>
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

## Créditos

- Animaciones: [anime.js](https://animejs.com/)
- Inspirado en: [SweetAlert2](https://sweetalert2.github.io/)

## Soporte

- [Documentación Completa](NOTIFICATION_SYSTEM_GUIDE.md)
- [Reportar un Bug](https://github.com/Fernandocabal/notification-system/issues)
- [Solicitar Feature](https://github.com/Fernandocabal/notification-system/issues)

---

Hecho para la comunidad de desarrolladores
