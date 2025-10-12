"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface TagWithCount {
  slug: string;
  name: string;
  count: number;
}

interface TagFilterProps {
  tags: TagWithCount[];
}

export function TagFilter({ tags }: TagFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const createLink = (tag?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
      params.delete("page");
    } else {
      params.delete("tag");
      params.delete("page");
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-black/10 bg-white px-6 py-4 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray">
        Filter by tag
      </span>
      <Link href={createLink()} aria-label="Show all posts">
        <Badge variant={!activeTag ? "accent" : "outline"}>All</Badge>
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={createLink(tag.slug)}
          aria-label={`Filter by ${tag.name}`}
        >
          <Badge
            variant={activeTag === tag.slug ? "accent" : "outline"}
            className={cn(activeTag === tag.slug && "border-newspaper-accent")}
          >
            {tag.name}
            <span className="ml-2 text-[9px] tracking-normal text-newspaper-gray">
              {tag.count}
            </span>
          </Badge>
        </Link>
      ))}
    </div>
  );
}
