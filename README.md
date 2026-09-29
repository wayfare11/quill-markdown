# Quill

> A quiet, local-first Markdown editor for Windows.

Quill is an experimental open-source desktop Markdown editor focused on a simple idea: **the editor should disappear while you write**.

The product direction is inspired by the calm writing experience of Typora, while the architecture is designed around plain Markdown files, CodeMirror 6, Tauri, Rust, and future extensibility.

**Current release:** `v0.1.0` prototype
**Current target platform:** Windows 10/11 x64
**License:** MIT

> Naming note: this project is not affiliated with the existing [Quill rich-text editor](https://github.com/slab/quill). The display name is currently `Quill`; the package/repository naming uses `quill-markdown-*` to reduce confusion. Before a broader public launch, trademark/domain availability should be reviewed.

---

## Why Quill?

Most Markdown editors lean toward one of two extremes:

- raw source editors that expose every Markdown marker all the time;
- rich-text editors that convert Markdown into another internal document model.

Quill is exploring a middle path:

```text
.md file
   |
   v
CodeMirror document  <-- source of truth
   |
   +-- Lezer Markdown syntax tree
   |
   +-- Live Preview decorations
   |
   v
quiet visual editing
```

The Markdown text remains the document. Live Preview only changes how the source is displayed.

That means this source:

```md
This is **important**.
```

can visually look like normal bold text while the stored file remains exactly Markdown.

When the cursor enters the syntax range, the Markdown markers are revealed again.

---

## Design principles

### 1. Markdown belongs to the user

Quill should never require a proprietary document format to keep ordinary Markdown content editable.

### 2. Complex capability, simple surface

Future versions may include images, diagrams, backlinks, plugins, themes, Git, AI, and publishing. Those features should not turn the default writing screen into an IDE dashboard.

### 3. Progressive disclosure

The main screen stays quiet. Advanced features appear only when requested through contextual UI, panels, settings, commands, or plugins.

### 4. Source integrity first

Opening and saving a Markdown file without intentional edits should not rewrite its structure simply because Quill rendered it visually.

### 5. Extension-ready, not extension-heavy

The architecture is intended to support plugins later, but the first releases focus on making the core editor trustworthy and pleasant.

---

## What v0.1.0 can do

The current prototype implements:

- Windows desktop shell with Tauri 2;
- React + TypeScript application UI;
- CodeMirror 6 Markdown editor;
- Lezer-based Markdown parsing;
- basic Typora-style Live Preview;
- heading visual styling;
- bold, italic, strikethrough, and inline-code styling;
- Markdown markers hidden when the related syntax is inactive;
- Markdown markers revealed when the cursor/selection enters the syntax;
- Chinese/CJK-aware word/character statistics;
- basic IME-safe behavior by avoiding marker replacement while CodeMirror is composing text;
- Live Preview mode;
- Source mode;
- open Markdown/text files;
- save and Save As;
- unsaved-change warning before replacing the current document;
- light and dark themes;
- configurable body font;
- configurable code font;
- configurable font size;
- configurable line height;
- configurable document width;
- persisted visual settings using local storage;
- Windows x64 GitHub Actions build workflow;
- NSIS `.exe` and MSI `.msi` bundle configuration.

---

## What v0.1.0 intentionally does not do yet

This is an editor-core prototype, not a full Typora replacement yet.

Not implemented:

- folder/workspace tree;
- tabs and multi-document sessions;
- image paste/import pipeline;
- image resize/crop/annotation;
- visual Markdown tables;
- Mermaid rendering;
- KaTeX/Math rendering;
- video/audio embeds;
- front matter form UI;
- outline panel;
- workspace search;
- Quick Open;
- wiki links;
- backlinks;
- graph view;
- local history;
- crash recovery journal;
- external-file conflict UI;
- custom theme packages;
- plugin SDK / plugin host;
- Git integration;
- PDF/DOCX/EPUB export;
- auto updater;
- code signing;
- AI features.

See [docs/ROADMAP.md](docs/ROADMAP.md) for the planned sequence.

---

## Screens / interaction model

Quill intentionally keeps the default UI small:

```text
+------------------------------------------------------------------+
| Q Quill                   article.md       Live | Source  Moon ...|
+------------------------------------------------------------------+
|                                                                  |
|                                                                  |
|                 A quiet Markdown document                         |
|                                                                  |
|                 Write here.                                      |
|                                                                  |
|                                                                  |
+------------------------------------------------------------------+
| Windows Desktop       Saved          Live Preview   42 lines     |
+------------------------------------------------------------------+
```

The `...` menu contains file operations and typography settings.

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + N` | New document |
| `Ctrl + O` | Open file |
| `Ctrl + S` | Save |
| `Ctrl + Shift + S` | Save As |
| `Ctrl + Shift + M` | Toggle Live / Source mode |
| `Ctrl + ,` | Typography settings |
| `Esc` | Close open menu/settings |

---

## Technology stack

### Desktop

- **Tauri 2** - lightweight desktop application shell;
- **Rust** - native file operations and future workspace/indexing services;
- **WebView2** - Windows web rendering supplied by the platform/Tauri stack.

### Frontend

- **React 19**;
- **TypeScript**;
- **Vite 8**.

### Editor

- **CodeMirror 6** - editor state/view/transactions;
- **@codemirror/lang-markdown** - Markdown language support;
- **Lezer syntax tree** - incremental syntax structure used by Live Preview;
- **CodeMirror Decorations** - visual marker hiding and rich styling.

### Why CodeMirror instead of converting Markdown into rich text?

Quill's current design keeps the Markdown string as the editor document itself.

```text
CodeMirror EditorState.doc == Markdown source
```

Live Preview is a projection of that text rather than a replacement internal data model.

This should make source fidelity easier to reason about and test.

---

## Open-source projects studied

Quill is an original implementation, but its product and architecture research is informed by several open-source editors:

- [MarkText](https://github.com/marktext/marktext) - Markdown writing UX and WYSIWYG product behavior;
- [MarkFlowy](https://github.com/drl990114/MarkFlowy) - modern Tauri desktop architecture and multiple editing modes;
- [@latentic/live-markdown](https://github.com/getlatentic/live-markdown) - CodeMirror 6 + Markdown-as-source live rendering direction;
- [Joplin](https://github.com/laurent22/joplin) - plugin/platform longevity and cross-platform application architecture;
- [SiYuan](https://github.com/siyuan-note/siyuan) - themes, plugins, assets, backlinks, and workspace concepts;
- [Foam](https://github.com/foambubble/foam) - plain Markdown files with wiki-link/backlink concepts;
- [Zettlr](https://github.com/Zettlr/Zettlr) - mature Markdown workspace and publishing workflows.

No source code from these projects is intentionally copied into Quill. Their licenses differ, and future contributions should preserve that boundary. See [docs/OPEN_SOURCE_REFERENCES.md](docs/OPEN_SOURCE_REFERENCES.md).

---

## Repository structure

```text
Quill/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  └─ workflows/
│     ├─ frontend-check.yml
│     └─ windows-build.yml
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ BUILD_WINDOWS.md
│  ├─ OPEN_SOURCE_REFERENCES.md
│  └─ ROADMAP.md
├─ scripts/
│  ├─ dev-windows.ps1
│  └─ build-windows.ps1
├─ src/
│  ├─ editor/
│  │  ├─ MarkdownEditor.tsx
│  │  └─ livePreview.ts
│  ├─ services/
│  │  └─ desktop.ts
│  ├─ styles/
│  │  ├─ app.css
│  │  └─ editor.css
│  ├─ App.tsx
│  └─ main.tsx
├─ src-tauri/
│  ├─ capabilities/
│  ├─ icons/
│  ├─ src/
│  ├─ Cargo.toml
│  └─ tauri.conf.json
├─ index.html
├─ package.json
├─ LICENSE
└─ README.md
```

---

## Windows requirements

For normal users, a built installer is the preferred route.

For local development/building, install:

1. **Windows 10 or Windows 11 x64**;
2. **Node.js 22 LTS-compatible runtime**;
3. **Rust stable** (the current Tauri dialog plugin requires a modern Rust toolchain; this project declares Rust 1.90+);
4. **Microsoft Visual Studio Build Tools** with Desktop development with C++ / MSVC Windows tools;
5. **WebView2 Runtime** (normally already present on supported Windows installations).

Tauri's official Windows prerequisites remain the source of truth if Microsoft/Rust tooling changes.

---

## Run locally on Windows

Clone the repository:

```powershell
git clone https://github.com/<your-account>/quill-markdown.git
cd quill-markdown
```

Install dependencies:

```powershell
npm install
```

Start the desktop development app:

```powershell
npm run tauri:dev
```

Or:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\dev-windows.ps1
```

---

## Build Windows x64 installers locally

```powershell
npm install
npm run tauri:build -- --target x86_64-pc-windows-msvc
```

Or:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-windows.ps1
```

Typical output locations:

```text
src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\*.exe
src-tauri\target\x86_64-pc-windows-msvc\release\bundle\msi\*.msi
```

Depending on the Tauri toolchain, non-target-prefixed bundle paths may also be used.

---

## GitHub Actions: get a Windows installer without a local build environment

The repository contains `.github/workflows/windows-build.yml`.

### Manual build

1. Open the GitHub repository.
2. Go to **Actions**.
3. Select **Windows x64 Build**.
4. Choose **Run workflow**.
5. When the job succeeds, open the workflow run.
6. Download the **Quill-windows-x64** artifact.

The artifact contains the generated `.exe` and/or `.msi` installers.

### Release build

Push a version tag:

```powershell
git tag v0.1.0
git push origin v0.1.0
```

The Windows workflow will build the installers and create a GitHub Release for that tag with installer files attached.

---

## Current Live Preview implementation

The editor uses CodeMirror's incremental Markdown syntax tree.

Example source:

```md
This is **important**.
```

When the strong-emphasis node is not active:

- `**` marker ranges are visually replaced with empty decorations;
- the text range receives a bold CSS class.

When the cursor/selection touches the strong-emphasis node:

- the marker replacement is removed;
- the original Markdown becomes visible for editing.

The Markdown stored in `EditorState.doc` is never changed by this visual operation.

### Current renderer coverage

- ATX headings;
- strong emphasis;
- emphasis;
- strikethrough;
- inline code;
- basic link styling;
- basic blockquote styling;
- basic fenced-code styling.

### Known Live Preview limitations

The implementation is intentionally small and currently rebuilds decorations more broadly than the long-term architecture should.

Areas that need dedicated work:

- nested syntax edge cases;
- cursor behavior at marker boundaries;
- link target hiding/reveal UX;
- images as widgets;
- list/task-list marker rendering;
- visual tables;
- large-document viewport-aware decoration generation;
- exhaustive Chinese/Japanese/Korean IME tests;
- multi-selection behavior;
- drag/drop editing behavior.

---

## Saving behavior

Rust currently writes to a temporary file first and then moves it into place.

This reduces the chance of leaving a partially written target file, but the Windows replacement fallback in v0.1 is **not yet a formally atomic replace operation**. True Windows atomic replacement and external-change conflict detection are tracked for a later release.

This distinction is deliberate: the README should not claim stronger durability guarantees than the implementation currently provides.

---

## Themes and typography

v0.1 separates visual preferences from Markdown content.

Available controls:

- light/dark application theme;
- body font;
- code font;
- body size;
- line height;
- document width.

Settings are stored locally by the application frontend and do not modify `.md` files.

Long-term theme architecture will separate:

```text
Application Theme
+ Document Theme
+ Typography Preset
+ User Override
```

with user overrides taking priority.

---

## Roadmap summary

### v0.1 - editor proof

- [x] Tauri desktop shell
- [x] CodeMirror 6 Markdown editor
- [x] basic Live Preview
- [x] Source mode
- [x] open/save
- [x] light/dark theme
- [x] typography controls
- [x] Windows x64 build workflow

### v0.2 - usable daily editor

- [ ] stronger Live Preview boundary behavior
- [ ] file/folder workspace
- [ ] tabs/session restore
- [ ] outline
- [ ] Quick Open
- [ ] better keyboard commands
- [ ] external file watcher

### v0.3 - assets and rich blocks

- [ ] paste image to local assets folder
- [ ] drag/drop image
- [ ] image widget
- [ ] visual table editing
- [ ] KaTeX
- [ ] Mermaid
- [ ] front matter UI

### v0.4 - knowledge workspace

- [ ] full-text search
- [ ] wiki links
- [ ] backlinks
- [ ] graph
- [ ] asset index

### later

- [ ] extension API
- [ ] plugin host and permissions
- [ ] theme packages
- [ ] Git integration
- [ ] export pipeline
- [ ] local history/recovery
- [ ] updater and signing
- [ ] optional AI extensions

See the detailed [roadmap](docs/ROADMAP.md).

---

## Development philosophy

Before adding a visible feature, ask:

1. Does a user who never uses this feature have to see it?
2. Can it be invoked through a command/context instead of becoming permanent UI?
3. Does it preserve plain Markdown source?
4. Can it fail without corrupting the document?
5. Can it eventually live behind an extension point?

The desired product feel is:

> **Typora's calm surface, developer-grade efficiency underneath, and future extensibility without visual noise.**

---

## Contributing

Contributions are welcome while the project is experimental. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

For editor changes, source integrity and cursor/IME behavior matter more than feature count.

---

## Security

Please see [SECURITY.md](SECURITY.md).

Do not report security-sensitive issues in a public issue if they expose a practical vulnerability.

---

## License

MIT. See [LICENSE](LICENSE).

Copyright (c) 2026 Quill Contributors.
