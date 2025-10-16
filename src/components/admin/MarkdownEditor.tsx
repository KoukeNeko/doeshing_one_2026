"use client";

import { useId, useMemo } from "react";
import MDEditor from "@uiw/react-md-editor";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

interface MarkdownEditorProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({
  id,
  name,
  value,
  onChange,
  placeholder,
  className,
}: MarkdownEditorProps) {
  const fallbackId = useId();
  const editorId = id ?? fallbackId;

  const stats = useMemo(() => {
    const trimmed = value.trim();
    const words = trimmed.length
      ? trimmed.split(/\s+/).filter(Boolean).length
      : 0;
    return {
      characters: value.length,
      words,
    };
  }, [value]);

  return (
    <div
      data-color-mode="auto"
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="w-full bg-transparent">
        <MDEditor
          value={value}
          onChange={(nextValue) => onChange(nextValue ?? "")}
          preview="live"
          height={420}
          className="bg-transparent"
          previewOptions={{
            remarkPlugins: [remarkGfm],
          }}
          textareaProps={{
            id: editorId,
            name,
            placeholder,
            className: "font-mono text-sm",
          }}
        />
      </div>
      <div className="flex items-center justify-between border-t border-black/5 px-4 py-2 text-xs text-newspaper-gray dark:border-white/5 dark:text-zinc-400">
        <span>{stats.characters} characters</span>
        <span>{stats.words} words</span>
      </div>
    </div>
  );
}
