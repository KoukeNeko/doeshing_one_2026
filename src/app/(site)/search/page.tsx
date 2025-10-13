import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
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
  const popularTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 10);

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
    return `/search${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <div className="space-y-10">
      <header className="space-y-6">
        <SectionHeading
          kicker="Search"
          title="Find stories, experiments, and field notes"
          description="Search the archive by keywords, topics, or tags to discover relevant content."
        />
        
        {/* Main Search Form */}
        <div className="border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900">
          <form action="/search" method="get" className="space-y-5">
            {/* Search Input */}
            <div className="space-y-2">
              <label
                htmlFor="site-search-query"
                className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400"
              >
                Search Query
              </label>
              <div className="flex items-center gap-3 border border-black/10 bg-newspaper-paper px-4 py-3 focus-within:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:focus-within:border-zinc-300">
                <SearchIcon
                  size={18}
                  strokeWidth={1.5}
                  className="text-newspaper-gray dark:text-zinc-400"
                />
                <input
                  id="site-search-query"
                  type="search"
                  name="search"
                  defaultValue={search ?? ""}
                  placeholder="Try keywords, phrases, or tags..."
                  className="w-full bg-transparent text-sm uppercase tracking-[0.25em] text-newspaper-ink outline-none placeholder:text-newspaper-gray dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  autoFocus={!search}
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="search-sort"
                  className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400"
                >
                  Sort By
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

              <button
                type="submit"
                className="inline-flex items-center justify-center border border-newspaper-ink px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-ink transition hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
              >
                Search
              </button>
            </div>

            {/* Search Stats */}
            {search && (
              <div className="border-t border-black/10 pt-4 dark:border-white/10">
                <p className="text-xs uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
                  Found{" "}
                  <span className="font-semibold text-newspaper-ink dark:text-zinc-100">
                    {searchResults.total}
                  </span>{" "}
                  {searchResults.total === 1 ? "article" : "articles"} for "{search}"
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="border border-black/10 bg-white px-6 py-5 dark:border-white/10 dark:bg-zinc-900">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
                Popular Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/search?search=${encodeURIComponent(tag.name)}` as any}
                    className="inline-flex"
                  >
                    <Badge 
                      variant="outline"
                      className="transition hover:border-newspaper-ink hover:text-newspaper-ink dark:hover:border-zinc-100 dark:hover:text-zinc-100"
                    >
                      {tag.name}
                      <span className="ml-2 text-[10px] tracking-normal text-newspaper-gray dark:text-zinc-500">
                        {tag.count}
                      </span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Results */}
      {search ? (
        searchResults.posts.length > 0 ? (
          <div className="space-y-10">
            <BlogGrid posts={searchResults.posts} featuredCount={0} />
            {searchResults.total > POSTS_PER_PAGE && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                buildHref={buildHref}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6 border border-black/10 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-zinc-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-black/10 dark:border-white/10">
              <SearchIcon
                size={24}
                strokeWidth={1.5}
                className="text-newspaper-gray dark:text-zinc-400"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-newspaper-ink dark:text-zinc-100">
                No Results Found
              </h3>
              <p className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                No articles matched "{search}"
              </p>
            </div>
            <div className="space-y-3 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
                Suggestions:
              </p>
              <ul className="space-y-1 text-xs text-newspaper-gray dark:text-zinc-400">
                <li>• Try different keywords or phrases</li>
                <li>• Check spelling and try again</li>
                <li>• Use more general search terms</li>
                <li>• Browse by <Link href="/archive" className="underline hover:text-newspaper-ink dark:hover:text-zinc-100">popular tags</Link></li>
              </ul>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-6 border border-black/10 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-zinc-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-black/10 dark:border-white/10">
            <SearchIcon
              size={24}
              strokeWidth={1.5}
              className="text-newspaper-gray dark:text-zinc-400"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-newspaper-ink dark:text-zinc-100">
              Ready to Search
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
              Enter keywords above to search the archive
            </p>
          </div>
          <div className="space-y-3 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-newspaper-gray dark:text-zinc-400">
              Search Tips:
            </p>
            <ul className="space-y-1 text-xs text-newspaper-gray dark:text-zinc-400">
              <li>• Use specific keywords for better results</li>
              <li>• Try project names or technology terms</li>
              <li>• Browse <Link href="/archive" className="underline hover:text-newspaper-ink dark:hover:text-zinc-100">all articles</Link> or filter by tags</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function toStringParam(param?: string | string[]) {
  if (Array.isArray(param)) return param[0];
  return param ?? undefined;
}
