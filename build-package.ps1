param (
    [Parameter(Mandatory = $false)]
    [ValidateSet("all", "chrome", "firefox")]
    [string]$Target = "all"
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$rootDir = $PSScriptRoot
$distDir = Join-Path $rootDir "dist"

if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
}

# Obtener versión desde manifest.chrome.json o manifest.json
$refManifestPath = Join-Path $rootDir "manifest.chrome.json"
if (-not (Test-Path $refManifestPath)) {
    $refManifestPath = Join-Path $rootDir "manifest.json"
}
$version = "1.0"
if (Test-Path $refManifestPath) {
    try {
        $json = Get-Content -Raw $refManifestPath | ConvertFrom-Json
        if ($json.version) { $version = $json.version }
    } catch {}
}

$targets = @()
if ($Target -eq "all") {
    $targets = @("chrome", "firefox")
} else {
    $targets = @($Target)
}

foreach ($t in $targets) {
    Write-Host ">>> Empaquetando para: $t (v$version)..." -ForegroundColor Cyan
    $staging = Join-Path $distDir ".staging_$t"
    if (Test-Path $staging) {
        Remove-Item -Recurse -Force $staging
    }
    New-Item -ItemType Directory -Path $staging | Out-Null

    # 1. Copiar manifest correspondiente
    $srcManifest = Join-Path $rootDir "manifest.$t.json"
    if (-not (Test-Path $srcManifest)) {
        Write-Error "No se encontro el manifest: $srcManifest"
        continue
    }
    Copy-Item -Path $srcManifest -Destination (Join-Path $staging "manifest.json") -Force

    # 2. Copiar archivos base de UI
    Copy-Item -Path (Join-Path $rootDir "popup.html") -Destination $staging -Force
    Copy-Item -Path (Join-Path $rootDir "popup.css") -Destination $staging -Force

    # 3. Copiar modulos JS (src/)
    Copy-Item -Path (Join-Path $rootDir "src") -Destination $staging -Recurse -Force

    # 4. Copiar assets si existen
    $assetsDir = Join-Path $rootDir "assets"
    if (Test-Path $assetsDir) {
        Copy-Item -Path $assetsDir -Destination $staging -Recurse -Force
    }

    # 5. Background script (solo Chrome)
    if ($t -eq "chrome") {
        $bgFile = Join-Path $rootDir "background.js"
        if (Test-Path $bgFile) {
            Copy-Item -Path $bgFile -Destination $staging -Force
        }
    }

    # 6. Generar ZIP con rutas POSIX estándar (forward-slashes '/')
    $zipName = "ikagovernor-$t-v$version.zip"
    $zipPath = Join-Path $distDir $zipName

    if (Test-Path $zipPath) {
        Remove-Item -Force $zipPath
    }

    $zipStream = [System.IO.File]::Open($zipPath, [System.IO.FileMode]::Create)
    $archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)

    try {
        $files = Get-ChildItem -Path $staging -Recurse -File
        foreach ($f in $files) {
            $rel = $f.FullName.Substring($staging.Length).TrimStart('\', '/')
            $posixEntry = $rel.Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $f.FullName, $posixEntry, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally {
        $archive.Dispose()
        $zipStream.Dispose()
    }

    Remove-Item -Recurse -Force $staging

    $zipItem = Get-Item $zipPath
    $sizeKb = [math]::Round($zipItem.Length / 1KB, 1)
    Write-Host "  [OK] $zipName creado exitosamente ($sizeKb KB) con rutas POSIX" -ForegroundColor Green
}

Write-Host "Empaquetado finalizado en: $distDir" -ForegroundColor Green
