"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export default function CommentSection() {
  const commentBoxRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load Giscus script only after mounting
  useEffect(() => {
    if (!mounted) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "KoukeNeko/doeshing_one_2026");
    script.setAttribute("data-repo-id", "R_kgDOQA8TqA");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOQA8TqM4Cw-UU");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");

    // Use custom theme - now works in production with public URL
    const theme = resolvedTheme === "dark"
      ? "https://doeshing.one/giscus-dark.css"
      : "https://doeshing.one/giscus-light.css";
    script.setAttribute("data-theme", theme);

    script.setAttribute("data-lang", "zh-TW");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    if (commentBoxRef.current) {
      commentBoxRef.current.appendChild(script);
    }

    return () => {
      if (commentBoxRef.current) {
        commentBoxRef.current.innerHTML = "";
      }
    };
  }, [mounted, resolvedTheme]);

  // Handle theme changes dynamically
  useEffect(() => {
    if (!mounted) return;

    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (!iframe) return;

    const theme = resolvedTheme === "dark"
      ? "https://doeshing.one/giscus-dark.css"
      : "https://doeshing.one/giscus-light.css";

    iframe.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: theme,
          },
        },
      },
      "https://giscus.app"
    );
  }, [mounted, resolvedTheme]);

  return (
    <section
      aria-labelledby="comment-heading"
      className="py-10"
      data-testid="comment-section"
    >
      <header className="space-y-6 pb-6">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
            讀者交流
          </span>
          <h2
            id="comment-heading"
            className="font-serif text-3xl tracking-tight text-newspaper-ink dark:text-zinc-50 sm:text-4xl"
          >
            加入討論
          </h2>
          <p className="max-w-2xl text-sm text-newspaper-gray dark:text-zinc-400">
            使用 GitHub 帳號登入以參與討論。所有留言將儲存在 GitHub Discussions 中。
          </p>
          <div className="mt-4 h-px w-20 border-b border-newspaper-ink dark:border-zinc-100" />
        </div>
      </header>

      <div ref={commentBoxRef} className="mt-8" />
    </section>
  );
}
