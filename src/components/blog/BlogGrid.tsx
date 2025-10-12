import type { BlogPostListItem } from "@/types/content";
import { BlogCard } from "./BlogCard";

interface BlogGridProps {
  posts: BlogPostListItem[];
  featuredCount?: number;
}

export function BlogGrid({ posts, featuredCount = 1 }: BlogGridProps) {
  if (!posts.length) {
    return (
      <div className="border border-dashed border-black/20 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.35em] text-newspaper-gray dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-400">
        No posts yet. Fresh ink is on the way.
      </div>
    );
  }

  const [headline, ...rest] = posts;
  const featured = [headline, ...rest.slice(0, featuredCount - 1)].filter(
    Boolean,
  );
  const remaining = rest.slice(featuredCount - 1);

  return (
    <div className="flex flex-col gap-12">
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map(
          (post, index) =>
            post && (
              <BlogCard
                key={post.id}
                post={post}
                featured={index === 0}
                orientation={index === 0 ? "horizontal" : "vertical"}
              />
            ),
        )}
      </section>
      {remaining.length > 0 ? (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {remaining.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
