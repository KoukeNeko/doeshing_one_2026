"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasContents, setHasContents] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    // 檢查頁面是否有 TableOfContents
    const checkContents = () => {
      const tocElement = document.querySelector('nav[class*="space-y-2"]')?.parentElement;
      setHasContents(!!tocElement && tocElement.children.length > 1);
    };

    checkContents();

    const toggleVisibility = () => {
      // Show buttons when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // 使用 MutationObserver 監聽 DOM 變化（處理動態載入的內容）
    const observer = new MutationObserver(checkContents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToContents = () => {
    const tocElement = document.querySelector('nav[class*="space-y-2"]')?.parentElement;
    if (!tocElement) return;

    const nav = document.querySelector('nav[aria-label="Primary Navigation"]');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    const containerPadding = 24;

    const elementPosition = tocElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - navHeight - containerPadding;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const toggleTheme = () => {
    const isDark = resolvedTheme === "dark";

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      setTheme(isDark ? "light" : "dark");
      return;
    }

    document.startViewTransition(() => {
      setTheme(isDark ? "light" : "dark");
    });
  };

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
      {/* Scroll to Contents Button */}
      {hasContents && (
        <button
          onClick={scrollToContents}
          className={`flex h-12 w-12 items-center justify-center border border-newspaper-ink bg-newspaper-paper shadow-editorial transition-all duration-300 hover:-translate-y-1 hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
          aria-label="Scroll to contents"
          style={{ pointerEvents: isVisible ? "auto" : "none" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`flex h-12 w-12 items-center justify-center border border-newspaper-ink bg-newspaper-paper shadow-editorial transition-all duration-300 hover:-translate-y-1 hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
        aria-label="Toggle theme"
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      >
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`flex h-12 w-12 items-center justify-center border border-newspaper-ink bg-newspaper-paper shadow-editorial transition-all duration-300 hover:-translate-y-1 hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
        aria-label="Scroll to top"
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}
