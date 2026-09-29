# Quill Roadmap

The roadmap is ordered by product risk, not by how visually impressive a feature is.

## Phase 0 - Editor proof (v0.1)

Status: initial prototype.

- [x] Tauri 2 desktop application
- [x] React + TypeScript UI
- [x] CodeMirror 6
- [x] Markdown parser
- [x] basic marker hide/reveal
- [x] Live / Source mode
- [x] Windows file open/save
- [x] unsaved-change guard for New/Open
- [x] light/dark theme
- [x] typography overrides
- [x] Windows x64 CI build

## Phase 1 - Daily editing reliability

- [ ] source-integrity test suite
- [ ] dedicated IME test matrix
- [ ] nested syntax behavior
- [ ] link marker reveal policy
- [ ] task list rendering
- [ ] better code block presentation
- [ ] native close-window dirty guard
- [ ] true atomic replacement on Windows
- [ ] external file watcher
- [ ] conflict compare/keep disk/keep editor actions
- [ ] local recovery journal

## Phase 2 - Workspace

- [ ] Open Folder
- [ ] file tree
- [ ] create/rename/delete files
- [ ] multi-tab sessions
- [ ] session restore
- [ ] outline
- [ ] Quick Open
- [ ] workspace search
- [ ] ignore rules
- [ ] Git-aware file refresh

## Phase 3 - Asset Engine

- [ ] unified AssetService
- [ ] paste screenshot into local assets
- [ ] drag/drop images
- [ ] relative path policy
- [ ] image widget
- [ ] video/audio/file attachment detection
- [ ] asset rename/move updates
- [ ] optional compression processors

## Phase 4 - Rich Markdown extensions

- [ ] visual table editor
- [ ] KaTeX
- [ ] Mermaid
- [ ] generic DiagramProvider
- [ ] front matter form rendering
- [ ] embed providers
- [ ] renderer cache

## Phase 5 - Knowledge relationships

- [ ] SQLite workspace index
- [ ] FTS search
- [ ] heading index
- [ ] link index
- [ ] wiki link extension
- [ ] backlinks panel
- [ ] graph view
- [ ] tags/frontmatter index

## Phase 6 - Themes

- [ ] tokenized UI themes
- [ ] document themes
- [ ] typography presets
- [ ] system-font discovery
- [ ] imported user fonts
- [ ] theme manifest/versioning
- [ ] theme gallery/import

## Phase 7 - Extension Platform

- [ ] versioned Extension API
- [ ] CommandRegistry
- [ ] RendererRegistry
- [ ] AssetRegistry
- [ ] IndexRegistry
- [ ] PanelRegistry
- [ ] ExportRegistry
- [ ] plugin manifest
- [ ] permission model
- [ ] isolated plugin host
- [ ] plugin manager

## Phase 8 - Export / publishing

- [ ] HTML
- [ ] PDF
- [ ] DOCX
- [ ] EPUB
- [ ] Pandoc adapter
- [ ] static-site publishing providers

## Phase 9 - Distribution quality

- [ ] updater
- [ ] signing
- [ ] Windows SmartScreen/reputation strategy
- [ ] crash diagnostics (opt-in)
- [ ] stable/beta channels

## Explicitly later

AI is optional and deliberately not part of the editor kernel. If added, it should be an extension using explicit document transactions/diffs rather than an opaque content rewrite path.
