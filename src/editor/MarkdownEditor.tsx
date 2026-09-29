import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown, markdownKeymap, markdownLanguage } from "@codemirror/lang-markdown";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { livePreview } from "./livePreview";

export type EditorMode = "live" | "source";

export interface EditorStats { chars: number; words: number; lines: number; }
export interface MarkdownEditorHandle { getValue(): string; setValue(value: string): void; focus(): void; }

interface Props {
  initialValue: string;
  mode: EditorMode;
  onDirty(): void;
  onStats(stats: EditorStats): void;
}

function calculateStats(text: string): EditorStats {
  const latinWords = text.match(/[A-Za-z0-9_]+(?:[-'][A-Za-z0-9_]+)*/g)?.length ?? 0;
  const cjkChars = text.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g)?.length ?? 0;
  return { chars: text.length, words: latinWords + cjkChars, lines: text.length === 0 ? 1 : text.split("\n").length };
}

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, Props>(
  function MarkdownEditor({ initialValue, mode, onDirty, onStats }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onDirtyRef = useRef(onDirty);
    const onStatsRef = useRef(onStats);
    const previewCompartmentRef = useRef(new Compartment());

    useEffect(() => { onDirtyRef.current = onDirty; }, [onDirty]);
    useEffect(() => { onStatsRef.current = onStats; }, [onStats]);

    useEffect(() => {
      const view = viewRef.current;
      if (!view) return;
      view.dispatch({ effects: previewCompartmentRef.current.reconfigure(mode === "live" ? livePreview() : []) });
    }, [mode]);

    useEffect(() => {
      if (!hostRef.current) return;
      const state = EditorState.create({
        doc: initialValue,
        extensions: [
          history(),
          markdown({ base: markdownLanguage }),
          syntaxHighlighting(defaultHighlightStyle),
          previewCompartmentRef.current.of(mode === "live" ? livePreview() : []),
          keymap.of([...markdownKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
          placeholder("开始写 Markdown..."),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return;
            onDirtyRef.current();
            onStatsRef.current(calculateStats(update.state.doc.toString()));
          }),
          EditorView.theme({
            "&": { height: "100%" },
            ".cm-scroller": { overflow: "auto", fontFamily: "inherit" },
            ".cm-content": { minHeight: "100%", caretColor: "var(--quill-caret)" },
            ".cm-line": { padding: "0" },
            ".cm-gutters": { display: "none" },
            "&.cm-focused": { outline: "none" },
          }),
        ],
      });
      const view = new EditorView({ state, parent: hostRef.current });
      viewRef.current = view;
      onStatsRef.current(calculateStats(initialValue));
      return () => { view.destroy(); viewRef.current = null; };
    }, []);

    useImperativeHandle(ref, () => ({
      getValue() { return viewRef.current?.state.doc.toString() ?? ""; },
      setValue(value: string) {
        const view = viewRef.current;
        if (!view) return;
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value }, selection: { anchor: 0 } });
        onStatsRef.current(calculateStats(value));
      },
      focus() { viewRef.current?.focus(); },
    }));

    return <div className="editor-host" ref={hostRef} />;
  },
);
