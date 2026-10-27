@echo off
setlocal

set TARGET=%~1
if "%TARGET%"=="" set TARGET=all

powershell -ExecutionPolicy Bypass -File "%~dp0build-package.ps1" -Target %TARGET%
