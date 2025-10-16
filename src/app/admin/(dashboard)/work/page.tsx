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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-black/10 pb-6 dark:border-white/10">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
            Portfolio Management
          </span>
        </div>
        <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-newspaper-ink dark:text-zinc-50">
          Work / Projects
        </h1>
        <p className="mt-3 text-sm text-newspaper-gray dark:text-zinc-400">
          Manage your project case studies (Markdown files)
        </p>
      </div>

      {/* Info Box */}
      <div className="border border-black/10 bg-white p-6 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            File Location
          </span>
        </div>
        <p className="text-sm leading-relaxed text-newspaper-gray dark:text-zinc-400">
          Projects are stored as Markdown files in{" "}
          <code className="border border-black/10 bg-newspaper-paper px-2 py-1 font-mono text-xs dark:border-white/10 dark:bg-zinc-800">
            content/work/
          </code>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-newspaper-gray dark:text-zinc-400">
          Edit these files directly in your code editor, or use tools like Prisma Studio for database content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border border-black/10 bg-white p-6 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="border border-black/10 bg-newspaper-paper p-3 dark:border-white/10 dark:bg-zinc-800">
              <FileText size={20} strokeWidth={1.5} className="text-newspaper-accent dark:text-red-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                Total Projects
              </p>
              <p className="mt-1 font-serif text-2xl font-bold text-newspaper-ink dark:text-zinc-50">
                {files.length}
              </p>
            </div>
          </div>
        </div>
        <div className="border border-black/10 bg-white p-6 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="border border-black/10 bg-newspaper-paper p-3 dark:border-white/10 dark:bg-zinc-800">
              <FolderOpen size={20} strokeWidth={1.5} className="text-newspaper-accent dark:text-red-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
                File Types
              </p>
              <p className="mt-1 font-serif text-2xl font-bold text-newspaper-ink dark:text-zinc-50">
                .md, .mdx
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="overflow-hidden border border-black/10 bg-white shadow-editorial dark:border-white/10 dark:bg-zinc-900">
        <div className="border-b border-black/10 bg-newspaper-paper px-6 py-3 dark:border-white/10 dark:bg-zinc-800">
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
            Project Files
          </h2>
        </div>
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {files.map((file) => {
            const slug = file.replace(/\.(md|mdx)$/, "");
            return (
              <div
                key={file}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-newspaper-paper dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} strokeWidth={1.5} className="text-newspaper-gray dark:text-zinc-400" />
                  <div>
                    <div className="font-medium text-newspaper-ink dark:text-zinc-50">
                      {file}
                    </div>
                    <div className="mt-1 text-sm text-newspaper-gray dark:text-zinc-400">
                      Slug: {slug}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/work/${slug}`}
                    target="_blank"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-newspaper-accent transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
        <div className="border border-black/10 bg-white p-12 text-center shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          <p className="text-sm text-newspaper-gray dark:text-zinc-400">
            No project files found in content/work/
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="border border-black/10 bg-white p-6 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            How to Add/Edit Projects
          </h3>
        </div>
        <ol className="space-y-3 text-sm leading-relaxed text-newspaper-gray dark:text-zinc-400">
          <li>1. Create a new <code className="border border-black/10 bg-newspaper-paper px-2 py-1 font-mono text-xs dark:border-white/10 dark:bg-zinc-800">.md</code> or <code className="border border-black/10 bg-newspaper-paper px-2 py-1 font-mono text-xs dark:border-white/10 dark:bg-zinc-800">.mdx</code> file in <code className="border border-black/10 bg-newspaper-paper px-2 py-1 font-mono text-xs dark:border-white/10 dark:bg-zinc-800">content/work/</code></li>
          <li>2. Add frontmatter with: title, description, tags, image, date, featured, status</li>
          <li>3. Write your content in Markdown below the frontmatter</li>
          <li>4. Save and refresh to see changes</li>
        </ol>
        <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/10">
          <Link
            href="https://github.com/doeshing/doeshing_one_2026/tree/main/content/work"
            target="_blank"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-newspaper-accent transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            View examples on GitHub →
          </Link>
        </div>
      </div>
    </div>
  );
}
