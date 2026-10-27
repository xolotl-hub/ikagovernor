# 🔄 Flujo de Datos, Estado y Persistencia — Ika Governor

> Especificación del ciclo de vida de los datos, estado global reactivo y persistencia multi-navegador.

---

## 1. Diagrama de Flujo de Datos

```mermaid
graph TD
    classDef storage fill:#1565c0,stroke:#fff,color:#fff;
    classDef state fill:#2e7d32,stroke:#fff,color:#fff;
    classDef view fill:#e65100,stroke:#fff,color:#fff;

    StorageApi[(Browser Storage: chrome / browser.storage.local)]:::storage
    StorageModule[src/storage.js]:::storage
    StateStore[src/state.js: Singleton 'state']:::state
    ViewsLayer[src/views/*]:::view
    DOMEvents[User UI Events: inputs, clicks, drag]

    StorageApi -- Lectura inicial asíncrona --> StorageModule
    StorageModule -- Hidrata objeto --> StateStore
    StateStore -- Renderiza estado en vivo --> ViewsLayer
    DOMEvents -- Mutación controlada --> ViewsLayer
    ViewsLayer -- Actualiza propiedades --> StateStore
    ViewsLayer -- saveCurrentAccountBundle / saveTroopsData --> StorageModule
    StorageModule -- Escritura serializada --> StorageApi
```

---

## 2. Modelo de Estado Global (`src/state.js`)

El estado en memoria está centralizado en un singleton exportado `state` que contiene:

```javascript
export const state = {
  accounts: [],              // Lista de cuentas registradas [{id, name, world}]
  currentAccount: null,      // Cuenta activa actual
  cities: [],                // Array de IDs de ciudades de la cuenta activa
  cityLabels: {},            // Diccionario de metadatos { [cityId]: { name, abbr } }
  buildingsConfig: [],       // Lista de edificios con metas (meta1..meta6) y niveles por ciudad
  currentBuilding: null,     // Edificio seleccionado en la vista de construcción
  troopsData: {              // Registro militar
    activeTroopCity: null,
    cities: { [cityId]: { units: {}, ships: {} } }
  },
  isMetaPanelOpen: false,    // Estado del panel lateral de metas militares
  selectedMetaCities: new Set(),
  metaPanelInputs: { units: {}, ships: {} }
};
```

---

## 3. Persistencia Multi-Cuenta y Migración (`src/storage.js`)

- **Espacio de Nombres por Cuenta:** Cada cuenta persiste bajo la clave `ikagovernor_data_<accountId>`.
- **Índice Global de Cuentas:** Clave `ikagovernor_accounts` almacena el catálogo de perfiles.
- **Cuenta por Defecto:** Clave `ikagovernor_current_account` recuerda la última cuenta abierta para inicialización síncrona/rápida.
- **Migración Heredada (Legacy Fallback):** Si se detectan claves antiguas (`ikagovernor_cities`, `ikagovernor_troops`, etc.), se importan automáticamente a la cuenta por defecto `acc_default` sin pérdida de datos.
- **Seguridad en Escritura:** Todas las llamadas a `storage.local.set` encapsulan bundles completos para prevenir escrituras parciales o estados corruptos.
