# Sistema de Notificaciones - Guía de Uso

## 🚀 Instalación

### CDN (Lo más fácil)

```html
<!-- ¡Es todo lo que necesitas! Las dependencias se cargan automáticamente -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js"></script>
```

### ES Module

```javascript
import NotificationSystem from 'https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.esm.js';

window.notify = new NotificationSystem();
```

> **✅ Dependencias Automáticas:** Se cargan automáticamente anime.js (animaciones) y Boxicons (iconos). No necesitas hacer nada especial.

## Características

 - Estilo moderno y limpio
 - Animaciones fluidas con anime.js (se carga automáticamente)
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

## Cargas Asincrónicas (NEW) 🆕

### Usando `notify.loading()` para Operaciones Async

El método `notify.loading()` is perfecto para mostrar un spinner mientras se realiza una operación asincrónica:

#### Carga de Datos (API)

```javascript
async function fetchUserData(userId) {
    // Mostrar spinner
    notify.loading('Obteniendo datos del usuario...', 'Cargando');
    
    try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        
        // Cerrar spinner
        notify.closeLoading();
        
        // Mostrar resultado exitoso
        notify.success(
            `Usuario ${userData.name} cargado correctamente`,
            '¡Éxito!'
        );
        
        return userData;
    } catch (error) {
        // Cerrar spinner
        notify.closeLoading();
        
        // Mostrar error
        notify.error(
            'No se pudieron cargar los datos del usuario',
            'Error de Conexión'
        );
        
        console.error('Error:', error);
    }
}

// Uso
fetchUserData(123);
```

#### Subida de Archivo

```javascript
async function uploadFile(file) {
    // Validar archivo
    if (!file) {
        notify.warning('Por favor selecciona un archivo');
        return;
    }
    
    // Mostrar spinner con mensaje personalizado
    notify.loading(
        'Subiendo tu archivo...',
        `${file.name}`,
        { timer: null }  // No auto-cerrar
    );
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        // Cerrar loading y mostrar éxito
        notify.closeLoading();
        notify.success(
            'Archivo subido correctamente',
            '¡Completado!'
        );
        
        return result;
    } catch (error) {
        // Cerrar loading y mostrar error
        notify.closeLoading();
        notify.error(
            'Error al subir el archivo. Intenta nuevamente.',
            'Error de Carga'
        );
    }
}

// Uso con input file
document.getElementById('fileInput').addEventListener('change', (e) => {
    uploadFile(e.target.files[0]);
});
```

#### Descarga de Archivo

```javascript
async function downloadFile(fileId, fileName) {
    // Mostrar spinner de descarga
    notify.loading(
        'Preparando descarga...',
        'Por favor espera'
    );
    
    try {
        const response = await fetch(`/api/files/${fileId}/download`);
        
        if (!response.ok) {
            throw new Error('Error en la descarga');
        }
        
        const blob = await response.blob();
        
        // Crear URL temporal para descargar
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        
        // Cerrar loading antes de descargar
        notify.closeLoading();
        
        // Iniciar descarga
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Confirmación
        notify.success('Archivo descargado correctamente');
    } catch (error) {
        notify.closeLoading();
        notify.error('Error al descargar el archivo');
    }
}
```

#### Procesamiento de Formulario

```javascript
async function processForm(formData) {
    // Validar datos
    if (!formData.email || !formData.message) {
        notify.warning('Por favor completa todos los campos');
        return;
    }
    
    // Mostrar spinner
    notify.loading('Procesando tu solicitud...', 'Enviando');
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Error en el servidor');
        }
        
        const result = await response.json();
        
        // Cerrar loading
        notify.closeLoading();
        
        // Mostrar éxito y limpiar formulario
        notify.success(
            'Tu solicitud ha sido enviada correctamente',
            '¡Gracias!',
            {
                timer: 3000,
                onClose: () => {
                    document.getElementById('contactForm').reset();
                }
            }
        );
    } catch (error) {
        notify.closeLoading();
        notify.error(
            'Hubo un error al procesar tu solicitud',
            'Error'
        );
    }
}

// Uso
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    processForm({
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    });
});
```

#### Auto-guardado Mejorado

```javascript
let autoSaveTimer;
let isSaving = false;

async function autoSaveDocument(content, documentId) {
    // Evitar guardar múltiples veces simultáneamente
    if (isSaving) return;
    
    clearTimeout(autoSaveTimer);
    
    autoSaveTimer = setTimeout(async () => {
        isSaving = true;
        
        // Mostrar spinner silencioso (sin mensaje, solo indicador visual)
        notify.loading('Guardando cambios...', null, {
            buttonText: 'OK',
            timer: null
        });
        
        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content })
            });
            
            if (!response.ok) {
                throw new Error('Error al guardar');
            }
            
            // Cerrar loading silenciosamente
            notify.closeLoading();
            
            // Mostrar confirmación breve
            notify.success(
                'Cambios guardados',
                null,
                {
                    timer: 1500  // Desaparece automáticamente
                }
            );
        } catch (error) {
            notify.closeLoading();
            notify.warning(
                'No se pudieron guardar los cambios',
                'Error de Guardado'
            );
        } finally {
            isSaving = false;
        }
    }, 3000);  // Guardar 3 segundos después del último cambio
}

// Uso
document.getElementById('editor').addEventListener('input', (e) => {
    autoSaveDocument(e.target.value, 'doc-123');
});
```

### Con Timer Auto-cierre

Si necesitas que el loading se cierre automáticamente después de cierto tiempo:

```javascript
notify.loading('Procesando...', 'Espera', {
    timer: 3000  // Auto-cerrar en 3 segundos
}).then(() => {
    console.log('Loading cerrado automáticamente');
});
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

### `notify.loading(message, title?, options?)` (NEW) 🆕

Muestra un spinner para operaciones asincrónicas. Perfecto para cargas de datos, subidas de archivos, procesamiento de formularios, etc.

```javascript
// Uso básico
notify.loading('Cargando datos...');

// Con título y opciones
notify.loading(
    'Procesando solicitud...',
    'Por favor espera',
    {
        buttonText: 'OK',
        timer: null,           // null = sin auto-cerrar
        onClose: () => { }     // Callback opcional
    }
);

// Con auto-cierre
notify.loading('Guardando...', null, {
    timer: 3000,  // Auto-cierra en 3 segundos
    onClose: () => {
        console.log('Loading completado');
    }
});
```

**Parámetros:**
- `message` (string, requerido): Texto del loading
- `title` (string, opcional): Título del loading
- `options` (object, opcional): Configuración adicional
  - `buttonText`: Texto del botón (default: 'OK')
  - `timer`: Milisegundos antes de auto-cerrar (default: null)
  - `onClose`: Función callback cuando se cierre

**Retorna:** Promise que se resuelve cuando se cierra

### `notify.closeLoading()`

Cierra el loading activo y muestra la siguiente notificación en la cola (si la hay).

```javascript
// En tu función async
notify.loading('Cargando datos...');

try {
    const data = await fetch('/api/data');
    notify.closeLoading();  // Cerrar loading
    notify.success('Datos cargados!');
} catch (error) {
    notify.closeLoading();  // Cerrar loading
    notify.error('Error en la carga');
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
<!-- Incluir Boxicons para los iconos -->
<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">

<!-- Incluir notification-system.js (anime.js se carga automáticamente) -->
<script src="https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js"></script>

<!-- Usar en tu código -->
<script>
    notify.success('¡Sistema listo!');
</script>
```

¡Listo para usar!
