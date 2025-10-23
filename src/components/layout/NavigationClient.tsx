"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchButton } from "@/components/ui/Search";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Category } from "@/lib/blog";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavigationClientProps {
  categories: Category[];
}

export function NavigationClient({ categories }: NavigationClientProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [mobileArchiveOpen, setMobileArchiveOpen] = useState(false);

  useEffect(() => {
    void pathname;
    setOpen(false);
    setArchiveOpen(false);
    setMobileArchiveOpen(false);
  }, [pathname]);

  // Build nested category tree - add safety check
  const categoryTree = buildCategoryTree(categories || []);

  return (
    <nav
      aria-label="Primary Navigation"
      className="sticky top-0 z-50 border-b border-black/10 bg-newspaper-paper/95 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/95"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        {/* Mobile Menu Button */}
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-10">
          {NAV_LINKS.map((link) => {
            if (link.href === "/archive") {
              const active = pathname.startsWith(link.href);
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setArchiveOpen(true)}
                  onMouseLeave={() => setArchiveOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
                      active
                        ? "text-newspaper-accent dark:text-red-400"
                        : "text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
                    )}
                  >
                    {link.label}
                    {categoryTree.length > 0 && (
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform",
                          archiveOpen && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu - No gap between trigger and menu */}
                  {categoryTree.length > 0 && archiveOpen && (
                    <div className="absolute left-0 top-full pt-2 w-56">
                      <div className="border border-black/10 bg-newspaper-paper shadow-editorial dark:border-white/10 dark:bg-zinc-900 py-2">
                        {categoryTree.map((category) => (
                          <CategoryMenuItem
                            key={category.path}
                            category={category}
                            pathname={pathname}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
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

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchButton />
          </div>
          <Link
            href="/newsletter"
            className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-newspaper-accent dark:text-red-400 md:inline"
          >
            Newsletter
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-nav"
        className={cn(
          "border-t border-black/10 px-4 pb-6 pt-2 dark:border-white/10 md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-3">
          {NAV_LINKS.map((link) => {
            if (link.href === "/archive") {
              const active = pathname.startsWith(link.href);
              return (
                <div key={link.href} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <Link
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
                    {categoryTree.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMobileArchiveOpen((prev) => !prev)}
                        className="p-1"
                        aria-label="Toggle categories"
                      >
                        <ChevronDown
                          size={16}
                          className={cn(
                            "text-newspaper-gray transition-transform dark:text-zinc-400",
                            mobileArchiveOpen && "rotate-180"
                          )}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Category Submenu */}
                  {categoryTree.length > 0 && mobileArchiveOpen && (
                    <div className="ml-4 mt-2 flex flex-col gap-2 border-l border-black/10 pl-4 dark:border-white/10">
                      {categoryTree.map((category) => (
                        <MobileCategoryMenuItem
                          key={category.path}
                          category={category}
                          pathname={pathname}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
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

// Desktop Category Menu Item with nested children
function CategoryMenuItem({
  category,
  pathname,
  level = 0,
}: {
  category: CategoryWithChildren;
  pathname: string;
  level?: number;
}) {
  const [open, setOpen] = useState(false);
  const active = pathname.startsWith(`/category/${category.path}`);

  return (
    <div
      onMouseEnter={() => category.children.length > 0 && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative"
    >
      <Link
        href={`/category/${category.path}`}
        className={cn(
          "flex items-center justify-between px-4 py-2 text-xs uppercase tracking-[0.25em] transition-colors",
          active
            ? "bg-newspaper-accent/10 text-newspaper-accent dark:bg-red-400/10 dark:text-red-400"
            : "text-newspaper-gray hover:bg-black/5 hover:text-newspaper-ink dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100"
        )}
        style={{ paddingLeft: `${(level + 1) * 1}rem` }}
      >
        <span>
          {category.name}
          <span className="ml-2 text-[10px] text-newspaper-gray dark:text-zinc-500">
            {category.count}
          </span>
        </span>
        {category.children.length > 0 && <ChevronDown size={12} className="-rotate-90" />}
      </Link>

      {/* Nested Submenu - overlaps slightly to avoid gap */}
      {category.children.length > 0 && open && (
        <div className="absolute left-full top-0 -ml-px w-56 border border-black/10 bg-newspaper-paper shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          <div className="py-2">
            {category.children.map((child) => (
              <CategoryMenuItem
                key={child.path}
                category={child}
                pathname={pathname}
                level={0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile Category Menu Item with collapsible children
function MobileCategoryMenuItem({
  category,
  pathname,
  level = 0,
}: {
  category: CategoryWithChildren;
  pathname: string;
  level?: number;
}) {
  const [open, setOpen] = useState(false);
  const active = pathname.startsWith(`/category/${category.path}`);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <Link
          href={`/category/${category.path}`}
          className={cn(
            "flex-1 text-xs uppercase tracking-[0.22em] transition-colors",
            active
              ? "text-newspaper-accent dark:text-red-400"
              : "text-newspaper-gray hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
          style={{ paddingLeft: `${level * 0.5}rem` }}
        >
          {category.name}
          <span className="ml-2 text-[10px] text-newspaper-gray dark:text-zinc-500">
            {category.count}
          </span>
        </Link>
        {category.children.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="p-1"
            aria-label={`Toggle ${category.name} subcategories`}
          >
            <ChevronDown
              size={14}
              className={cn(
                "text-newspaper-gray transition-transform dark:text-zinc-400",
                open && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* Nested Children */}
      {category.children.length > 0 && open && (
        <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-black/10 pl-3 dark:border-white/10">
          {category.children.map((child) => (
            <MobileCategoryMenuItem
              key={child.path}
              category={child}
              pathname={pathname}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper types and functions
interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

function buildCategoryTree(categories: Category[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>();

  // Initialize all categories with empty children
  for (const cat of categories) {
    categoryMap.set(cat.path, { ...cat, children: [] });
  }

  const roots: CategoryWithChildren[] = [];

  // Build the tree
  for (const cat of categories) {
    const category = categoryMap.get(cat.path)!;

    if (cat.parent) {
      const parent = categoryMap.get(cat.parent);
      if (parent) {
        parent.children.push(category);
      } else {
        roots.push(category);
      }
    } else {
      roots.push(category);
    }
  }

  return roots;
}
