# Tarea Activa (`overview/work/tasks.md`)

> Espacio de trabajo activo para la tarea en ejecución. Escribir aquí antes de modificar código.

## 🎯 Tarea Actual

- **ID:** `w6`
- **Descripción:** Remoción de `innerHTML` inseguro (25 avisos de linter Mozilla) y alineación de `strict_min_version` 142.0
- **Estado:** `hecho`
- **Confianza:** `alta`
- **Agente:** `Gemini 3.8 Flash (via Antigravity IDE)`
- **Fecha inicio:** `2026-10-26`

## 🏷️ Clasificación

- [x] **Problema** (comportamiento inesperado o falla de validación)
- [x] **Mejora** (seguridad DOM y compatibilidad estricta con AMO)
- [ ] **Refactor** (reestructuración sin cambio de comportamiento)

## 🛤️ Rutas de Trabajo y Posibles Soluciones

### Diagnóstico & Hipótesis Causa Raíz
> **Hipótesis causa raíz:** Linter de AMO prohíbe innerHTML dinámico. (6 palabras)

El validador de addons de Mozilla Firefox detectó 25 advertencias por `Unsafe assignment to innerHTML` con variables interpoladas en las vistas (`construction.js`, `summary.js`, `troops.js`, `troops_meta.js`, `settings.js`, `accounts.js`), además del desfase de versión mínima para Android con `data_collection_permissions`.

### Solución Ejecutada
1. **Manifest Firefox & Manifest Activo:** Se fijó `strict_min_version: "142.0"` y `data_collection_permissions: { required: ["none"], optional: [] }`, eliminando el aviso de compatibilidad en Android.
2. **DOM Seguro:** Se reemplazó el 100% de los `innerHTML` con `document.createElement`, `textContent`, `append`/`appendChild` y `makeResChip` en todas las vistas (`troops.js`, `troops_meta.js`, `summary.js`, `construction.js`, `settings.js`, `accounts.js`).
3. **Limpieza de Contenedores:** Se reemplazó `element.innerHTML = ''` por el estándar moderno `element.replaceChildren()`, evitando falsos positivos de escaneo estático.
4. **Re-empaquetado:** Se generaron los nuevos paquetes `.zip` en `dist/` limpios y sin advertencias de linteo.
