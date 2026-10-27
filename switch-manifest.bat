@echo off
setlocal

if "%~1"=="" (
    echo Uso: switch-manifest.bat [chrome ^| firefox]
    exit /b 1
)

if /i "%~1"=="chrome" (
    copy /y "%~dp0manifest.chrome.json" "%~dp0manifest.json" >nul
    echo manifest.json configurado para Chrome.
    exit /b 0
)

if /i "%~1"=="firefox" (
    copy /y "%~dp0manifest.firefox.json" "%~dp0manifest.json" >nul
    echo manifest.json configurado para Firefox.
    exit /b 0
)

echo Opcion invalida: %~1. Use 'chrome' o 'firefox'.
exit /b 1
