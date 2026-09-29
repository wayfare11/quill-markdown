import { syntaxTree } from "@codemirror/language";
import type { Extension, Range } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";

function selectionTouches(view: EditorView, from: number, to: number): boolean {
  return view.state.selection.ranges.some((range) => range.from <= to && range.to >= from);
}

function buildDecorations(view: EditorView): DecorationSet {
  const ranges: Range<Decoration>[] = [];
  const tree = syntaxTree(view.state);

  tree.iterate({
    enter(node) {
      const name = node.name;
      const active = selectionTouches(view, node.from, node.to);

      if (/^ATXHeading[1-6]$/.test(name)) {
        const level = Number(name.slice(-1));
        ranges.push(
          Decoration.mark({ class: `quill-heading quill-h${level}` }).range(node.from, node.to),
        );
      } else if (name === "StrongEmphasis") {
        ranges.push(Decoration.mark({ class: "quill-strong" }).range(node.from, node.to));
      } else if (name === "Emphasis") {
        ranges.push(Decoration.mark({ class: "quill-emphasis" }).range(node.from, node.to));
      } else if (name === "Strikethrough") {
        ranges.push(Decoration.mark({ class: "quill-strike" }).range(node.from, node.to));
      } else if (name === "InlineCode") {
        ranges.push(Decoration.mark({ class: "quill-inline-code" }).range(node.from, node.to));
      } else if (name === "Link") {
        ranges.push(Decoration.mark({ class: "quill-link" }).range(node.from, node.to));
      } else if (name === "Blockquote") {
        ranges.push(Decoration.mark({ class: "quill-quote" }).range(node.from, node.to));
      } else if (name === "FencedCode") {
        ranges.push(Decoration.mark({ class: "quill-code-block" }).range(node.from, node.to));
      }

      const parent = node.node.parent;
      const parentActive = parent ? selectionTouches(view, parent.from, parent.to) : active;

      if (
        !view.composing &&
        !parentActive &&
        ["HeaderMark", "EmphasisMark", "StrikethroughMark", "CodeMark", "QuoteMark"].includes(name)
      ) {
        ranges.push(Decoration.replace({}).range(node.from, node.to));
      }
    },
  });

  return Decoration.set(ranges, true);
}

const livePreviewPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.selectionSet ||
        update.viewportChanged ||
        update.geometryChanged
      ) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  { decorations: (value) => value.decorations },
);

export function livePreview(): Extension {
  return [livePreviewPlugin];
}
