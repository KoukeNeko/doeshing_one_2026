"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => window.clearTimeout(timer);
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
    router.push(`/search?${searchParams.toString()}`);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-24 backdrop-blur-sm dark:bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
    >
      <div className="relative w-full max-w-2xl border border-black/10 bg-white shadow-editorial dark:border-white/10 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-newspaper-gray transition hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
          aria-label="Close search dialog"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-10 sm:px-10">
          <label
            htmlFor="site-search"
            className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
          >
            Search the archive
          </label>
          <div className="mt-4 flex items-center gap-3 border border-black/10 bg-newspaper-paper px-4 py-3 focus-within:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:focus-within:border-zinc-300">
            <Search
              size={18}
              strokeWidth={1.5}
              className="text-newspaper-gray dark:text-zinc-400"
            />
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type keywords, tags, or topics..."
              className="w-full bg-transparent text-sm uppercase tracking-[0.25em] text-newspaper-ink outline-none placeholder:text-newspaper-gray dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.25em] transition",
                query
                  ? "text-newspaper-accent dark:text-red-400"
                  : "text-newspaper-gray dark:text-zinc-500",
              )}
            >
              Enter
            </button>
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-newspaper-gray dark:text-zinc-500">
            Try “Next.js” or “Editorial Design”
          </p>
        </form>
      </div>
    </div>
  );
}
