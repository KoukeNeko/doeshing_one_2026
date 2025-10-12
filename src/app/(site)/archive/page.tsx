import Link from "next/link";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { TagFilter } from "@/components/blog/TagFilter";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedPosts, getTagsWithCount } from "@/lib/blog";
import { FEATURED_POST_LIMIT, POSTS_PER_PAGE } from "@/lib/constants";

// Revalidate this page every 60 seconds
export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const search = toStringParam(params.search);
  const tag = toStringParam(params.tag);
  const sortParam = toStringParam(params.sort);
  const pageParam = toStringParam(params.page);

  const page = Math.max(Number(pageParam ?? "1"), 1);
  const sort = sortParam === "views" ? "views" : "latest";

  const [{ posts, total }, tags] = await Promise.all([
    getPublishedPosts({ search, tag, sort, page, perPage: POSTS_PER_PAGE }),
    getTagsWithCount(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    if (sort !== "latest") params.set("sort", sort);
    if (targetPage > 1) params.set("page", targetPage.toString());
    return params.toString() ? `?${params.toString()}` : "";
  };

  return (
    <div className="space-y-10">
      <header className="space-y-6">
        <SectionHeading
          kicker="The Archive"
          title="Stories on design, code, and creative systems"
          description="Essays, field notes, and interviews exploring how modern tools meet timeless editorial principles."
        />
        <div className="flex flex-col gap-4 border border-black/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
          <form
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-center"
            action=""
            method="get"
          >
            <label className="flex flex-1 items-center gap-3 border border-black/10 px-4 py-2 focus-within:border-newspaper-ink dark:border-white/10 dark:focus-within:border-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                Search
              </span>
              <input
                type="search"
                name="search"
                defaultValue={search ?? ""}
                placeholder="Keywords, topics, or tags"
                className="w-full bg-transparent text-sm uppercase tracking-[0.25em] text-newspaper-ink outline-none placeholder:text-newspaper-gray dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400"
              >
                Sort
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.25em] text-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="latest">Latest</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center border border-newspaper-ink px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-ink transition hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
            >
              Update
            </button>
          </form>
          <div className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
            <span className="font-semibold text-newspaper-ink dark:text-zinc-100">{total}</span>{" "}
            articles
          </div>
        </div>
      </header>

      <TagFilter tags={tags} />

      <BlogGrid posts={posts} featuredCount={FEATURED_POST_LIMIT} />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
            Active filters
          </span>
          <div className="flex flex-wrap gap-2">
            {search ? <Badge variant="outline">Search: {search}</Badge> : null}
            {tag ? <Badge variant="outline">Tag: {tag}</Badge> : null}
            {sort === "views" ? (
              <Badge variant="outline">Most Viewed</Badge>
            ) : null}
            {!search && !tag && sort === "latest" ? (
              <Badge variant="outline">Default</Badge>
            ) : null}
          </div>
        </div>
        <Link
          href="/archive"
          className="text-xs uppercase tracking-[0.3em] text-newspaper-accent dark:text-red-400"
        >
          Reset
        </Link>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={buildHref}
      />
    </div>
  );
}

function toStringParam(param?: string | string[]) {
  if (Array.isArray(param)) return param[0];
  return param ?? undefined;
}
