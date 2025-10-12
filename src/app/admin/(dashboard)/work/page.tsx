import Link from "next/link";
import { FileText, FolderOpen } from "lucide-react";
import fs from "node:fs/promises";
import path from "node:path";

export default async function WorkAdminPage() {
  const workDir = path.join(process.cwd(), "content", "work");
  
  let files: string[] = [];
  try {
    files = await fs.readdir(workDir);
    files = files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
  } catch (error) {
    console.error("Error reading work directory:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-newspaper-ink dark:text-zinc-50">
          Work / Projects
        </h1>
        <p className="mt-2 text-newspaper-gray dark:text-zinc-400">
          Manage your project case studies (Markdown files)
        </p>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <h3 className="font-semibold text-blue-900 dark:text-blue-400">
          📁 File Location
        </h3>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">
          Projects are stored as Markdown files in{" "}
          <code className="rounded bg-blue-100 px-2 py-1 dark:bg-blue-900/40">
            content/work/
          </code>
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">
          Edit these files directly in your code editor, or use tools like Prisma Studio for database content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-500 p-3 text-white">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-newspaper-gray dark:text-zinc-400">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-newspaper-ink dark:text-zinc-50">
                {files.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-500 p-3 text-white">
              <FolderOpen size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-newspaper-gray dark:text-zinc-400">
                File Types
              </p>
              <p className="text-2xl font-bold text-newspaper-ink dark:text-zinc-50">
                .md, .mdx
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="border-b border-black/10 bg-zinc-50 px-6 py-3 dark:border-white/10 dark:bg-zinc-800">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-newspaper-gray dark:text-zinc-400">
            Project Files
          </h2>
        </div>
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {files.map((file) => {
            const slug = file.replace(/\.(md|mdx)$/, "");
            return (
              <div
                key={file}
                className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-newspaper-gray dark:text-zinc-400" />
                  <div>
                    <div className="font-medium text-newspaper-ink dark:text-zinc-50">
                      {file}
                    </div>
                    <div className="text-sm text-newspaper-gray dark:text-zinc-400">
                      Slug: {slug}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/work/${slug}`}
                    target="_blank"
                    className="text-sm font-medium text-newspaper-accent hover:underline dark:text-red-400"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {files.length === 0 && (
        <div className="rounded-lg border border-black/10 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-900">
          <p className="text-newspaper-gray dark:text-zinc-400">
            No project files found in content/work/
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <h3 className="font-semibold text-newspaper-ink dark:text-zinc-50">
          How to Add/Edit Projects
        </h3>
        <ol className="mt-4 space-y-2 text-sm text-newspaper-gray dark:text-zinc-400">
          <li>1. Create a new <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">.md</code> or <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">.mdx</code> file in <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">content/work/</code></li>
          <li>2. Add frontmatter with: title, description, tags, image, date, featured, status</li>
          <li>3. Write your content in Markdown below the frontmatter</li>
          <li>4. Save and refresh to see changes</li>
        </ol>
        <div className="mt-4">
          <Link
            href="https://github.com/doeshing/doeshing_one_2026/tree/main/content/work"
            target="_blank"
            className="text-sm font-medium text-newspaper-accent hover:underline dark:text-red-400"
          >
            View examples on GitHub →
          </Link>
        </div>
      </div>
    </div>
  );
}
