import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db";

interface SearchParams {
  search?: string;
  status?: string;
  page?: string;
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "all";
  const page = Number.parseInt(params.page || "1", 10);
  const perPage = 20;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { excerpt: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(status === "published" && { published: true }),
    ...(status === "draft" && { published: false }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: true,
        tags: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-black/10 pb-6 dark:border-white/10">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
                Content Management
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-newspaper-ink dark:text-zinc-50">
              Blog Posts
            </h1>
            <p className="mt-3 text-sm text-newspaper-gray dark:text-zinc-400">
              Manage your blog articles
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 border border-newspaper-ink bg-newspaper-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-paper transition hover:bg-newspaper-accent hover:border-newspaper-accent dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-red-400 dark:hover:border-red-400"
          >
            <Plus size={16} strokeWidth={1.5} />
            New Post
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="border border-black/10 bg-white p-6 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            Search & Filter
          </h2>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative flex items-center border border-black/10 bg-newspaper-paper transition focus-within:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:focus-within:border-zinc-300">
              <Search
                size={18}
                strokeWidth={1.5}
                className="ml-4 text-newspaper-gray dark:text-zinc-400"
              />
              <input
                type="text"
                placeholder="Search posts..."
                defaultValue={search}
                className="w-full bg-transparent px-4 py-3 text-sm text-newspaper-ink outline-none placeholder:text-newspaper-gray/50 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>
          <select
            defaultValue={status}
            className="border border-black/10 bg-newspaper-paper px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-newspaper-ink outline-none transition focus:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-300"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden border border-black/10 bg-white shadow-editorial dark:border-white/10 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-black/10 bg-newspaper-paper dark:border-white/10 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="transition hover:bg-newspaper-paper dark:hover:bg-zinc-800"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-newspaper-ink dark:text-zinc-50">
                        {post.title}
                      </div>
                      <div className="mt-1 text-sm text-newspaper-gray dark:text-zinc-400">
                        {post.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        post.published
                          ? "border-green-600 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-400"
                          : "border-gray-400 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex border border-black/10 bg-newspaper-paper px-2 py-1 text-xs text-newspaper-gray dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-flex border border-black/10 bg-newspaper-paper px-2 py-1 text-xs text-newspaper-gray dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-newspaper-gray dark:text-zinc-400">
                    {post.views}
                  </td>
                  <td className="px-6 py-4 text-sm text-newspaper-gray dark:text-zinc-400">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-newspaper-accent transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/archive/${post.slug}`}
                        target="_blank"
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-newspaper-gray transition hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-black/10 pt-6 dark:border-white/10">
          <div className="text-xs uppercase tracking-[0.25em] text-newspaper-gray dark:text-zinc-400">
            Showing {(page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, total)} of {total} posts
          </div>
          <div className="flex gap-3">
            {page > 1 && (
              <Link
                href={`/admin/blog?page=${page - 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}`}
                className="border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-ink transition hover:border-newspaper-ink hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-white/10 dark:text-zinc-100 dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/blog?page=${page + 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}`}
                className="border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-ink transition hover:border-newspaper-ink hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-white/10 dark:text-zinc-100 dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="border border-black/10 bg-white p-12 text-center shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          <p className="mb-6 text-sm text-newspaper-gray dark:text-zinc-400">
            No posts found. Create your first post!
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 border border-newspaper-ink bg-newspaper-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-paper transition hover:bg-newspaper-accent hover:border-newspaper-accent dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-red-400 dark:hover:border-red-400"
          >
            <Plus size={16} strokeWidth={1.5} />
            New Post
          </Link>
        </div>
      )}
    </div>
  );
}
