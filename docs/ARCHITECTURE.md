# Quill Architecture

## Goal

Quill is built as a Markdown-source editor, not as a rich-text document format with Markdown import/export around it.

The architectural invariant is:

```text
CodeMirror EditorState.doc == current Markdown source
```

Rendering, outlines, backlinks, assets, and future plugins may interpret that source, but they must not silently become an independent authoritative copy of the document.

## Layers

```text
Tauri Desktop Shell
        |
        +-- Rust system layer
        |     +-- filesystem
        |     +-- safe-save / conflict work (future)
        |     +-- workspace index (future)
        |     +-- assets (future)
        |
        +-- React UI shell
              +-- menus/settings/panels
              |
              +-- CodeMirror editor
                    +-- Markdown language
                    +-- Lezer syntax tree
                    +-- Live Preview decorations
                    +-- future renderer registry
```

## Editor model

Live Preview is implemented through CodeMirror decorations.

The basic algorithm is:

```text
transaction / selection change
          |
          v
incremental syntax tree
          |
          v
inspect Markdown nodes
          |
          +-- inactive syntax -> hide markers / apply style
          |
          +-- active syntax -> reveal source markers
          |
          v
DecorationSet
```

Source mode uses the same CodeMirror document and simply removes the Live Preview extension through a CodeMirror `Compartment` reconfiguration.

This is important: Live and Source modes are two views over the same text, not two documents that need serialization between each other.

## React boundary

React owns application UI state such as:

- current path;
- dirty flag;
- theme;
- typography;
- open menus/panels;
- editor mode.

React does **not** mirror the entire Markdown body in component state on every keystroke.

The document remains inside CodeMirror's state.

## Rust boundary

Rust handles operations that touch the operating system.

v0.1:

- read a text file;
- write a text file using a temporary file first.

Planned:

- workspace scanning;
- file watchers;
- external-change conflict detection;
- local history;
- crash recovery;
- SQLite/FTS search index;
- asset import and rename tracking.

## Long-term extension architecture

The intended architecture is registry based:

```text
Extension Host
  +-- CommandRegistry
  +-- RendererRegistry
  +-- SyntaxRegistry
  +-- AssetRegistry
  +-- IndexRegistry
  +-- ThemeRegistry
  +-- PanelRegistry
  +-- ExportRegistry
```

Built-in features such as image rendering, tables, math, Mermaid, front matter, wiki links, and backlinks should eventually use the same internal extension points that third-party extensions use.

The public plugin SDK should not be frozen until built-in extensions have exercised those interfaces in real use.

## Performance direction

v0.1 favors correctness and clarity over micro-optimization.

Before large-document support is considered complete, Live Preview should evolve toward:

- changed-range updates;
- viewport-aware decoration work;
- renderer caching;
- asynchronous rendering for expensive diagrams;
- benchmarks for long lines and multi-megabyte documents.

## Source integrity tests

The most important future automated invariant is:

```text
open -> display -> save without edits
```

must not semantically rewrite the Markdown because of visual rendering.

IME, undo/redo, selection, nested markup, and broken/incomplete Markdown are first-class test scenarios.
