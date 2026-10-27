# 🏛️ Módulo de Cuentas & Multi-Entorno — Ika Governor

> Especificación técnica de gestión multi-servidor/mundo, conmutación de cuentas y persistencia aislada.

---

## 1. Archivos del Módulo

- **Controlador UI:** [src/views/accounts.js](file:///c:/Users/termo/Documents/GitHub/ikagovernor/src/views/accounts.js) (Lista de cuentas, modal de alta, confirmación de eliminación).
- **Servicio de Persistencia:** [src/storage.js](file:///c:/Users/termo/Documents/GitHub/ikagovernor/src/storage.js) (Aislamiento de bundles por `accountId`).

---

## 2. Flujo de Autenticación y Selección de Cuenta

```mermaid
graph TD
    classDef ui fill:#e65100,stroke:#fff,color:#fff;
    classDef storage fill:#1565c0,stroke:#fff,color:#fff;

    OpenExt[Apertura de la Extensión] --> LoadAccList[loadAccountData / findLegacyData]:::storage
    LoadAccList --> HasCurrent{¿Hay currentAccount persistida?}
    
    HasCurrent -- Sí --> AutoOpen[Hidratación directa y apertura de app-main-container]
    HasCurrent -- No --> ShowSelector[Mostrar view-accounts: Lista de Cuentas]:::ui
    
    ShowSelector --> UserClick[Click en 'Entrar' de una cuenta]:::ui
    UserClick --> SwitchAcc[selectAccount: swap de estado y persistencia]
    SwitchAcc --> RefreshViews[Refresca Construcción, Tropas, Resumen, Configuración]
    
    TopBarSwitch[🔄 Cambiar cuenta en barra superior]:::ui --> ReturnSelector[Muestra view-accounts sin recargar]:::ui
```

---

## 3. Integridad de Datos
- Las cuentas se identifican por IDs únicos con prefijo `acc_`.
- La eliminación de cuenta limpia tanto el índice global (`ikagovernor_accounts`) como la clave de datos específica (`ikagovernor_data_<id>`).
