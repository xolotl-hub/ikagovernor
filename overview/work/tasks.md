# Tarea Activa (`overview/work/tasks.md`)

> Espacio de trabajo activo para la tarea en ejecución. Escribir aquí antes de modificar código.

## 🎯 Tarea Actual

- **ID:** `w2`
- **Descripción:** Resolver inicialización inmediata de Cuenta 1 (d3) y planificar modularización de popup.js (d1: 2462L) y popup.css (d2: 1594L)
- **Estado:** `activo`
- **Confianza:** `alta`
- **Agente:** `Gemini 2.5 Pro (via Antigravity IDE)`
- **Fecha inicio:** `2026-10-24`

## 🏷️ Clasificación

- [x] **Problema** (comportamiento inesperado o falla)
- [ ] **Mejora** (optimización o evolución funcional)
- [x] **Refactor** (reestructuración sin cambio de comportamiento)

## 🛤️ Rutas de Trabajo y Posibles Soluciones

### Diagnóstico de Deuda Técnica
1. `popup.js` tiene **2462 líneas** (regla canónica: máximo 250L - 300L).
2. `popup.css` tiene **1594 líneas** (regla canónica: máximo 250L).
3. La cuenta inicial depende de resolución de storage sin fallback reactivo visible en pantalla.

### Fases de Ejecución
1. **Fase 1 (Inmediata / Funcional):** Resolver aparición síncrona inmediata de `Cuenta 1` con su botón `[ Entrar ➜ ]` al abrir la extensión.
2. **Fase 2 (Refactor JS):** Modularizar `popup.js` separando:
   - `src/constants.js` (<100L)
   - `src/storage.js` (<150L)
   - `src/views/accounts.js` (<200L)
   - `src/views/construction.js` (<250L)
   - `src/views/troops.js` (<250L)
   - `src/views/summary.js` (<200L)
   - `src/views/settings.js` (<150L)
3. **Fase 3 (Refactor CSS):** Modularizar `popup.css` en `css/` mediante `@import` o `<link>`.
