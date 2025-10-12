import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import type { ProjectItem } from "@/types/content";

interface ProjectCardProps {
  project: ProjectItem;
  highlight?: boolean;
}

export function ProjectCard({ project, highlight = false }: ProjectCardProps) {
  const { frontmatter } = project;

  return (
    <article
      className={cn(
        "group flex flex-col border border-black/10 bg-white shadow-sm shadow-black/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-editorial dark:border-white/10 dark:bg-zinc-900",
        highlight && "md:col-span-2",
      )}
    >
      {frontmatter.image ? (
        <Link
          href={`/work/${project.slug}`}
          className="relative aspect-[3/2] overflow-hidden border-b border-black/10 dark:border-white/10"
        >
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
          />
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {frontmatter.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          {frontmatter.status ? (
            <Badge variant="accent">{frontmatter.status}</Badge>
          ) : null}
        </div>
        <h3 className="mt-5 font-serif text-2xl tracking-tight text-newspaper-ink group-hover:text-newspaper-accent dark:text-zinc-50 dark:group-hover:text-red-400">
          <Link href={`/work/${project.slug}`}>{frontmatter.title}</Link>
        </h3>
        <p className="mt-3 text-sm text-newspaper-gray dark:text-zinc-400">
          {frontmatter.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
          <span>{formatDate(frontmatter.date, "MMM yyyy")}</span>
          <div className="flex gap-4">
            {frontmatter.github ? (
              <a
                href={frontmatter.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            ) : null}
            {frontmatter.demo ? (
              <a
                href={frontmatter.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
