import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface RenderedMarkdownProps {
  content: ReactNode;
  className?: string;
}

export function RenderedMarkdown({ content, className }: RenderedMarkdownProps) {
  return (
    <div className={cn(className)}>
      {content}
    </div>
  );
}
