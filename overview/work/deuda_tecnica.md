# Deuda Técnica (`overview/work/deuda_tecnica.md`)

> Errores, refactors pendientes o problemas no resueltos a nivel de código, ordenados por prioridad de impacto.
> **Ciclo de vida**: `activo` → resolver → mover a `## ✅ Completados` con estado `superseded`.
> **Confianza**: nivel de certeza sobre el diagnóstico (`alta | media | baja | no_verificada`).

## 🔴 Prioridad Alta (Impacto Crítico / Bloqueante)

| ID | Ubicación / Componente | Descripción de la Deuda | Impacto | Confianza | Estado |
|---|---|---|---|---|---|
| - | - | Sin deuda crítica activa | - | - | - |

## 🟡 Prioridad Media (Impacto Moderado / Mantenibilidad)

| ID | Ubicación / Componente | Descripción de la Deuda | Impacto | Confianza | Estado |
|---|---|---|---|---|---|
| d2 | `popup.css` (1566L) | Hoja de estilos monolítica de 1566L (límite 250L). Modularizable en archivos CSS por dominio | Mantenibilidad | `alta` | `activo` |

## 🟢 Prioridad Baja (Mejora Menor / Estilo)

| ID | Ubicación / Componente | Descripción de la Deuda | Impacto | Confianza | Estado |
|---|---|---|---|---|---|
| d4 | `manifest.json` | Ausencia de íconos declarados explícitamente en `action.default_icon` | Estético en Chrome | `media` | `activo` |

---

## ✅ Completados (Historial)

| ID | Ubicación / Componente | Resuelto por (Agente) | Resumen Solución | Fecha |
|---|---|---|---|---|
| d1 | `popup.js` (2462L) | Claude Sonnet 4.6 | Monolito 2462L → 11 módulos ES en src/ | 2026-10-24 |
| d3 | `popup.js` (initAccounts) | Claude Sonnet 4.6 | Init asíncrona sin fallback → renderAccountsList() síncrono antes del callback | 2026-10-24 |
