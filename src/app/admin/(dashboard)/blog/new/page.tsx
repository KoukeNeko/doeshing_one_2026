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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-black/10 pb-6 dark:border-white/10">
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
                Content Creation
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-newspaper-ink dark:text-zinc-50">
              New Post
            </h1>
            <p className="mt-3 text-sm text-newspaper-gray dark:text-zinc-400">
              Create a new blog article
            </p>
          </div>
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
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 border-t border-black/10 pt-6 dark:border-white/10 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-ink transition hover:border-newspaper-ink hover:bg-newspaper-ink hover:text-newspaper-paper disabled:opacity-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
          >
            <Save size={16} strokeWidth={1.5} />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 border border-newspaper-ink bg-newspaper-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-paper transition hover:bg-newspaper-accent hover:border-newspaper-accent disabled:opacity-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-red-400 dark:hover:border-red-400"
          >
            <Eye size={16} strokeWidth={1.5} />
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
