# Deuda Técnica (`overview/work/deuda_tecnica.md`)

> Errores, refactors pendientes o problemas no resueltos a nivel de código, ordenados por prioridad de impacto.
> **Ciclo de vida**: `activo` → resolver → mover a `## ✅ Completados` con estado `superseded`.
> **Confianza**: nivel de certeza sobre el diagnóstico (`alta | media | baja | no_verificada`).

## 🔴 Prioridad Alta (Impacto Crítico / Bloqueante)

| ID | Ubicación / Componente | Descripción de la Deuda | Impacto | Confianza | Estado |
|---|---|---|---|---|---|
| d1 | `popup.js` (2462L) | Monolito de 2462L (límite 250L). Concentra lógica de 8 dominios (cuentas, storage, construcción, tropas, resumen, config, modales, navegación) | Crítico (Mantenibilidad / Tokens) | `alta` | `activo` |
| d3 | `popup.js` (initAccounts) | Inicialización asíncrona de cuenta default propensa a vacíos en primer arranque | Funcional (Acceso de usuario) | `alta` | `en progreso` |

## 🟡 Prioridad Media (Impacto Moderado / Mantenibilidad)

| ID | Ubicación / Componente | Descripción de la Deuda | Impacto | Confianza | Estado |
|---|---|---|---|---|---|
| d2 | `popup.css` (1594L) | Hoja de estilos monolítica de 1594L (límite 250L). Modularizable en archivos CSS por dominio | Mantenibilidad | `alta` | `activo` |

## 🟢 Prioridad Baja (Mejora Menor / Estilo)

| ID | Ubicación / Componente | Descripción de la Deuda | Impacto | Confianza | Estado |
|---|---|---|---|---|---|
| d4 | `manifest.json` | Ausencia de íconos declarados explícitamente en `action.default_icon` | Estético en Chrome | `media` | `activo` |

---

## ✅ Completados (Historial)
