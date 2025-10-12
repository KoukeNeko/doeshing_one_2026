import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPostListItem } from "@/types/content";

interface BlogCardProps {
  post: BlogPostListItem;
  featured?: boolean;
  orientation?: "vertical" | "horizontal";
}

export function BlogCard({
  post,
  featured = false,
  orientation = "vertical",
}: BlogCardProps) {
  return (
    <article
      className={cn(
        "group border border-black/10 bg-white shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:shadow-editorial",
        featured && "md:col-span-2 lg:col-span-3",
        orientation === "horizontal"
          ? "flex flex-col md:flex-row"
          : "flex flex-col",
      )}
    >
      {post.coverImage ? (
        <Link
          href={`/blog/${post.slug}`}
          className={cn(
            "relative aspect-[16/10] w-full overflow-hidden border-b border-black/10 bg-newspaper-paper",
            orientation === "horizontal"
              ? "md:w-1/2 md:border-b-0 md:border-r"
              : "",
          )}
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      ) : null}
      <div
        className={cn(
          "flex flex-1 flex-col px-6 py-6 sm:px-8",
          orientation === "horizontal" ? "md:w-1/2" : "",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
        <h3 className="mt-5 font-serif text-2xl tracking-tight text-newspaper-ink md:text-3xl">
          <Link
            href={`/blog/${post.slug}`}
            className="transition hover:text-newspaper-accent"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-3 text-sm text-newspaper-gray">{post.excerpt}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-6 text-xs uppercase tracking-[0.3em] text-newspaper-gray">
          <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          <span>{post.readingTime ?? "—"}</span>
        </div>
      </div>
    </article>
  );
}
