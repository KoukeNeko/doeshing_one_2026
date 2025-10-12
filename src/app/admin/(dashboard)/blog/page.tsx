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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-newspaper-ink dark:text-zinc-50">
            Blog Posts
          </h1>
          <p className="mt-2 text-newspaper-gray dark:text-zinc-400">
            Manage your blog articles
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-md bg-newspaper-accent px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900 sm:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-newspaper-gray dark:text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search posts..."
              defaultValue={search}
              className="w-full rounded-md border border-black/10 bg-white py-2 pl-10 pr-4 text-sm focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:focus:border-red-400 dark:focus:ring-red-400"
            />
          </div>
        </div>
        <select
          defaultValue={status}
          className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:focus:border-red-400 dark:focus:ring-red-400"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-newspaper-gray dark:text-zinc-400">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-newspaper-gray dark:text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-newspaper-gray dark:text-zinc-400">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-newspaper-gray dark:text-zinc-400">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-newspaper-gray dark:text-zinc-400">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-newspaper-gray dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
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
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        post.published
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
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
                          className="inline-flex rounded-md bg-zinc-100 px-2 py-1 text-xs text-newspaper-gray dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-flex rounded-md bg-zinc-100 px-2 py-1 text-xs text-newspaper-gray dark:bg-zinc-800 dark:text-zinc-400">
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
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-sm font-medium text-newspaper-accent hover:underline dark:text-red-400"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/archive/${post.slug}`}
                        target="_blank"
                        className="text-sm font-medium text-newspaper-gray hover:underline dark:text-zinc-400"
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-newspaper-gray dark:text-zinc-400">
            Showing {(page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, total)} of {total} posts
          </div>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/blog?page=${page - 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}`}
                className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/blog?page=${page + 1}${search ? `&search=${search}` : ""}${status !== "all" ? `&status=${status}` : ""}`}
                className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="rounded-lg border border-black/10 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-900">
          <p className="text-newspaper-gray dark:text-zinc-400">
            No posts found. Create your first post!
          </p>
          <Link
            href="/admin/blog/new"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-newspaper-accent px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
          >
            <Plus size={16} />
            New Post
          </Link>
        </div>
      )}
    </div>
  );
}
