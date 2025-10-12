"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AdminHeader() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="text-xl font-serif font-bold text-newspaper-ink dark:text-zinc-50"
            >
              Doeshing Admin
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:gap-6">
              <Link
                href="/admin"
                className="text-sm font-medium text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/blog"
                className="text-sm font-medium text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Blog Posts
              </Link>
              <Link
                href="/admin/work"
                className="text-sm font-medium text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Work
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm font-medium text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-50 md:block"
            >
              View Site
            </Link>
            <ThemeToggle />
            <div className="hidden md:flex md:items-center md:gap-4">
              <span className="text-sm text-newspaper-gray dark:text-zinc-400">
                {session?.user?.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 rounded-md bg-newspaper-accent px-3 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-black/10 py-4 md:hidden dark:border-white/10">
            <nav className="flex flex-col gap-4">
              <Link
                href="/admin"
                className="text-sm font-medium text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/blog"
                className="text-sm font-medium text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog Posts
              </Link>
              <Link
                href="/admin/work"
                className="text-sm font-medium text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Work
              </Link>
              <Link
                href="/"
                target="_blank"
                className="text-sm font-medium text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                View Site
              </Link>
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                <span className="text-sm text-newspaper-gray dark:text-zinc-400">
                  {session?.user?.email}
                </span>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 rounded-md bg-newspaper-accent px-3 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
