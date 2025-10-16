"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Save, Eye, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

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

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
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
        <div className="text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-black/10 pb-6 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/blog"
              className="border border-black/10 p-2 transition hover:border-newspaper-ink hover:bg-newspaper-ink hover:text-newspaper-paper dark:border-white/10 dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
            >
              <ArrowLeft size={20} strokeWidth={1.5} />
            </Link>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
                  Content Editing
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-newspaper-ink dark:text-zinc-50">
                Edit Post
              </h1>
              <p className="mt-3 text-sm text-newspaper-gray dark:text-zinc-400">
                Update your blog article
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 border border-red-600 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-700 transition hover:bg-red-600 hover:text-white dark:border-red-400 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-zinc-900"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            Delete
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-red-600 bg-red-50 p-4 text-sm text-red-800 dark:border-red-400 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form className="space-y-6">
        <div className="border border-black/10 bg-white p-6 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
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
                className="w-full border border-black/10 bg-newspaper-paper px-4 py-3 text-newspaper-ink outline-none transition focus:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-300"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
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
                className="w-full border border-black/10 bg-newspaper-paper px-4 py-3 text-newspaper-ink outline-none transition focus:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-300"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full border border-black/10 bg-newspaper-paper px-4 py-3 text-newspaper-ink outline-none transition focus:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-300"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
              >
                Content (Markdown) *
              </label>
              <MarkdownEditor
                id="content"
                name="content"
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your post content in Markdown..."
                className="shadow-sm"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label
                htmlFor="coverImage"
                className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
              >
                Cover Image URL
              </label>
              <input
                type="text"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="w-full border border-black/10 bg-newspaper-paper px-4 py-3 text-newspaper-ink outline-none transition placeholder:text-newspaper-gray/50 focus:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
                placeholder="/images/blog/example.svg"
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border border-black/10 bg-newspaper-paper px-4 py-3 text-newspaper-ink outline-none transition placeholder:text-newspaper-gray/50 focus:border-newspaper-ink dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
                placeholder="nextjs, design, typescript"
              />
            </div>

            {/* Published Status */}
            <div className="border-t border-black/10 pt-6 dark:border-white/10">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 border-black/10 text-newspaper-accent focus:ring-newspaper-accent dark:border-white/10"
                />
                <label
                  htmlFor="published"
                  className="text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
                >
                  Published
                </label>
              </div>
            </div>

            {/* Featured Status */}
            <div className="space-y-4 border border-black/10 bg-newspaper-paper p-4 dark:border-white/10 dark:bg-zinc-800">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 border-black/10 text-newspaper-accent focus:ring-newspaper-accent dark:border-white/10"
                />
                <label
                  htmlFor="featured"
                  className="text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
                >
                  Featured on Homepage
                </label>
              </div>

              {formData.featured && (
                <div>
                  <label
                    htmlFor="featuredOrder"
                    className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400"
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
                    className="w-full border border-black/10 bg-white px-4 py-3 text-newspaper-ink outline-none transition placeholder:text-newspaper-gray/50 focus:border-newspaper-ink dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
                    placeholder="e.g., 1, 2, 3..."
                  />
                  <p className="mt-3 text-xs leading-relaxed text-newspaper-gray dark:text-zinc-400">
                    Posts with lower order numbers will appear first. If left empty, it will be shown after ordered posts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 border-t border-black/10 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-ink transition hover:border-newspaper-ink hover:bg-newspaper-ink hover:text-newspaper-paper disabled:opacity-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
          >
            <Save size={16} strokeWidth={1.5} />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 border border-newspaper-ink bg-newspaper-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-paper transition hover:bg-newspaper-accent hover:border-newspaper-accent disabled:opacity-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-red-400 dark:hover:border-red-400"
          >
            <Eye size={16} strokeWidth={1.5} />
            {formData.published ? "Update & Keep Published" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
