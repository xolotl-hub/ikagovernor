param (
    [Parameter(Mandatory = $true)]
    [ValidateSet("chrome", "firefox")]
    [string]$Target
)

$sourceFile = Join-Path $PSScriptRoot "manifest.$Target.json"
$targetFile = Join-Path $PSScriptRoot "manifest.json"

if (-not (Test-Path $sourceFile)) {
    Write-Error "Archivo fuente no encontrado: $sourceFile"
    exit 1
}

Copy-Item -Path $sourceFile -Destination $targetFile -Force
Write-Host "manifest.json configurado para: $Target" -ForegroundColor Green
