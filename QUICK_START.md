# 🚀 Comandos Rápidos - Quick Start

## Inicializar y Subir a GitHub (Primera Vez)

```powershell
cd c:\xampp\htdocs\utils

git init
git add .
git commit -m "Initial commit: Notification System v1.0.0"
git branch -M main
git remote add origin git@github.com:Fernandocabal/fernotify.git
git push -u origin main
git tag v1.0.0
git push origin v1.0.0
```

## Actualizar Después de Cambios

```powershell
# Copiar cambios a dist (si modificaste notification-system.js)
Copy-Item notification-system.js dist/
Copy-Item notification-system.js dist/notification-system.esm.js

# Actualizar docs/index.html si modificaste notificaciones.html
Copy-Item notificaciones.html docs/index.html

# Commit y push
git add .
git commit -m "Descripción de cambios"
git push
```

## Crear Nueva Versión

```powershell
git tag v1.1.0
git push origin v1.1.0
```

## Probar Localmente

```powershell
cd docs
python -m http.server 8000
# Abrir: http://localhost:8000
```

## Ver Estado

```powershell
git status
git log --oneline --graph -10
git tag -l
```

## URLs de Tu Proyecto

Después de deployar, actualiza estas URLs en tus archivos:

**Demo:**
```
https://tu-dominio.dev
```

**CDN UMD:**
```
https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js
```

**CDN ESM:**
```
https://cdn.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.esm.js
```

## Buscar y Reemplazar URLs

```powershell
# Reemplazar TU_USUARIO con tu usuario real
(Get-Content README.md) -replace 'TU_USUARIO', 'tu-usuario-github' | Set-Content README.md

# Reemplazar TU_DOMINIO con tu dominio real
(Get-Content README.md) -replace 'TU_DOMINIO', 'tu-dominio' | Set-Content README.md

# Commit
git add README.md
git commit -m "Update URLs"
git push
```

## Purgar Cache de jsDelivr

Si hiciste cambios y jsDelivr no los muestra:

```
https://purge.jsdelivr.net/gh/Fernandocabal/fernotify@latest/dist/notification-system.js
```

---

**Tip:** Guarda este archivo en tus marcadores para referencia rápida.
