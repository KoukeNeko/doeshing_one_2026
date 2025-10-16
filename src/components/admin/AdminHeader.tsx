"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Menu, X, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/admin" as const, label: "Dashboard" },
    { href: "/admin/blog" as const, label: "Blog" },
    { href: "/admin/work" as const, label: "Work" },
  ];

  return (
    <>
      {/* Header section - similar to front-end Header */}
      <header className="border-b border-black/10 bg-newspaper-paper dark:border-white/10 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
                  Administration
                </span>
              </div>
              <Link href="/admin" className="group">
                <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-newspaper-ink dark:text-zinc-50 md:text-4xl">
                  Doeshing Gazette
                </h1>
              </Link>
              <p className="text-sm text-newspaper-gray dark:text-zinc-400">
                Content management and editorial control panel
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="hidden items-center gap-2 border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-gray transition hover:border-newspaper-ink hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-white/10 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 md:inline-flex"
              >
                <ExternalLink size={14} strokeWidth={1.5} />
                View Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation section - similar to front-end Navigation */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-newspaper-paper/95 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/95">
        <div className="mx-auto max-w-6xl px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-newspaper-ink dark:text-zinc-100 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              Menu
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:gap-10">
              {navLinks.map((link) => {
                const active =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
                      active
                        ? "text-newspaper-accent dark:text-red-400"
                        : "text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-3 text-xs text-newspaper-gray dark:text-zinc-400 md:flex">
                <span>{session?.user?.email}</span>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden items-center gap-2 border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-gray transition hover:border-newspaper-accent hover:bg-newspaper-accent hover:text-white dark:border-white/10 dark:text-zinc-400 dark:hover:border-red-400 dark:hover:bg-red-400 md:inline-flex"
              >
                <LogOut size={14} strokeWidth={1.5} />
                Sign Out
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "border-t border-black/10 px-4 pb-6 pt-2 dark:border-white/10 md:hidden",
              mobileMenuOpen ? "block" : "hidden"
            )}
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const active =
                  link.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-semibold uppercase tracking-[0.22em]",
                      active
                        ? "text-newspaper-accent dark:text-red-400"
                        : "text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-black/10 pt-3 dark:border-white/10">
                <div className="mb-3 text-xs text-newspaper-gray dark:text-zinc-400">
                  {session?.user?.email}
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-gray transition hover:border-newspaper-accent hover:bg-newspaper-accent hover:text-white dark:border-white/10 dark:text-zinc-400 dark:hover:border-red-400 dark:hover:bg-red-400"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
