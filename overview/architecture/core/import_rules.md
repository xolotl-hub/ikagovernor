# 📏 Reglas de Importación y Dependencias entre Capas — Ika Governor

> Convenciones estrictas para evitar dependencias circulares y mantener modularidad en ES Modules.

---

## 1. Jerarquía de Capas

```
┌────────────────────────────────────────────────────────┐
│ 1. Presentation Shell: popup.html / popup.css          │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│ 2. App Router / Orchestrator: src/main.js              │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│ 3. Views Modules: src/views/*.js                       │
└─────────────▲────────────────────────────▲─────────────┘
              │                            │
┌─────────────┴──────────────┐ ┌───────────┴─────────────┐
│ 4. Domain & Calculations   │ │ 5. Infrastructure       │
│    src/constants.js        │ │    src/storage.js       │
│    src/views/calc.js       │ └─────────────────────────┘
└─────────────▲──────────────┘             ▲
              │                            │
┌─────────────┴────────────────────────────┴─────────────┐
│ 6. Central State Store: src/state.js                   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Reglas Canónicas de Importación

1. **Inmutabilidad de Dirección:**
   - Capas inferiores **NUNCA** deben importar de capas superiores.
   - `src/state.js` solo exporta estructuras primitivas y utilidades de render (`makeResChip`, `formatResNum`). No importa vistas ni storage.
   - `src/constants.js` es puramente declarativo y no tiene dependencias.
2. **Comunicación entre Vistas:**
   - Las vistas no deben importar funciones que provoquen ciclos directos.
   - Si una vista necesita disparar la actualización de otra (ej. actualizar tropas desde construcción o refrescar el resumen desde tropas), se utilizan **Callbacks Inyectados** (ej. `setOnSummaryRefreshForTroops(fn)` y `setOnTroopsChanged(fn)`).
3. **Manipulación Segura del DOM:**
   - Prohibido el uso de `innerHTML` con valores dinámicos. Usar `document.createElement`, `textContent`, `append`, `replaceChildren()` y `makeResChip()`.
