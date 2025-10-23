"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Blog Post</h1>
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
          To create a new blog post, add an MDX file to the <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">content/blog/</code> directory.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold">Steps to Create a New Post</h2>
        
        <ol className="list-decimal space-y-4 pl-6">
          <li className="text-gray-700 dark:text-gray-300">
            <strong>Create a new file</strong> in <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">content/blog/</code>
            <pre className="mt-2 rounded bg-gray-900 p-3 text-sm text-gray-100">touch content/blog/my-new-post.mdx</pre>
          </li>
          
          <li className="text-gray-700 dark:text-gray-300">
            <strong>Add frontmatter and content</strong>
            <pre className="mt-2 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
{`---
title: "My New Post Title"
excerpt: "A brief description"
coverImage: "/images/blog/cover.svg"
date: "2025-10-23"
author:
  name: "Your Name"
  avatar: "/images/avatar.svg"
  bio: "Your bio"
tags: ["Tag1", "Tag2"]
published: true
featured: false
---

## Your Content

Write your post content here using Markdown...`}
            </pre>
          </li>
          
          <li className="text-gray-700 dark:text-gray-300">
            <strong>Save the file</strong> and the post will automatically appear on the site
          </li>
          
          <li className="text-gray-700 dark:text-gray-300">
            <strong>Commit and push</strong> to deploy
            <pre className="mt-2 rounded bg-gray-900 p-3 text-xs text-gray-100">
{`git add content/blog/my-new-post.mdx
git commit -m "Add new blog post"
git push`}
            </pre>
          </li>
        </ol>

        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
          <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-100">
            💡 Tip: Use Subcategories
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Create folders in <code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">content/blog/</code> to organize by category:
          </p>
          <pre className="mt-2 rounded bg-gray-900 p-3 text-xs text-gray-100">
{`content/blog/
├── tutorials/
│   └── my-tutorial.mdx
└── guides/
    └── my-guide.mdx`}
          </pre>
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
  );
}
