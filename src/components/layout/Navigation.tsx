"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchButton } from "@/components/ui/Search";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void pathname;
    setOpen(false);
  }, [pathname]);

  return (
    <nav aria-label="Primary Navigation" className="sticky top-0 z-50 border-y border-black/10 bg-newspaper-paper dark:border-white/10 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-newspaper-ink dark:text-zinc-100 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
          Menu
        </button>
        <div className="hidden md:flex md:gap-10">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
                  active
                    ? "text-newspaper-accent dark:text-red-400"
                    : "text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/newsletter"
            className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-newspaper-accent dark:text-red-400 md:inline"
          >
            Newsletter
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <div
        id="mobile-nav"
        className={cn(
          "border-t border-black/10 px-4 pb-6 pt-2 dark:border-white/10 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-3">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold uppercase tracking-[0.22em]",
                  active
                    ? "text-newspaper-accent dark:text-red-400"
                    : "text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div>
            <SearchButton />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
