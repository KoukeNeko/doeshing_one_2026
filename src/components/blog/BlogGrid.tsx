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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Headline post - spans full width */}
      {featured[0] && (
        <BlogCard
          key={featured[0].id}
          post={featured[0]}
          featured={true}
          orientation="horizontal"
        />
      )}
      
      {/* Other featured posts - normal grid items */}
      {featured.slice(1).map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          featured={false}
          orientation="vertical"
        />
      ))}
      
      {/* Remaining posts - normal grid items */}
      {remaining.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
