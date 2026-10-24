# Trabajo: índice maestro y backlog canónico

> **Backlog canónico único.**

| ID | Tipo | Estado | Resumen | Archivo de Detalle |
|---|---|---|---|---|
| w2 | deuda | pendiente | Subdividir construction.js (529L), troops_meta.js (322L), troops.js (286L) | `work/pendientes.md` |
| d2 | deuda | pendiente | popup.css (1594L) modularizar en css/ | `work/deuda_tecnica.md` |
| d4 | deuda | pendiente | manifest.json sin icono en action | `work/deuda_tecnica.md` |

Tipos: `tarea`, `bug`, `deuda`. Estados: `pendiente`, `en progreso`, `bloqueado`, `hecho`, `no verificado`.

---

## ✅ Completados (Historial)

| ID | Tipo | Resuelto por (Agente) | Causa Raíz / Resumen Solución | Fecha |
|---|---|---|---|---|
| w1 | bug | Gemini 2.5 Pro / Claude Sonnet 4.6 | `switchView` anidada en `setupNavigation` → scope invisible + storage vacío sin fallback. Resuelto con modularización ES + `DEFAULT_ACCOUNT` síncrono | 2026-10-24 |
| d1 | deuda | Claude Sonnet 4.6 | Monolito 2462L → 11 módulos en src/ | 2026-10-24 |
| d3 | deuda | Claude Sonnet 4.6 | Init asíncrona sin fallback → `renderAccountsList()` síncrono antes del callback | 2026-10-24 |

---

## 📋 Historial de Intentos

### [w1] Cuenta por defecto no aparecía

| Fecha | Agente | Intento | Resultado |
|---|---|---|---|
| 2026-10-23 | Gemini 2.5 Pro | Botón Entrar, manifest MV3, DEFAULT_ACCOUNT en init | parcial — renderizaba pero no navegaba |
| 2026-10-24 | Claude Sonnet 4.6 | Modularización ES → scope limpio de switchView | ✅ exitoso |
