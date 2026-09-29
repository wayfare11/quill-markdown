$ErrorActionPreference = "Stop"

Write-Host "[Quill] Installing dependencies..."
if (Test-Path "package-lock.json") {
  npm ci
} else {
  npm install
}

Write-Host "[Quill] Building Windows x64 installers..."
npm run tauri:build -- --target x86_64-pc-windows-msvc

Write-Host ""
Write-Host "Build complete. Check these directories:"
Write-Host "  src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis"
Write-Host "  src-tauri\target\x86_64-pc-windows-msvc\release\bundle\msi"
