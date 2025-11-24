# 🚀 Guía de Despliegue

## Paso 1: Subir a GitHub

### Inicializar Git y Subir

```powershell
# Navegar a la carpeta del proyecto
cd c:\xampp\htdocs\utils

# Inicializar repositorio
git init

# Añadir archivos
git add .

# Primer commit
git commit -m "Initial commit: Notification System v1.0.0"

# Crear branch main
git branch -M main

# Conectar con GitHub (reemplaza Fernandocabal y TU_REPO)
git remote add origin git@github.com:Fernandocabal/fernotify.git

# Subir a GitHub
git push -u origin main

# Crear tag para la primera versión
git tag v1.0.0
git push origin v1.0.0
```

### Crear el Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `notification-system`
3. Descripción: `Sistema moderno de notificaciones con Dark Mode y animaciones fluidas`
4. Público ✅
5. NO inicialices con README (ya lo tienes)
6. Crea el repositorio
7. Copia la URL: `https://github.com/Fernandocabal/notification-system.git`

## Paso 2: Configurar Cloudflare Pages

### Opción A: Conectar desde Dashboard

1. Ve a https://dash.cloudflare.com/
2. Selecciona tu cuenta
3. Pages → Create a project
4. Connect to Git → Selecciona tu repo `notification-system`
5. Configuración del build:
   - **Project name**: `notification-system` (o el que prefieras)
   - **Production branch**: `main`
   - **Build command**: (dejar vacío)
   - **Build output directory**: `docs`
6. Click en "Save and Deploy"

### Opción B: CLI de Wrangler (Opcional)

```powershell
# Instalar Wrangler globalmente (requiere Node.js)
npm install -g wrangler

# Autenticar
wrangler login

# Desplegar desde la carpeta docs
cd docs
wrangler pages deploy . --project-name=notification-system
```

## Paso 3: Configurar Dominio Personalizado

### En Cloudflare Pages:

1. Ve a tu proyecto en Pages
2. Custom domains → Set up a custom domain
3. Añade tu dominio `.dev`
4. Cloudflare configurará automáticamente el DNS

### URLs Resultantes:

- **Demo**: `https://tu-dominio.dev` o `https://notification-system.pages.dev`
- **CDN UMD**: `https://cdn.jsdelivr.net/gh/Fernandocabal/notification-system@latest/dist/notification-system.js`
- **CDN ESM**: `https://cdn.jsdelivr.net/gh/Fernandocabal/notification-system@latest/dist/notification-system.esm.js`

## Paso 4: Verificar jsDelivr

Después de subir a GitHub, jsDelivr puede tardar unos minutos en indexar tu repo. Verifica en:

```
https://cdn.jsdelivr.net/gh/Fernandocabal/notification-system@latest/
```

Deberías ver:
- `dist/notification-system.js`
- `dist/notification-system.esm.js`

## Paso 5: Actualizar URLs en README.md

Una vez que tengas tu usuario de GitHub y dominio de Cloudflare, actualiza:

1. `README.md` - Reemplaza `Fernandocabal` y `TU_DOMINIO`
2. `docs/index.html` - Si quieres que el hero apunte a la demo real

```powershell
# Buscar y reemplazar (PowerShell)
(Get-Content README.md) -replace 'Fernandocabal', 'tu-usuario-real' | Set-Content README.md
(Get-Content README.md) -replace 'TU_DOMINIO', 'tu-dominio' | Set-Content README.md

# Commit y push
git add README.md
git commit -m "Update URLs with real values"
git push
```

## Paso 6: Crear Nuevas Versiones

Cuando hagas cambios importantes:

```powershell
# Hacer cambios en el código
# ...

# Commit
git add .
git commit -m "feat: nueva funcionalidad X"

# Crear nueva versión
git tag v1.1.0
git push origin main
git push origin v1.1.0
```

Los usuarios pueden elegir:
- `@latest` - siempre la última versión
- `@1.1.0` - versión fija (recomendado en producción)

## Estructura Final

```
notification-system/
├── dist/
│   ├── notification-system.js       UMD para CDN
│   └── notification-system.esm.js   ES Module para CDN
├── docs/
│   ├── index.html                   Demo (Cloudflare Pages)
│   └── assets/
│       └── demo.js
├── .gitignore
├── LICENSE
├── README.md
├── NOTIFICATION_SYSTEM_GUIDE.md
└── DEPLOY.md                        (este archivo)
```

## Comandos Útiles

```powershell
# Ver estado
git status

# Ver ramas
git branch -a

# Ver tags
git tag -l

# Ver remotes
git remote -v

# Pull cambios
git pull origin main

# Ver historial
git log --oneline --graph
```

## Solución de Problemas

### jsDelivr no muestra mis archivos

- Espera 5-10 minutos después del push
- Verifica que el tag esté en GitHub: `https://github.com/Fernandocabal/fernotify/tags`
- Purga el cache: `https://purge.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js`

### Cloudflare Pages no despliega

- Verifica que el directorio de build sea `docs`
- Revisa los logs en el dashboard de Cloudflare Pages
- Asegúrate de que `docs/index.html` exista en el repo

### Las rutas no funcionan localmente

Para probar localmente la estructura final:

```powershell
cd c:\xampp\htdocs\utils\docs
python -m http.server 8000
```

Abre: `http://localhost:8000`

---

¡Listo! Tu sistema de notificaciones está servido vía CDN y con demo profesional en Cloudflare Pages.
