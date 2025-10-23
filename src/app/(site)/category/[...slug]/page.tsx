import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedPosts, getCategoriesWithCount } from "@/lib/blog";
import { FEATURED_POST_LIMIT, POSTS_PER_PAGE } from "@/lib/constants";

// Revalidate this page every 60 seconds
export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug: slugArray } = await params;
  const searchParamsData = await searchParams;

  // Join slug array to get full category path (e.g., ["tutorials", "advanced"] -> "tutorials/advanced")
  const categoryPath = slugArray.join("/");

  const search = toStringParam(searchParamsData.search);
  const sortParam = toStringParam(searchParamsData.sort);
  const pageParam = toStringParam(searchParamsData.page);

  const page = Math.max(Number(pageParam ?? "1"), 1);
  const sort = sortParam === "views" ? "views" : "latest";

  const [{ posts, total }, categories] = await Promise.all([
    getPublishedPosts({
      category: categoryPath,
      search,
      sort,
      page,
      perPage: POSTS_PER_PAGE,
    }),
    getCategoriesWithCount(),
  ]);

  // Find the current category
  const currentCategory = categories.find((c) => c.path === categoryPath);
  if (!currentCategory) {
    notFound();
  }

  // Get subcategories
  const subcategories = categories.filter(
    (c) => c.parent === categoryPath
  );

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort !== "latest") params.set("sort", sort);
    if (targetPage > 1) params.set("page", targetPage.toString());
    return params.toString() ? `?${params.toString()}` : "";
  };

  // Build breadcrumb
  const breadcrumbs = categoryPath.split("/").map((part, index, arr) => {
    const path = arr.slice(0, index + 1).join("/");
    const cat = categories.find((c) => c.path === path);
    return {
      name: cat?.name || part,
      path: path,
    };
  });

  return (
    <div className="space-y-10">
      <header className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
          <Link
            href="/archive"
            className="transition hover:text-newspaper-ink dark:hover:text-zinc-100"
          >
            Archive
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="flex items-center gap-2">
              <span>/</span>
              {index === breadcrumbs.length - 1 ? (
                <span className="text-newspaper-ink dark:text-zinc-100">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={`/category/${crumb.path}`}
                  className="transition hover:text-newspaper-ink dark:hover:text-zinc-100"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <SectionHeading
          kicker={`Category: ${currentCategory.name}`}
          title={`${currentCategory.name} Articles`}
          description={`Browse all articles in the ${currentCategory.name} category.`}
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
                placeholder="Search in this category"
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
            <span className="font-semibold text-newspaper-ink dark:text-zinc-100">
              {total}
            </span>{" "}
            articles
          </div>
        </div>
      </header>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-y border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            Subcategories
          </span>
          {subcategories.map((subcat) => (
            <Link
              key={subcat.path}
              href={`/category/${subcat.path}`}
              aria-label={`View ${subcat.name} category`}
            >
              <Badge variant="outline">
                {subcat.name}
                <span className="ml-2 text-[9px] tracking-normal text-newspaper-gray dark:text-zinc-400">
                  {subcat.count}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <BlogGrid posts={posts} featuredCount={FEATURED_POST_LIMIT} />

      <div className="flex flex-wrap items-center justify-between gap-3 border border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
            Active filters
          </span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Category: {currentCategory.name}</Badge>
            {search ? <Badge variant="outline">Search: {search}</Badge> : null}
            {sort === "views" ? (
              <Badge variant="outline">Most Viewed</Badge>
            ) : null}
          </div>
        </div>
        <Link
          href="/archive"
          className="text-xs uppercase tracking-[0.3em] text-newspaper-accent dark:text-red-400"
        >
          Back to Archive
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
