"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Save, Eye, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    tags: "",
    featured: false,
    featuredOrder: "",
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${id}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      
      const post = await response.json();
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        coverImage: post.coverImage || "",
        published: post.published,
        tags: post.tags.map((t: { name: string }) => t.name).join(", "),
        featured: post.featured || false,
        featuredOrder: post.featuredOrder?.toString() || "",
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load post");
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          published: publish !== undefined ? publish : formData.published,
          featuredOrder: formData.featuredOrder ? parseInt(formData.featuredOrder, 10) : null,
          tags,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-newspaper-gray dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-newspaper-ink dark:text-zinc-50">
              Edit Post
            </h1>
            <p className="mt-2 text-newspaper-gray dark:text-zinc-400">
              Update your blog article
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form className="space-y-6">
        <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:focus:border-red-400 dark:focus:ring-red-400"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:focus:border-red-400 dark:focus:ring-red-400"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:focus:border-red-400 dark:focus:ring-red-400"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Content (Markdown) *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={20}
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 font-mono text-sm focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:focus:border-red-400 dark:focus:ring-red-400"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label
                htmlFor="coverImage"
                className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Cover Image URL
              </label>
              <input
                type="text"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:focus:border-red-400 dark:focus:ring-red-400"
                placeholder="/images/blog/example.svg"
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-800 dark:focus:border-red-400 dark:focus:ring-red-400"
                placeholder="nextjs, design, typescript"
              />
            </div>

            {/* Published Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 rounded border-black/10 text-newspaper-accent focus:ring-newspaper-accent dark:border-white/10"
              />
              <label
                htmlFor="published"
                className="text-sm font-medium text-newspaper-ink dark:text-zinc-50"
              >
                Published
              </label>
            </div>

            {/* Featured Status */}
            <div className="space-y-4 rounded-lg border border-black/10 bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-black/10 text-newspaper-accent focus:ring-newspaper-accent dark:border-white/10"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-newspaper-ink dark:text-zinc-50"
                >
                  Featured on Homepage
                </label>
              </div>

              {formData.featured && (
                <div>
                  <label
                    htmlFor="featuredOrder"
                    className="mb-2 block text-sm font-medium text-newspaper-ink dark:text-zinc-50"
                  >
                    Featured Order (lower number = higher priority)
                  </label>
                  <input
                    type="number"
                    id="featuredOrder"
                    name="featuredOrder"
                    value={formData.featuredOrder}
                    onChange={handleChange}
                    min="1"
                    className="w-full rounded-md border border-black/10 bg-white px-4 py-2 focus:border-newspaper-accent focus:outline-none focus:ring-1 focus:ring-newspaper-accent dark:border-white/10 dark:bg-zinc-900 dark:focus:border-red-400 dark:focus:ring-red-400"
                    placeholder="e.g., 1, 2, 3..."
                  />
                  <p className="mt-2 text-xs text-newspaper-gray dark:text-zinc-400">
                    Posts with lower order numbers will appear first. If left empty, it will be shown after ordered posts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <Save size={16} />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-newspaper-accent px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
          >
            <Eye size={16} />
            {formData.published ? "Update & Keep Published" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
