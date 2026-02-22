#!/usr/bin/env node

/**
 * Build script para FerNotify
 * Copia notification-system.js a dist/ con formatos UMD y ESM
 * Genera versiones minificadas (.min.js)
 */

const fs = require('fs');
const path = require('path');
const terser = require('terser');

const SOURCE = path.join(__dirname, 'notification-system.js');
const DIST_DIR = path.join(__dirname, 'dist');
const UMD_FILE = path.join(DIST_DIR, 'notification-system.js');
const UMD_MIN_FILE = path.join(DIST_DIR, 'notification-system.min.js');
const ESM_FILE = path.join(DIST_DIR, 'notification-system.esm.js');
const ESM_MIN_FILE = path.join(DIST_DIR, 'notification-system.esm.min.js');

// Crear directorio dist si no existe
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
    console.log('✅ Directorio dist/ creado');
}

// Leer archivo fuente
const sourceCode = fs.readFileSync(SOURCE, 'utf-8');

// Escribir versión UMD (tal cual, con IIFE auto-ejecutable)
fs.writeFileSync(UMD_FILE, sourceCode, 'utf-8');
console.log(`✅ ${UMD_FILE} generado (UMD - auto-ejecutable)`);

// Minificar versión UMD
minifyFile(sourceCode, UMD_MIN_FILE, 'UMD');

// Crear versión ESM
const esmCode = createESMVersion(sourceCode);
fs.writeFileSync(ESM_FILE, esmCode, 'utf-8');
console.log(`✅ ${ESM_FILE} generado (ESM - exportable)`);

// Minificar versión ESM
minifyFile(esmCode, ESM_MIN_FILE, 'ESM');

console.log(`\n📦 Build completado - v${getVersion()}`);


function createESMVersion(sourceCode) {
    // Crear una versión ESM que importe el código UMD y reexporte la clase

    return `/**
 * Sistema de Notificaciones Modernas (ESM)
 * Librería ligera de notificaciones con animaciones fluidas
 * 
 * RECOMENDADO: Cargar dependencias antes de importar:
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"><\/script>
 * <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css">
 * 
 * Uso:
 * import NotificationSystem from '@fernandocabal/fernotify';
 * const notify = new NotificationSystem();
 * notify.success('¡Hola!');
 */

// Importar el código UMD y ejecutarlo para generar window.notify
${sourceCode}

// Extraer la clase desde la instancia global
const NotificationSystem = window.notify?.constructor || function() {
    throw new Error('NotificationSystem no se pudo cargar. Verifica que anime.js esté disponible.');
};

// Reexportar para módulos ESM
export default NotificationSystem;
export { NotificationSystem };

// La instancia global también está disponible como window.notify
`;
}

async function minifyFile(code, outputFile, type) {
    try {
        const result = await terser.minify(code, {
            compress: {
                drop_console: false,
                passes: 2
            },
            mangle: true,
            output: {
                comments: /^!/
            }
        });

        if (result.error) {
            console.error(`❌ Error minificando ${type}:`, result.error);
            return;
        }

        fs.writeFileSync(outputFile, result.code, 'utf-8');
        const originalSize = (code.length / 1024).toFixed(2);
        const minSize = (result.code.length / 1024).toFixed(2);
        const reduction = (((code.length - result.code.length) / code.length) * 100).toFixed(1);

        console.log(`✅ ${outputFile} generado (${type} - Minificado)`);
        console.log(`   Tamaño: ${originalSize}KB → ${minSize}KB (${reduction}% reducido)`);
    } catch (err) {
        console.error(`❌ Error al minificar ${type}:`, err.message);
    }
}

function getVersion() {
    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
        return pkg.version;
    } catch {
        return 'unknown';
    }
}
