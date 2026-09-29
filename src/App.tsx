import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  MarkdownEditor,
  type EditorMode,
  type EditorStats,
  type MarkdownEditorHandle,
} from "./editor/MarkdownEditor";
import {
  chooseSavePath,
  isTauriRuntime,
  openMarkdownDocument,
  saveMarkdownDocument,
} from "./services/desktop";

const SAMPLE = `# Quill

Quill 是一个追求 **安静、轻量、本地优先** 的 Markdown 编辑器原型。

## Live Preview

正常阅读时，Markdown 标记会尽量退到背景里；当光标进入对应语法范围时，原始标记会重新出现。

- 这是普通列表
- 支持 **粗体**、*斜体*、~~删除线~~ 与 \`行内代码\`
- 点击右上角可在 Live / Source 模式之间切换

> Markdown 原文始终是唯一的数据源。

## v0.1 目标

这一版只验证最重要的事情：编辑手感、源码完整性、Windows 桌面文件读写、主题和排版。
`;

type Theme = "light" | "dark";

interface TypographySettings {
  bodyFont: string;
  codeFont: string;
  fontSize: number;
  lineHeight: number;
  documentWidth: number;
}

interface PersistedSettings {
  theme: Theme;
  typography: TypographySettings;
}

const SETTINGS_KEY = "quill.settings.v1";

const FONT_OPTIONS = [
  { label: "系统默认", value: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { label: "微软雅黑", value: "'Microsoft YaHei', 'Segoe UI', sans-serif" },
  { label: "宋体", value: "SimSun, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "霞鹜文楷（已安装时）", value: "'LXGW WenKai', 'Microsoft YaHei', sans-serif" },
];

const CODE_FONT_OPTIONS = [
  { label: "Cascadia Code", value: "'Cascadia Code', Consolas, monospace" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', Consolas, monospace" },
  { label: "Consolas", value: "Consolas, monospace" },
];

const DEFAULT_TYPOGRAPHY: TypographySettings = {
  bodyFont: FONT_OPTIONS[0].value,
  codeFont: CODE_FONT_OPTIONS[0].value,
  fontSize: 16,
  lineHeight: 1.78,
  documentWidth: 760,
};

function basename(path: string | null): string {
  if (!path) return "untitled.md";
  return path.split(/[\\/]/).pop() || path;
}

function loadSettings(): PersistedSettings {
  if (typeof window === "undefined") {
    return { theme: "light", typography: DEFAULT_TYPOGRAPHY };
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { theme: "light", typography: DEFAULT_TYPOGRAPHY };
    const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
    return {
      theme: parsed.theme === "dark" ? "dark" : "light",
      typography: { ...DEFAULT_TYPOGRAPHY, ...(parsed.typography ?? {}) },
    };
  } catch {
    return { theme: "light", typography: DEFAULT_TYPOGRAPHY };
  }
}

export default function App() {
  const initialSettings = useMemo(loadSettings, []);
  const editorRef = useRef<MarkdownEditorHandle>(null);
  const [path, setPath] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("就绪");
  const [theme, setTheme] = useState<Theme>(initialSettings.theme);
  const [mode, setMode] = useState<EditorMode>("live");
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [stats, setStats] = useState<EditorStats>({ chars: 0, words: 0, lines: 1 });
  const [typography, setTypography] = useState<TypographySettings>(initialSettings.typography);

  const documentStyle = useMemo(
    () =>
      ({
        "--quill-font-body": typography.bodyFont,
        "--quill-font-code": typography.codeFont,
        "--quill-font-size": `${typography.fontSize}px`,
        "--quill-line-height": typography.lineHeight,
        "--quill-document-width": `${typography.documentWidth}px`,
      }) as CSSProperties,
    [typography],
  );

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, typography }));
  }, [theme, typography]);

  useEffect(() => {
    document.title = `${dirty ? "*" : ""}${basename(path)} - Quill`;
  }, [dirty, path]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  function canDiscardCurrentDocument(): boolean {
    if (!dirty) return true;
    return window.confirm("当前文档还有未保存的修改。确定要放弃这些修改吗？");
  }

  async function handleOpen() {
    if (!canDiscardCurrentDocument()) return;
    try {
      setMenuOpen(false);
      setStatus("正在打开...");
      const doc = await openMarkdownDocument();
      if (!doc) {
        setStatus("就绪");
        return;
      }
      editorRef.current?.setValue(doc.content);
      setPath(doc.path);
      setDirty(false);
      setStatus("已打开");
      requestAnimationFrame(() => editorRef.current?.focus());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  }

  async function handleSave(forceSaveAs = false) {
    try {
      setMenuOpen(false);
      let target = path;
      if (!target || forceSaveAs) {
        target = await chooseSavePath(basename(path));
        if (!target) return;
      }
      setStatus("正在保存...");
      await saveMarkdownDocument(target, editorRef.current?.getValue() ?? "");
      setPath(target);
      setDirty(false);
      setStatus("已保存");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  }

  function handleNew() {
    if (!canDiscardCurrentDocument()) return;
    setMenuOpen(false);
    editorRef.current?.setValue("# Untitled\n\n");
    setPath(null);
    setDirty(false);
    setStatus("新建文档");
    editorRef.current?.focus();
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const primary = event.ctrlKey || event.metaKey;
      if (!primary) {
        if (event.key === "Escape") {
          setMenuOpen(false);
          setSettingsOpen(false);
        }
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "s") {
        event.preventDefault();
        void handleSave(event.shiftKey);
      } else if (key === "o") {
        event.preventDefault();
        void handleOpen();
      } else if (key === "n") {
        event.preventDefault();
        handleNew();
      } else if (key === ",") {
        event.preventDefault();
        setMenuOpen(false);
        setSettingsOpen((value) => !value);
      } else if (event.shiftKey && key === "m") {
        event.preventDefault();
        setMode((value) => (value === "live" ? "source" : "live"));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="app" data-theme={theme} style={documentStyle}>
      <header className="topbar">
        <div className="brand" title="Quill Markdown Editor">
          <span className="brand-mark">Q</span>
          <strong>Quill</strong>
        </div>

        <div className="document-title" title={path ?? "未保存文档"}>
          {dirty ? "* " : ""}{basename(path)}
        </div>

        <div className="top-actions">
          <div className="mode-switch" aria-label="编辑模式">
            <button
              type="button"
              className={mode === "live" ? "active" : ""}
              onClick={() => setMode("live")}
              title="Live Preview"
            >
              Live
            </button>
            <button
              type="button"
              className={mode === "source" ? "active" : ""}
              onClick={() => setMode("source")}
              title="源码模式 (Ctrl+Shift+M)"
            >
              Source
            </button>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
            title="切换明暗主题"
            aria-label="切换明暗主题"
          >
            {theme === "light" ? "Moon" : "Sun"}
          </button>

          <div className="menu-anchor">
            <button
              type="button"
              className="icon-button more-button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label="更多操作"
            >
              ...
            </button>
            {menuOpen && (
              <div className="file-menu">
                <button type="button" onClick={handleNew}><span>新建</span><kbd>Ctrl N</kbd></button>
                <button type="button" onClick={() => void handleOpen()}><span>打开...</span><kbd>Ctrl O</kbd></button>
                <button type="button" onClick={() => void handleSave(false)}><span>保存</span><kbd>Ctrl S</kbd></button>
                <button type="button" onClick={() => void handleSave(true)}><span>另存为...</span><kbd>Ctrl Shift S</kbd></button>
                <div className="menu-separator" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setSettingsOpen(true);
                  }}
                >
                  <span>排版设置</span><kbd>Ctrl ,</kbd>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="workspace" onClick={() => menuOpen && setMenuOpen(false)}>
        <section className="editor-shell">
          <MarkdownEditor
            ref={editorRef}
            initialValue={SAMPLE}
            mode={mode}
            onDirty={() => {
              setDirty(true);
              setStatus("编辑中");
            }}
            onStats={setStats}
          />
        </section>

        {settingsOpen && (
          <aside className="settings-panel" onClick={(event) => event.stopPropagation()}>
            <div className="settings-header">
              <div>
                <strong>排版</strong>
                <small>仅改变显示，不修改 Markdown 原文</small>
              </div>
              <button type="button" className="close-button" onClick={() => setSettingsOpen(false)}>
                Close
              </button>
            </div>

            <label>
              <span>正文字体</span>
              <select
                value={typography.bodyFont}
                onChange={(event) =>
                  setTypography((value) => ({ ...value, bodyFont: event.target.value }))
                }
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.label} value={font.value}>{font.label}</option>
                ))}
              </select>
            </label>

            <label>
              <span>代码字体</span>
              <select
                value={typography.codeFont}
                onChange={(event) =>
                  setTypography((value) => ({ ...value, codeFont: event.target.value }))
                }
              >
                {CODE_FONT_OPTIONS.map((font) => (
                  <option key={font.label} value={font.value}>{font.label}</option>
                ))}
              </select>
            </label>

            <label>
              <span>正文字号 <b>{typography.fontSize}px</b></span>
              <input
                type="range"
                min="13"
                max="22"
                step="1"
                value={typography.fontSize}
                onChange={(event) =>
                  setTypography((value) => ({ ...value, fontSize: Number(event.target.value) }))
                }
              />
            </label>

            <label>
              <span>行距 <b>{typography.lineHeight.toFixed(2)}</b></span>
              <input
                type="range"
                min="1.3"
                max="2.2"
                step="0.05"
                value={typography.lineHeight}
                onChange={(event) =>
                  setTypography((value) => ({ ...value, lineHeight: Number(event.target.value) }))
                }
              />
            </label>

            <label>
              <span>正文宽度 <b>{typography.documentWidth}px</b></span>
              <input
                type="range"
                min="560"
                max="1040"
                step="20"
                value={typography.documentWidth}
                onChange={(event) =>
                  setTypography((value) => ({ ...value, documentWidth: Number(event.target.value) }))
                }
              />
            </label>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setTypography(DEFAULT_TYPOGRAPHY)}
            >
              恢复默认排版
            </button>
          </aside>
        )}
      </main>

      <footer className="statusbar">
        <span>{isTauriRuntime() ? "Windows Desktop" : "Web Preview"}</span>
        <span>{status}</span>
        <span className="status-spacer" />
        <span>{mode === "live" ? "Live Preview" : "Source"}</span>
        <span>{stats.lines} 行</span>
        <span>{stats.words} 字/词</span>
        <span>{stats.chars} 字符</span>
      </footer>
    </div>
  );
}
