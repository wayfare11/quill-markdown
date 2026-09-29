# Building Quill on Windows x64

## Recommended environment

- Windows 10/11 x64
- Node.js 22
- Rust stable, 1.90 or newer
- MSVC / Visual Studio Build Tools with C++ desktop tooling
- WebView2 Runtime

## Development

```powershell
npm install
npm run tauri:dev
```

## Production build

```powershell
npm install
npm run tauri:build -- --target x86_64-pc-windows-msvc
```

## Output

Look under:

```text
src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis
src-tauri\target\x86_64-pc-windows-msvc\release\bundle\msi
```

## GitHub Actions

The `Windows x64 Build` workflow runs the same target on `windows-latest` and uploads the resulting installers as a workflow artifact.

When a tag matching `v*` is pushed, the workflow also creates a GitHub Release and attaches generated `.exe`/`.msi` installers.

Example:

```powershell
git tag v0.1.0
git push origin v0.1.0
```
