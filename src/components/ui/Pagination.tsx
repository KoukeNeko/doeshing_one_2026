import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 border border-black/10 bg-white px-4 py-4 dark:border-white/10 dark:bg-zinc-900"
    >
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page) as any}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center border border-black/10 text-xs font-semibold uppercase tracking-[0.25em] transition dark:border-white/10",
            page === currentPage
              ? "bg-newspaper-ink text-newspaper-paper dark:bg-zinc-100 dark:text-zinc-900"
              : "hover:border-newspaper-ink hover:text-newspaper-ink dark:hover:border-zinc-100 dark:hover:text-zinc-100",
          )}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page.toString().padStart(2, "0")}
        </Link>
      ))}
    </nav>
  );
}
