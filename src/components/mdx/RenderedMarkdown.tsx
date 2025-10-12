import { cn } from "@/lib/utils";

interface RenderedMarkdownProps {
  html: string;
  className?: string;
}

export function RenderedMarkdown({ html, className }: RenderedMarkdownProps) {
  return (
    <div
      className={cn(className)}
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown content is sanitized through the unified + rehype pipeline */
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
