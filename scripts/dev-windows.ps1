$ErrorActionPreference = "Stop"

Write-Host "[Quill] Installing dependencies..."
npm install

Write-Host "[Quill] Starting Tauri development build..."
npm run tauri:dev
