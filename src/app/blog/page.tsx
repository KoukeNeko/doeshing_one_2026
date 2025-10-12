import Link from "next/link";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { TagFilter } from "@/components/blog/TagFilter";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedPosts, getTagsWithCount } from "@/lib/blog";
import { FEATURED_POST_LIMIT, POSTS_PER_PAGE } from "@/lib/constants";

interface BlogPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const search = toStringParam(searchParams.search);
  const tag = toStringParam(searchParams.tag);
  const sortParam = toStringParam(searchParams.sort);
  const pageParam = toStringParam(searchParams.page);

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
          kicker="The Editorial Log"
          title="Stories on design, code, and creative systems"
          description="Dive into essays, field notes, and interviews that explore how modern tools meet timeless editorial principles."
        />
        <div className="flex flex-col gap-4 border border-black/10 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <form
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-center"
            action=""
            method="get"
          >
            <label className="flex flex-1 items-center gap-3 border border-black/10 px-4 py-2 focus-within:border-newspaper-ink">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray">
                Search
              </span>
              <input
                type="search"
                name="search"
                defaultValue={search ?? ""}
                placeholder="Keywords, topics, or tags"
                className="w-full bg-transparent text-sm uppercase tracking-[0.25em] text-newspaper-ink outline-none placeholder:text-newspaper-gray"
              />
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray"
              >
                Sort
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.25em] text-newspaper-ink"
              >
                <option value="latest">Latest</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center border border-newspaper-ink px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-ink transition hover:bg-newspaper-ink hover:text-newspaper-paper"
            >
              Update
            </button>
          </form>
          <div className="text-xs uppercase tracking-[0.3em] text-newspaper-gray">
            <span className="font-semibold text-newspaper-ink">{total}</span>{" "}
            articles
          </div>
        </div>
      </header>

      <TagFilter tags={tags} />

      <BlogGrid posts={posts} featuredCount={FEATURED_POST_LIMIT} />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-black/10 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray">
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
          href="/blog"
          className="text-xs uppercase tracking-[0.3em] text-newspaper-accent"
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
