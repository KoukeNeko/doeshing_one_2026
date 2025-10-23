"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <Link
          href="/admin/blog"
          className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <div className="border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-950">
        <h2 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-100">
          📝 Blog Posts Are Now Static MDX Files
        </h2>
        <p className="mb-4 text-blue-800 dark:text-blue-200">
          To edit blog posts, find and edit the corresponding MDX file in the <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">content/blog/</code> directory.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold">Post ID: {id}</h2>
        
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            This post is stored as a static MDX file. To edit it:
          </p>

          <ol className="list-decimal space-y-3 pl-6">
            <li className="text-gray-700 dark:text-gray-300">
              <strong>Find the file</strong> in <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">content/blog/</code>
              <pre className="mt-2 rounded bg-gray-900 p-3 text-xs text-gray-100">find content/blog -name "*.mdx" | grep {id}</pre>
            </li>
            
            <li className="text-gray-700 dark:text-gray-300">
              <strong>Open in your editor</strong>
              <pre className="mt-2 rounded bg-gray-900 p-3 text-xs text-gray-100">code content/blog/your-post.mdx</pre>
            </li>
            
            <li className="text-gray-700 dark:text-gray-300">
              <strong>Make your changes</strong> to the frontmatter or content
            </li>
            
            <li className="text-gray-700 dark:text-gray-300">
              <strong>Save and commit</strong>
              <pre className="mt-2 rounded bg-gray-900 p-3 text-xs text-gray-100">
{`git add content/blog/your-post.mdx
git commit -m "Update blog post"
git push`}
              </pre>
            </li>
          </ol>

          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-2 font-semibold">Editable Fields</h3>
            <ul className="list-disc space-y-1 pl-6 text-sm text-gray-600 dark:text-gray-400">
              <li>Title, excerpt, cover image</li>
              <li>Content (full Markdown/MDX support)</li>
              <li>Tags, author info</li>
              <li>Publication status (published: true/false)</li>
              <li>Featured status and order</li>
              <li>Category (via folder structure)</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              href="/archive"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              View Published Posts
            </Link>
            <a
              href="https://github.com/KoukeNeko/doeshing_one_2026/tree/main/content/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Browse Blog Files on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
