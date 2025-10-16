"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
    tags: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Auto-generate slug from title
    if (name === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.content.trim()) {
      setError("Content is required.");
      setLoading(false);
      return;
    }

    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          published: publish,
          tags,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.details || data.message || "Failed to create post";
        console.error("API Error:", data);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      router.push(`/admin/blog/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

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
              New Post
            </h1>
            <p className="mt-2 text-newspaper-gray dark:text-zinc-400">
              Create a new blog article
            </p>
          </div>
        </div>
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <Save size={16} />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-newspaper-accent px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
          >
            <Eye size={16} />
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
