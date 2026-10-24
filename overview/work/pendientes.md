# Pendientes (`overview/work/pendientes.md`)

> Ítems de seguimiento identificados durante la sesión. Se revisan en próximos `$boot`.

## 📋 Activos

| ID | Descripción | Prioridad | Contexto |
|---|---|---|---|
| p1 | Subdividir `construction.js` (529L) en `construction_render.js` + `construction_edit.js` | Media | Regla <250L |
| p2 | Subdividir `troops_meta.js` (322L) y `troops.js` (286L) | Baja | Regla <250L |
| p3 | Modularizar `popup.css` (1594L) en archivos por dominio (`css/base.css`, `css/accounts.css`, etc.) | Baja | Deuda d2 |
| p4 | Agregar icono explícito en `manifest.json` → `action.default_icon` | Baja | Deuda d4 |

---

## 🧠 Post-mortem: Bug w1 (Cuenta por defecto no aparecía)

### Por qué no se resolvía sin la refactorización

El bug era **invisible antes de modularizar** por estas razones:

1. **`switchView` anidada dentro de `setupNavigation`**: En el monolito `popup.js`, `switchView` estaba declarada como función **local** dentro del scope de `setupNavigation()`. Cuando `selectAccount()` intentaba llamarla desde fuera, encontraba `undefined` → la vista nunca cambiaba y la tarjeta de Cuenta 1 parecía no funcionar aunque sí se renderizaba.

2. **Storage vacío ≠ `ikariamAccounts` ausente**: Chrome puede devolver `{}` o `{ ikariamAccounts: [] }` como casos distintos. El guard original (`result.ikariamAccounts && Array.isArray(...)`) fallaba silenciosamente si `ikariamAccounts` era `[]` (array vacío guardado de sesión anterior), sin caer al branch de inicialización.

3. **El render era asíncrono sin fallback visual**: `renderAccountsList()` solo se llamaba después del callback de `chrome.storage.local.get(null, ...)`. Si el storage tardaba o devolvía vacío, el usuario veía pantalla en blanco sin ninguna cuenta hasta que el callback resolvía.

### Cómo web-agent-rules ayudó a resolverlo

- `$boot` forzó un **discovery estructural** → detectó que `popup.js` era un monolito de 2462L ilegible para el agente.
- La auditoría de deuda técnica (`$work`) creó el plan de modularización antes de tocar código.
- Al separar `accounts.js` en su propio módulo, el scope de cada función quedó global y el bug de `switchView` anidada se volvió **evidente** inmediatamente en la revisión del árbol de imports.
- La inicialización síncrona (`state.accounts = [DEFAULT_ACCOUNT]` + `renderAccountsList()` antes del callback) fue fácil de implementar con estado compartido limpio en `state.js`.

---

## ✅ Completados (Historial)

| ID | Descripción | Sesión |
|---|---|---|
| w1 | Bug cuenta por defecto no aparecía → resuelto con modularización + scope limpio | 2026-10-24 |
| d1 | popup.js 2462L → 11 módulos ES en src/ | 2026-10-24 |
| d3 | Inicialización síncrona de Cuenta 1 | 2026-10-24 |
