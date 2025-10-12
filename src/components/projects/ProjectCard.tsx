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
        "group flex flex-col border border-black/10 bg-white shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:shadow-editorial",
        highlight && "md:col-span-2",
      )}
    >
      {frontmatter.image ? (
        <Link
          href={`/projects/${project.slug}`}
          className="relative aspect-[3/2] overflow-hidden border-b border-black/10"
        >
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
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
        <h3 className="mt-5 font-serif text-2xl tracking-tight text-newspaper-ink group-hover:text-newspaper-accent">
          <Link href={`/projects/${project.slug}`}>{frontmatter.title}</Link>
        </h3>
        <p className="mt-3 text-sm text-newspaper-gray">
          {frontmatter.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6 text-xs uppercase tracking-[0.3em] text-newspaper-gray">
          <span>{formatDate(frontmatter.date, "MMM yyyy")}</span>
          <div className="flex gap-4">
            {frontmatter.github ? (
              <Link
                href={frontmatter.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            ) : null}
            {frontmatter.demo ? (
              <Link
                href={frontmatter.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
