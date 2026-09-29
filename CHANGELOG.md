# Changelog

## 0.1.0 - Prototype

### Added

- Tauri 2 Windows desktop shell
- React + TypeScript UI
- CodeMirror 6 Markdown editor
- basic Typora-style Live Preview
- Live and Source editing modes
- file open/save/Save As
- unsaved-change warning before replacing a document
- light/dark theme
- body/code font preferences
- font size, line height, and document width preferences
- Windows x64 GitHub Actions build
- NSIS and MSI bundle targets
- architecture, roadmap, build, and open-source reference documentation

### Known limitations

- no workspace/file tree
- no image pipeline
- no visual tables/math/diagrams
- no external-change conflict handling
- Windows save replacement is temp-first but not yet a formally atomic replacement implementation
- Live Preview remains a small prototype and needs a larger interaction/IME test matrix
