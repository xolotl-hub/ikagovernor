# ⚔️ Módulo Militar (Tropas & Barcos) — Ika Governor

> Especificación técnica del seguimiento de ejércitos, flotas, metas globales y cálculo de déficits.

---

## 1. Archivos del Módulo

- **Vista Principal:** [src/views/troops.js](file:///c:/Users/termo/Documents/GitHub/ikagovernor/src/views/troops.js) (Pestañas de colonias, inventario de unidades y cálculo de materiales faltantes).
- **Controlador de Metas y Modales:** [src/views/troops_meta.js](file:///c:/Users/termo/Documents/GitHub/ikagovernor/src/views/troops_meta.js) (Panel global multi-ciudad, modal de alta y modal de actualización rápida).
- **Catálogo de Tropas:** [src/constants.js](file:///c:/Users/termo/Documents/GitHub/ikagovernor/src/constants.js) (`TROOP_DEFINITIONS.units` y `TROOP_DEFINITIONS.ships`).

---

## 2. Diagrama de Interacción Militar

```mermaid
graph TD
    classDef ui fill:#e65100,stroke:#fff,color:#fff;
    classDef modal fill:#1565c0,stroke:#fff,color:#fff;
    classDef calc fill:#2e7d32,stroke:#fff,color:#fff;

    TroopsTab[Pestaña Tropas]:::ui --> CitySelect[Selección de Ciudad Activa]:::ui
    CitySelect --> RenderGrid[Render Unidades & Barcos Registrados]:::ui
    
    RenderGrid --> CalcDeficit[Déficit = Math.max 0, meta - real]:::calc
    CalcDeficit --> ResChips[Chips de Madera / Azufre / Cristal / Vino]
    
    BtnAdd[+ Añadir]:::ui --> ModalAdd[openAddTroopsModal: Catálogo Completo]:::modal
    BtnUpd[⚡ Actualizar]:::ui --> ModalUpd[openUpdateTroopsModal: Quedan post-combate]:::modal
    BtnGlobalMeta[🎯 Metas Globales]:::ui --> PanelMeta[openMetaPanel: Asignación masiva multi-ciudad]:::modal
    
    ModalAdd --> Save[saveTroopsData]
    ModalUpd --> Save
    PanelMeta --> Save
```

---

## 3. Seguridad DOM
Todas las filas dinámicas de tropas, modales y tarjetas se construyen mediante `document.createElement` e interpolación segura con `textContent` y `makeResChip()`, asegurando total conformidad con las políticas de Mozilla AMO.
