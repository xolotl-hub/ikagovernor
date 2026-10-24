# Trabajo: índice maestro y backlog canónico

> **Backlog canónico único.** Concentra los IDs de `tarea`, `bug` y `deuda`. El detalle se distribuye en `overview/work/tasks.md` (tarea activa), `overview/work/pendientes.md` (seguimiento) y `overview/work/deuda_tecnica.md` (deuda ordenada por prioridad Alta/Media/Baja).

| ID | Tipo | Estado | Resumen | Archivo de Detalle |
|---|---|---|---|---|
| w1 | bug | pendiente | Cuenta por default no aparece en selector de inicio | `work/tasks.md` |
| w2 | deuda | en progreso | Modularización de monolito popup.js (2462L) y popup.css (1594L) | `work/tasks.md` |
| d1 | deuda | pendiente | popup.js supera límite (2462L > 250L) | `work/deuda_tecnica.md` |
| d2 | deuda | pendiente | popup.css supera límite (1594L > 250L) | `work/deuda_tecnica.md` |
| d3 | deuda | en progreso | Saneamiento inicialización síncrona de cuenta default | `work/deuda_tecnica.md` |
| d4 | deuda | pendiente | manifest.json sin iconos explícitos en action | `work/deuda_tecnica.md` |

Tipos: `tarea`, `bug`, `deuda`. Estados: `pendiente`, `en progreso`, `bloqueado`, `hecho`, `no verificado`.

---

## ✅ Completados (Historial)

| ID | Tipo | Resuelto por (Agente) | Causa Raíz / Resumen Solución | Fecha |
|---|---|---|---|---|

---

## 📋 Historial de Intentos

### [w2] Deuda técnica de líneas y modularización (d1, d2, d3)

| Fecha | Agente | Intento | Resultado |
|---|---|---|---|
| 2026-10-24 | Gemini 2.5 Pro (via Antigravity IDE) | Auditoría de líneas (>250L), detección de monolitos y mapeo de fases de refactor | en progreso |
