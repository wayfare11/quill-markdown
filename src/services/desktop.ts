import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";

export function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export interface OpenedDocument { path: string; content: string; }

export async function openMarkdownDocument(): Promise<OpenedDocument | null> {
  if (!isTauriRuntime()) throw new Error("文件对话框只在 Quill 桌面版中可用。请运行 npm run tauri:dev。");
  const selected = await open({
    multiple: false,
    directory: false,
    filters: [
      { name: "Markdown", extensions: ["md", "markdown", "mdown", "mkd"] },
      { name: "Text", extensions: ["txt"] },
    ],
  });
  if (!selected || Array.isArray(selected)) return null;
  const content = await invoke<string>("read_text_file", { path: selected });
  return { path: selected, content };
}

export async function saveMarkdownDocument(path: string, content: string): Promise<void> {
  if (!isTauriRuntime()) throw new Error("保存只在 Quill 桌面版中可用。请运行 npm run tauri:dev。");
  await invoke("write_text_file", { path, content });
}

export async function chooseSavePath(suggestedName = "untitled.md"): Promise<string | null> {
  if (!isTauriRuntime()) throw new Error("保存对话框只在 Quill 桌面版中可用。请运行 npm run tauri:dev。");
  return await save({ defaultPath: suggestedName, filters: [{ name: "Markdown", extensions: ["md"] }] });
}
