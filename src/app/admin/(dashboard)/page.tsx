import Link from "next/link";
import { FileText, FolderOpen, Eye, Tag } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  // 獲取統計數據
  const [totalPosts, publishedPosts, totalTags, totalViews] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.tag.count(),
    prisma.post.aggregate({
      _sum: {
        views: true,
      },
    }),
  ]);

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: {
      author: true,
      tags: true,
    },
  });

  const stats = [
    {
      name: "Total Posts",
      value: totalPosts,
      icon: FileText,
      href: "/admin/blog",
      color: "bg-blue-500",
    },
    {
      name: "Published",
      value: publishedPosts,
      icon: FolderOpen,
      href: "/admin/blog?status=published",
      color: "bg-green-500",
    },
    {
      name: "Total Views",
      value: totalViews._sum.views || 0,
      icon: Eye,
      href: "/admin/blog",
      color: "bg-purple-500",
    },
    {
      name: "Tags",
      value: totalTags,
      icon: Tag,
      href: "/admin/blog",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-newspaper-ink dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-newspaper-gray dark:text-zinc-400">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href as any}
            className="group relative overflow-hidden rounded-lg border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg ${stat.color} p-3 text-white`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-newspaper-gray dark:text-zinc-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-newspaper-ink dark:text-zinc-50">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-newspaper-ink dark:text-zinc-50 mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/blog/new"
            className="rounded-lg border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
          >
            <h3 className="font-semibold text-newspaper-ink dark:text-zinc-50">
              New Blog Post
            </h3>
            <p className="mt-2 text-sm text-newspaper-gray dark:text-zinc-400">
              Create a new blog article
            </p>
          </Link>
          <Link
            href="/admin/work"
            className="rounded-lg border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
          >
            <h3 className="font-semibold text-newspaper-ink dark:text-zinc-50">
              Manage Work
            </h3>
            <p className="mt-2 text-sm text-newspaper-gray dark:text-zinc-400">
              Edit project case studies
            </p>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-black/10 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900"
          >
            <h3 className="font-semibold text-newspaper-ink dark:text-zinc-50">
              View Site
            </h3>
            <p className="mt-2 text-sm text-newspaper-gray dark:text-zinc-400">
              Preview your website
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-newspaper-ink dark:text-zinc-50">
            Recent Posts
          </h2>
          <Link
            href="/admin/blog"
            className="text-sm font-medium text-newspaper-accent hover:underline dark:text-red-400"
          >
            View all
          </Link>
        </div>
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
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-newspaper-gray dark:text-zinc-400">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="font-medium text-newspaper-ink hover:text-newspaper-accent dark:text-zinc-50 dark:hover:text-red-400"
                      >
                        {post.title}
                      </Link>
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
                    <td className="px-6 py-4 text-sm text-newspaper-gray dark:text-zinc-400">
                      {post.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-newspaper-gray dark:text-zinc-400">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
