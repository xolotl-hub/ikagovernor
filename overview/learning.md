# 📚 Learning & Propuestas de Mejora

Lista directa de mejoras identificadas para promover al repositorio global `.agents`.

## 📌 Propuestas de mejora

- **Nueva Skill: `browser-extensions` (WebExtensions Multi-Browser):**
  - **Motivación:** En proyectos de extensiones para navegador (Chrome, Firefox, Edge), los agentes suelen cometer errores típicos con empaquetado, diferencias de MV3 y rechazos de linter de AMO (Mozilla).
  - **Alcance recomendado (Una skill unificada vs dos separadas):** Unificar en una sola skill `browser-extensions` con guías por navegador en lugar de fragmentar en dos skills. El 85% de la API de WebExtensions es compartida; lo crítico es el manejo del pipeline cross-browser.
  - **Puntos clave que debe cubrir la skill:**
    1. **Empaquetado multiplataforma (Windows/Unix):** Nunca usar `Compress-Archive` nativo en Windows para paquetes de Firefox AMO porque genera separadores `\` en el ZIP (`Invalid file name in archive`). Usar siempre streams de .NET `[System.IO.Compression.ZipArchive]` forzando forward-slashes `/` (POSIX).
    2. **Divergencias MV3 Chrome vs Firefox:**
       - Chrome: `background.service_worker`, `chrome.sidePanel`.
       - Firefox: `browser_specific_settings.gecko` (`id`, `strict_min_version`, `data_collection_permissions`), `sidebar_action`. No mezclar en un manifest único; usar arquitectura multi-manifest (`manifest.chrome.json` y `manifest.firefox.json`) con build step de staging.
       - Requisitos Firefox 2024+: `data_collection_permissions` requiere `strict_min_version >= 142.0` si se soporta Android.
    3. **Regla de oro de seguridad DOM para AMO:** Cero `innerHTML` con interpolación de variables. Usar `createElement`, `textContent`, `append()` y `replaceChildren()` para no disparar avisos de `Unsafe assignment to innerHTML` en `web-ext lint` ni demorar aprobaciones en addons.mozilla.org.


---

## 📜 Histórico de mejoras aplicadas

