# Sistema de Notificaciones - Guía de Uso

## Características

 - Estilo moderno tipo SweetAlert2
 - Animaciones fluidas con anime.js
 - Centrado en pantalla con overlay
 - 4 tipos: success, error, warning, info
 - Completamente reutilizable
 - Auto-cierre opcional
 - Callbacks personalizados
 - **Soporte completo de Dark Mode**
 - Respeta el tema del usuario en tu web

## Uso Básico

### 1. Notificación Rápida (solo mensaje)

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

### 2. Con Título Personalizado

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

### 3. Con Opciones Avanzadas

```javascript
notify.success(
    'Tu mensaje ha sido enviado correctamente',
    '¡Enviado!',
    {
        buttonText: 'Entendido',
        timer: 5000,  // Auto-cerrar en 5 segundos
        onClose: () => {
            console.log('Notificación cerrada');
            // Hacer algo después de cerrar
        }
    }
);
```

### 4. Configuración Completa

```javascript
notify.show({
    type: 'warning',
    title: 'Sesión por Expirar',
    message: 'Tu sesión expirará en 2 minutos. ¿Deseas continuar?',
    buttonText: 'Renovar Sesión',
    timer: null,  // No auto-cerrar
    onClose: () => {
        // Renovar token o redirigir
        renewSession();
    }
});
```

## Ejemplos de Uso Real

### Validación de Formulario

```javascript
const form = document.getElementById('myForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email) {
        notify.warning('Por favor ingresa tu email');
        return;
    }
    
    if (!isValidEmail(email)) {
        notify.error('El formato del email no es válido', 'Email Inválido');
        return;
    }
    
    // Enviar formulario...
    notify.success('Formulario enviado correctamente', '¡Éxito!');
});
```

### Petición AJAX

```javascript
async function loadData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        if (data.success) {
            notify.success('Datos cargados correctamente');
            updateUI(data);
        } else {
            notify.error(data.error || 'Error al cargar datos');
        }
    } catch (error) {
        notify.error(
            'No se pudo conectar con el servidor',
            'Error de Conexión'
        );
    }
}
```

### Confirmación de Eliminación

```javascript
function deleteItem(id) {
    notify.show({
        type: 'warning',
        title: '¿Estás seguro?',
        message: 'Esta acción no se puede deshacer. El registro será eliminado permanentemente.',
        buttonText: 'Sí, eliminar',
        onClose: async () => {
            // Usuario confirmó, proceder con eliminación
            await performDelete(id);
            notify.success('Registro eliminado correctamente');
        }
    });
}
```

### Login Exitoso

```javascript
async function login(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            notify.success(
                `Bienvenido de nuevo, ${result.user.name}`,
                '¡Login Exitoso!',
                {
                    timer: 2000,
                    onClose: () => {
                        window.location.href = '/dashboard';
                    }
                }
            );
        } else {
            notify.error(
                'Credenciales incorrectas. Por favor verifica tus datos.',
                'Error de Autenticación'
            );
        }
    } catch (error) {
        notify.error('Error de conexión', 'Error');
    }
}
```

### Auto-guardado

```javascript
let autoSaveTimer;

function autoSave(content) {
    clearTimeout(autoSaveTimer);
    
    autoSaveTimer = setTimeout(async () => {
        try {
            await saveToServer(content);
            notify.info('Cambios guardados automáticamente', null, {
                timer: 2000
            });
        } catch (error) {
            notify.warning('No se pudo guardar automáticamente');
        }
    }, 3000);
}
```

## Dark Mode y Temas

El sistema de notificaciones **detecta automáticamente** el tema activo en tu web y ajusta sus colores en consecuencia.

### Cómo Funciona

El sistema utiliza la clase `.dark` en el elemento `<html>` para determinar el tema actual:

```html
<!-- Modo Claro (default) -->
<html lang="es">
  <!-- Notificaciones se muestran con fondo blanco y texto oscuro -->
</html>

<!-- Modo Oscuro -->
<html lang="es" class="dark">
  <!-- Notificaciones se muestran con fondo oscuro y texto claro -->
</html>
```

### Integración con Tailwind CSS

Si usas Tailwind CSS con `darkMode: 'class'`, las notificaciones funcionarán automáticamente:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    darkMode: 'class'  // ← Configuración necesaria
  }
</script>
```

### Implementar Toggle de Tema

Ejemplo de botón para cambiar entre modo claro y oscuro:

```javascript
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  
  // Guardar preferencia del usuario
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Las notificaciones cambiarán automáticamente
});

// Cargar tema guardado al iniciar
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}
```

### Colores del Dark Mode

**Modo Claro:**
- Fondo del modal: `#ffffff` (blanco)
- Texto principal: `#111827` (gris muy oscuro)
- Texto secundario: `#6b7280` (gris medio)
- Overlay: `rgba(0, 0, 0, 0.4)` (negro semi-transparente)

**Modo Oscuro:**
- Fondo del modal: `#0f1724` (azul oscuro)
- Texto principal: `#e6eef8` (blanco-azulado)
- Texto secundario: `#cbd5e1` (gris claro)
- Overlay: `rgba(0, 0, 0, 0.6)` (negro más opaco)
- Inputs: `#0b1220` (azul muy oscuro)

### Ejemplo Completo con Dark Mode

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { darkMode: 'class' }
  </script>
</head>
<body class="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
  
  <!-- Botón de toggle -->
  <button id="theme-toggle" class="p-2 rounded bg-gray-200 dark:bg-gray-700">
    Cambiar Tema
  </button>
  
  <!-- Botón de notificación -->
  <button onclick="notify.success('Tema aplicado correctamente')">
    Mostrar Notificación
  </button>
  
  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
  <script src="notification-system.js"></script>
  <script>
    // Toggle de tema
    document.getElementById('theme-toggle').addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
    });
  </script>
</body>
</html>
```

### Sin Tailwind CSS

Si no usas Tailwind, solo necesitas agregar/quitar la clase `.dark` del `<html>`:

```javascript
// Activar modo oscuro
document.documentElement.classList.add('dark');

// Activar modo claro
document.documentElement.classList.remove('dark');

// Toggle
document.documentElement.classList.toggle('dark');
```

Las notificaciones **siempre respetarán** el tema de tu web, ignorando la preferencia del sistema operativo del usuario.

### Prioridad de Temas

1. **Clase `.dark` en `<html>`** ← Máxima prioridad (tu web decide)
2. ~~Preferencia del sistema operativo~~ ← Ignorada intencionalmente

Esto asegura que los usuarios vean notificaciones consistentes con el tema que eligieron en tu aplicación web.

## Personalización de Tipos

Cada tipo tiene su propio estilo:

- **success** - Verde, para operaciones exitosas
- **error** - Rojo, para errores críticos
- **warning** - Amarillo, para advertencias
- **info** - Azul, para información general

## API Completa

### `notify.show(options)`

```javascript
{
    type: 'success' | 'error' | 'warning' | 'info',  // Requerido
    title: 'Título',                                  // Opcional
    message: 'Mensaje detallado',                     // Requerido
    buttonText: 'OK',                                 // Opcional (default: 'OK')
    timer: 5000,                                      // Opcional (ms, null = sin timer)
    onClose: () => { }                                // Opcional (callback)
}
```

### Métodos de Acceso Rápido

```javascript
notify.success(message, title?, options?)
notify.error(message, title?, options?)
notify.warning(message, title?, options?)
notify.info(message, title?, options?)
```

### Cerrar Programáticamente

```javascript
notify.close();  // Cierra la notificación actual
```

## Características Técnicas

- **Responsive**: Se adapta a móviles y tablets
- **Accessible**: Puede cerrarse con ESC o click en overlay
- **Solo una a la vez**: Cierra automáticamente la anterior
- **Animaciones suaves**: Entrada/salida con anime.js
- **Sin dependencias extras**: Solo requiere anime.js
- **Ligero**: ~10KB total

## Integración en Otros Proyectos

```html
<!-- Incluir anime.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>

<!-- Incluir notification-system.js -->
<script src="assets/js/notification-system.js"></script>

<!-- Usar en tu código -->
<script>
    notify.success('¡Sistema listo!');
</script>
```

¡Listo para usar!
