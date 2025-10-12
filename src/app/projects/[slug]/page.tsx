import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RenderedMarkdown } from "@/components/mdx/RenderedMarkdown";
import { Badge } from "@/components/ui/Badge";
import { loadProjectContent } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await loadProjectContent(params.slug).catch(() => null);
  if (!project) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : undefined;

  const url = baseUrl ? `${baseUrl}/projects/${project.slug}` : undefined;

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.description,
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      type: "article",
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await loadProjectContent(params.slug).catch(() => null);
  if (!project) notFound();

  const { frontmatter, html, toc } = project;

  return (
    <article className="space-y-12">
      <header className="space-y-5 border border-black/10 bg-white px-6 py-10 shadow-editorial">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-newspaper-gray">
          <span>{formatDate(frontmatter.date, "MMM yyyy")}</span>
          {frontmatter.status ? (
            <Badge variant="accent">{frontmatter.status}</Badge>
          ) : null}
          <span>{project.readingTime}</span>
        </div>
        <h1 className="font-serif text-4xl tracking-tight text-newspaper-ink">
          {frontmatter.title}
        </h1>
        <p className="text-base text-newspaper-gray">
          {frontmatter.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {frontmatter.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-newspaper-accent">
          {frontmatter.github ? (
            <Link
              href={frontmatter.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </Link>
          ) : null}
          {frontmatter.demo ? (
            <Link
              href={frontmatter.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </Link>
          ) : null}
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr),280px]">
        <RenderedMarkdown
          html={html ?? ""}
          className="dropcap prose prose-lg prose-headings:font-serif prose-headings:tracking-tight prose-p:text-newspaper-gray"
        />
        <aside className="space-y-6">
          {toc?.length ? (
            <div className="sticky top-32 border border-black/10 bg-white px-6 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray">
                Outline
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    style={{ marginLeft: `${(item.depth - 2) * 16}px` }}
                  >
                    <a
                      href={`#${item.id}`}
                      className="text-newspaper-gray transition hover:text-newspaper-ink"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="border border-black/10 bg-white px-6 py-6 text-sm text-newspaper-gray">
            <p>
              <strong className="font-semibold text-newspaper-ink">
                Status
              </strong>{" "}
              — {frontmatter.status ?? "n/a"}
            </p>
            {frontmatter.featured ? (
              <p className="mt-2 text-newspaper-accent">Featured project</p>
            ) : null}
          </div>
        </aside>
      </div>
    </article>
  );
}
