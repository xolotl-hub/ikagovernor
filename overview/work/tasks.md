# Tarea Activa (`overview/work/tasks.md`)

> Espacio de trabajo activo para la tarea en ejecución. Escribir aquí antes de modificar código.

## 🎯 Tarea Actual

- **ID:** `w2`
- **Descripción:** Factorización modular completa de popup.js (2462L) a arquitectura ES Modules (<250L por archivo)
- **Estado:** `activo`
- **Confianza:** `alta`
- **Agente:** `Gemini 2.5 Pro (via Antigravity IDE)`
- **Fecha inicio:** `2026-10-24`

## 🏷️ Clasificación

- [ ] **Problema** (comportamiento inesperado o falla)
- [ ] **Mejora** (optimización o evolución funcional)
- [x] **Refactor** (reestructuración sin cambio de comportamiento)

## 🛤️ Rutas de Trabajo y Posibles Soluciones

### Diagnóstico
Monolito `popup.js` de 2462L con funciones mal anidadas (`setupNavigation` / `switchView`) que rompían la ejecución en tiempo de carga en Chrome.

### Arquitectura ES Modules Modular (<250L por archivo)
1. `src/constants.js` (~80L) - Datos fijos de Ikariam (edificios, tropas, costos, cuenta inicial).
2. `src/state.js` (~50L) - Estado compartido reactivo de la sesión.
3. `src/storage.js` (~150L) - Adaptador `chrome.storage.local` y migraciones legacy.
4. `src/views/accounts.js` (~170L) - Selector de cuentas, modales de alta/baja y render inmediato de Cuenta 1.
5. `src/views/construction.js` (~240L) - Vista de construcción, tabs de edificios, checkpoints y costos.
6. `src/views/troops.js` (~240L) - Simulador de tropas, tabs por ciudad y panel global de metas.
7. `src/views/summary.js` (~180L) - Resumen de las próximas 6 construcciones prioritarias.
8. `src/views/settings.js` (~140L) - Renombrar ciudades, exportar e importar JSON.
9. `src/main.js` (~60L) - Router de vistas (`switchView`) y bootstrap de eventos.
10. `popup.html` - Carga `<script type="module" src="src/main.js"></script>`.
