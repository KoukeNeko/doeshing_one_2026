import Link from "next/link";
import { FileText, FolderOpen } from "lucide-react";

export default async function BlogListPage() {
  return (
    <div className="space-y-8">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-950">
        <h1 className="mb-2 text-2xl font-bold text-blue-900 dark:text-blue-100">
          📝 Blog Posts Are Now Static MDX Files
        </h1>
        <p className="mb-4 text-blue-800 dark:text-blue-200">
          The blog system has been migrated from database storage to static MDX files for better performance, 
          version control, and developer experience.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">How to Manage Blog Posts</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="mt-1 h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Create a New Post</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create a new <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">.mdx</code> file 
                in the <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">content/blog/</code> directory
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="mt-1 h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Edit an Existing Post</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Open the corresponding <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">.mdx</code> file 
                and edit it directly in your code editor
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FolderOpen className="mt-1 h-5 w-5 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Organize by Category</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create subfolders in <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">content/blog/</code> to 
                organize posts by category (e.g., <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">tutorials/</code>, 
                <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">guides/</code>)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Resources</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a 
              href="https://github.com/KoukeNeko/doeshing_one_2026/blob/main/content/blog/README.md" 
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              📖 Blog Post Creation Guide
            </a> - Complete documentation on creating posts
          </li>
          <li>
            <a 
              href="https://github.com/KoukeNeko/doeshing_one_2026/blob/main/MIGRATION_GUIDE.md" 
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔄 Migration Guide
            </a> - Understanding the transition from database to static files
          </li>
          <li>
            <Link 
              href="/archive" 
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              👀 View Published Posts
            </Link> - See all published blog posts
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-950">
        <h2 className="mb-2 text-lg font-semibold text-yellow-900 dark:text-yellow-100">
          💡 Quick Start Example
        </h2>
        <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-xs text-gray-100">
{`---
title: "My First Post"
excerpt: "A brief description of my post"
coverImage: "/images/blog/cover.svg"
date: "2025-10-23"
author:
  name: "Your Name"
  avatar: "/images/avatar.svg"
  bio: "Your bio"
tags: ["Tag1", "Tag2"]
published: true
---

## Your Content Here

Write your blog post using Markdown...`}
        </pre>
      </div>
    </div>
  );
}
