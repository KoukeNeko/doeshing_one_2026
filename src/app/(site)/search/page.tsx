import Link from "next/link";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedPosts, getTagsWithCount } from "@/lib/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";

export const revalidate = 60;

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const search = toStringParam(params.search);
  const sortParam = toStringParam(params.sort);
  const pageParam = toStringParam(params.page);

  const page = Math.max(Number(pageParam ?? "1"), 1);
  const sort = sortParam === "views" ? "views" : "latest";

  const tags = await getTagsWithCount();
  const popularTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 8);

  const searchResults = search
    ? await getPublishedPosts({
        search,
        sort,
        page,
        perPage: POSTS_PER_PAGE,
      })
    : { posts: [], total: 0 };

  const totalPages = Math.max(
    1,
    Math.ceil(searchResults.total / POSTS_PER_PAGE),
  );

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort !== "latest") params.set("sort", sort);
    if (targetPage > 1) params.set("page", targetPage.toString());
    return params.toString() ? `?${params.toString()}` : "";
  };

  return (
    <div className="space-y-10">
      <header className="space-y-6">
        <SectionHeading
          kicker="Search the Gazette"
          title="Find stories, experiments, and field notes"
          description="Look up topics, keywords, or tags to surface the most relevant pieces from the archive."
        />
        <div className="grid gap-5 border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900 lg:grid-cols-[minmax(0,1fr),minmax(280px,320px)] lg:items-start">
          <form className="space-y-4" action="/search" method="get">
            <div className="space-y-2">
              <label
                htmlFor="site-search-query"
                className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400"
              >
                Search
              </label>
              <div className="flex items-center gap-3 border border-black/10 bg-newspaper-paper px-4 py-3 focus-within:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:focus-within:border-zinc-300">
                <input
                  id="site-search-query"
                  type="search"
                  name="search"
                  defaultValue={search ?? ""}
                  placeholder="Try keywords, phrases, or tags"
                  className="w-full bg-transparent text-sm uppercase tracking-[0.25em] text-newspaper-ink outline-none placeholder:text-newspaper-gray dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-accent transition hover:text-newspaper-ink dark:text-red-400 dark:hover:text-zinc-100"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="search-sort"
                className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400"
              >
                Sort
              </label>
              <select
                id="search-sort"
                name="sort"
                defaultValue={sort}
                className="border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.25em] text-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="latest">Latest</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
            {search ? (
              <p className="text-xs uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-newspaper-ink dark:text-zinc-100">
                  {searchResults.total}
                </span>{" "}
                articles for “{search}”
              </p>
            ) : (
              <p className="text-xs uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
                Enter a keyword to explore the archive.
              </p>
            )}
          </form>

          <aside className="space-y-4 rounded-sm border border-dashed border-black/20 bg-newspaper-paper px-5 py-4 dark:border-white/20 dark:bg-zinc-800">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
              Quick Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {popularTags.length ? (
                popularTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/search?search=${encodeURIComponent(tag.name)}`}
                    className="inline-flex"
                  >
                    <Badge variant="outline">
                      {tag.name}
                      <span className="ml-2 text-[10px] tracking-normal text-newspaper-gray dark:text-zinc-400">
                        {tag.count}
                      </span>
                    </Badge>
                  </Link>
                ))
              ) : (
                <span className="text-xs uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
                  Tags populate automatically once posts are published.
                </span>
              )}
            </div>
          </aside>
        </div>
      </header>

      {search ? (
        searchResults.posts.length ? (
          <>
            <BlogGrid posts={searchResults.posts} featuredCount={1} />
            {searchResults.total > POSTS_PER_PAGE ? (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                buildHref={buildHref}
              />
            ) : null}
          </>
        ) : (
          <div className="space-y-6 border border-black/10 bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-zinc-900">
            <p className="text-sm uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
              No articles matched “{search}”
            </p>
            <p className="text-xs text-newspaper-gray dark:text-zinc-400">
              Try a different keyword or explore one of the suggested tags.
            </p>
          </div>
        )
      ) : (
        <div className="space-y-4 border border-black/10 bg-white px-6 py-10 text-center dark:border-white/10 dark:bg-zinc-900">
          <p className="text-sm uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            Start typing to search the archive
          </p>
          <p className="text-xs text-newspaper-gray dark:text-zinc-400">
            Use keywords, project names, or topic areas to surface the most
            relevant stories.
          </p>
        </div>
      )}
    </div>
  );
}

function toStringParam(param?: string | string[]) {
  if (Array.isArray(param)) return param[0];
  return param ?? undefined;
}
