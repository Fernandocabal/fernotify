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

// Copiar archivos a docs/dist para Cloudflare Pages
const DOCS_DIST_DIR = path.join(__dirname, 'docs', 'dist');
if (!fs.existsSync(DOCS_DIST_DIR)) {
    fs.mkdirSync(DOCS_DIST_DIR, { recursive: true });
    console.log('✅ Directorio docs/dist/ creado');
}

// Copiar todos los archivos de dist a docs/dist
[UMD_FILE, UMD_MIN_FILE, ESM_FILE, ESM_MIN_FILE].forEach(file => {
    const filename = path.basename(file);
    const destFile = path.join(DOCS_DIST_DIR, filename);
    fs.copyFileSync(file, destFile);
    console.log(`📋 Copiado a docs/dist/${filename}`);
});

console.log(`\n📦 Build completado - v${getVersion()}`);


function createESMVersion(sourceCode) {
    // Crear una versión ESM que importe el código UMD y reexporte la clase

    return `/**
 * FerNotify — Sistema de Notificaciones Modernas (ESM)
 * Librería ligera de notificaciones con animaciones fluidas y cero dependencias externas.
 * v2.0.0+ no requiere anime.js ni Boxicons.
 *
 * Uso:
 * import NotificationSystem from 'fernotify';
 * const notify = new NotificationSystem();
 * notify.success('¡Hola!');
 */

// Ejecutar el código UMD para registrar window.notify
${sourceCode}

// Extraer la clase desde la instancia global
const NotificationSystem = window.notify?.constructor || function() {
    throw new Error('FerNotify: no se pudo inicializar NotificationSystem.');
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
