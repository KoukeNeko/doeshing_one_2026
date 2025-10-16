"use client";

import { Search, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// Global state to track if any search dialog is open
let globalSearchOpen = false;

export function SearchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-sm border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray transition hover:border-newspaper-ink hover:text-newspaper-ink dark:border-white/10 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
        aria-label="Open search"
      >
        <Search size={16} strokeWidth={1.5} />
        Search
      </button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Global keyboard shortcut for opening search (CMD+K / CTRL+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!globalSearchOpen) {
          globalSearchOpen = true;
          onOpenChange(true);
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      globalSearchOpen = true;
      document.body.style.overflow = "hidden";
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        globalSearchOpen = false;
        document.body.style.overflow = "";
        window.clearTimeout(timer);
      };
    }
    setQuery("");
    return undefined;
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
    return undefined;
  }, [open, onOpenChange]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    const searchParams = new URLSearchParams({ search: query.trim() });
    router.push(`/archive?${searchParams.toString()}`);
    onOpenChange(false);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
      onClick={() => onOpenChange(false)}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 dark:bg-black/70" />

      {/* Modal content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="relative border border-black/10 bg-white shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          {/* Header */}
          <div className="border-b border-black/10 bg-newspaper-paper px-8 py-6 dark:border-white/10 dark:bg-zinc-800">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Search size={16} strokeWidth={1.5} className="text-newspaper-accent dark:text-red-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
                    Search
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-newspaper-ink dark:text-zinc-50">
                  Archive Search
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-1 text-newspaper-gray transition hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
                aria-label="Close search dialog"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="px-8 py-8">
            <div className="space-y-6">
              {/* Input field */}
              <div>
                <label
                  htmlFor="site-search"
                  className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
                >
                  Enter Keywords
                </label>
                <div className="relative flex items-center border border-black/10 bg-newspaper-paper transition focus-within:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:focus-within:border-zinc-300">
                  <Search
                    size={18}
                    strokeWidth={1.5}
                    className="ml-4 text-newspaper-gray dark:text-zinc-400"
                  />
                  <input
                    ref={inputRef}
                    id="site-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search articles, tags, topics..."
                    className="w-full bg-transparent px-4 py-4 text-base text-newspaper-ink outline-none placeholder:text-newspaper-gray/50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!query.trim()}
                className={cn(
                  "w-full border px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition",
                  query.trim()
                    ? "border-newspaper-ink bg-newspaper-ink text-newspaper-paper hover:bg-newspaper-accent hover:border-newspaper-accent dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-red-400 dark:hover:border-red-400"
                    : "border-black/10 bg-transparent text-newspaper-gray dark:border-white/10 dark:text-zinc-500"
                )}
              >
                {query.trim() ? "Search Archive" : "Enter a search term"}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:bg-zinc-900 dark:text-zinc-500">
                    Quick Searches
                  </span>
                </div>
              </div>

              {/* Quick search tags */}
              <div className="flex flex-wrap gap-2">
                {["Next.js", "Design", "TypeScript", "Editorial"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-gray transition hover:border-newspaper-ink hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-white/10 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Keyboard shortcuts */}
              <div className="border-t border-black/10 pt-6 dark:border-white/10">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-500">
                  <div className="flex items-center gap-2">
                    <kbd className="border border-black/10 bg-black/5 px-2 py-1 font-mono dark:border-white/10 dark:bg-white/5">
                      ESC
                    </kbd>
                    <span>Close</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="border border-black/10 bg-black/5 px-2 py-1 font-mono dark:border-white/10 dark:bg-white/5">
                      ⌘K
                    </kbd>
                    <span>Open Search</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
