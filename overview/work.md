# Trabajo: índice maestro y backlog canónico

> **Backlog canónico único.**

| ID | Tipo | Estado | Resumen | Archivo de Detalle |
|---|---|---|---|---|
| w2 | deuda | pendiente | Subdividir construction.js (493L), troops_meta.js (267L), troops.js (251L) | `work/pendientes.md` |
| d2 | deuda | pendiente | popup.css (1566L) modularizar en css/ | `work/deuda_tecnica.md` |
| d4 | deuda | pendiente | manifest.json sin icono en action | `work/deuda_tecnica.md` |

Tipos: `tarea`, `bug`, `deuda`. Estados: `pendiente`, `en progreso`, `bloqueado`, `hecho`, `no verificado`.

---

## ✅ Completados (Historial)

| ID | Tipo | Resuelto por (Agente) | Causa Raíz / Resumen Solución | Fecha |
|---|---|---|---|---|
| w6 | mejora | Gemini 3.8 Flash | Remoción 100% de `innerHTML` inseguro en vistas (`troops`, `troops_meta`, `summary`, `construction`, `settings`, `accounts`) por DOM seguro (`createElement`, `replaceChildren`) + manifest Firefox Android `strict_min_version: 142.0` | 2026-10-26 |
| w5 | bug | Gemini 3.8 Flash | Compress-Archive generaba backslashes `\` en entradas del zip. Resuelto usando .NET `ZipArchive` forzando forward slashes `/` (POSIX) | 2026-10-26 |
| w4 | tarea | Gemini 3.8 Flash | Script empaquetador build-package (.ps1/.bat) con whitelist estricta a dist/ (excluye dev/docs/legacy) | 2026-10-26 |
| w3 | mejora | Gemini 3.8 Flash | Manifests dedicados (Chrome con sidePanel, Firefox con gecko ID y sidebar_action) + scripts switch-manifest (.ps1/.bat) | 2026-10-26 |
| w1 | bug | Gemini 2.5 Pro / Claude Sonnet 4.6 | `switchView` anidada en `setupNavigation` → scope invisible + storage vacío sin fallback. Resuelto con modularización ES + `DEFAULT_ACCOUNT` síncrono | 2026-10-24 |
| d1 | deuda | Claude Sonnet 4.6 | Monolito 2462L → 11 módulos en src/ | 2026-10-24 |
| d3 | deuda | Claude Sonnet 4.6 | Init asíncrona sin fallback → `renderAccountsList()` síncrono antes del callback | 2026-10-24 |

---

## 📋 Historial de Intentos

### [w5] Separadores backslash en ZIP (Firefox Invalid file name)

| Fecha | Agente | Intento | Resultado |
|---|---|---|---|
| 2026-10-26 | Gemini 3.8 Flash | Reemplazar Compress-Archive por .NET ZipArchive con forward slashes | ✅ exitoso |

### [w1] Cuenta por defecto no aparecía

| Fecha | Agente | Intento | Resultado |
|---|---|---|---|
| 2026-10-23 | Gemini 2.5 Pro | Botón Entrar, manifest MV3, DEFAULT_ACCOUNT en init | parcial — renderizaba pero no navegaba |
| 2026-10-24 | Claude Sonnet 4.6 | Modularización ES → scope limpio de switchView | ✅ exitoso |
