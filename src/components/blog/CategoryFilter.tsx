import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/lib/blog";

interface CategoryFilterProps {
  categories: Category[];
  currentCategory?: string;
}

export function CategoryFilter({
  categories,
  currentCategory,
}: CategoryFilterProps) {
  // Only show top-level categories (level 0)
  const topLevelCategories = categories.filter((cat) => cat.level === 0);

  if (topLevelCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
        Filter by category
      </span>
      <Link href="/archive" aria-label="Show all posts">
        <Badge variant={!currentCategory ? "accent" : "outline"}>All</Badge>
      </Link>
      {topLevelCategories.map((category) => {
        const isActive = currentCategory === category.path;
        return (
          <Link
            key={category.path}
            href={`/category/${category.path}`}
            aria-label={`Filter by ${category.name}`}
          >
            <Badge variant={isActive ? "accent" : "outline"}>
              {category.name}
              <span className="ml-2 text-[9px] tracking-normal text-newspaper-gray dark:text-zinc-400">
                {category.count}
              </span>
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
