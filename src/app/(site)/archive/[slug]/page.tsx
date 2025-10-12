import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RenderedMarkdown } from "@/components/mdx/RenderedMarkdown";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getAdjacentPosts,
  getPostBySlug,
  getRelatedPosts,
  incrementPostViews,
} from "@/lib/blog";
import { renderMarkdown } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : undefined;

  const url = baseUrl ? `${baseUrl}/archive/${post.slug}` : undefined;

  return {
    title: post.title,
    description: post.excerpt ?? post.title,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.title,
      type: "article",
      url,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  await incrementPostViews(post.id);

  const [{ html, toc }, adjacent, related] = await Promise.all([
    renderMarkdown(post.content),
    post.publishedAt
      ? getAdjacentPosts(post.publishedAt, post.id)
      : Promise.resolve({ previous: null, next: null }),
    getRelatedPosts(
      post.id,
      post.tags.map((tag) => tag.slug),
    ),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "http://localhost:3000";
  const shareUrl = `${baseUrl}/archive/${post.slug}`;

  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,1fr),280px]">
      <div className="space-y-10">
        <header className="space-y-6 border border-black/10 bg-white px-6 py-10 shadow-editorial dark:border-white/10 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            <span>
              {formatDate(
                post.publishedAt ?? post.createdAt,
                "EEEE, MMMM d, yyyy",
              )}
            </span>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
            <span>&middot;</span>
            <span>{post.views + 1} views</span>
          </div>
          <h1 className="font-serif text-4xl tracking-tight text-newspaper-ink dark:text-zinc-50 sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="text-base text-newspaper-gray dark:text-zinc-400">{post.excerpt}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </header>

        <RenderedMarkdown
          html={html}
          className="dropcap prose prose-lg prose-headings:font-serif prose-headings:tracking-tight prose-p:text-newspaper-gray prose-strong:text-newspaper-ink dark:prose-invert"
        />

        <ShareButtons url={shareUrl} title={post.title} />

        <section className="space-y-6">
          <SectionHeading
            kicker="Related Reading"
            title="You might also enjoy"
            description="More dispatches on craft and process."
          />
          <BlogGrid posts={related} featuredCount={3} />
        </section>

        <nav className="flex flex-col gap-6 border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900 md:flex-row md:justify-between">
          {adjacent.previous ? (
            <Link
              href={`/archive/${adjacent.previous.slug}`}
              className="flex-1 text-left text-sm text-newspaper-gray transition hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-accent dark:text-red-400">
                Previous
              </span>
              <p className="mt-2 font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                {adjacent.previous.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1 text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
              Beginning of archive
            </div>
          )}
          {adjacent.next ? (
            <Link
              href={`/archive/${adjacent.next.slug}`}
              className="flex-1 text-right text-sm text-newspaper-gray transition hover:text-newspaper-ink dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-newspaper-accent dark:text-red-400">
                Next
              </span>
              <p className="mt-2 font-serif text-lg text-newspaper-ink dark:text-zinc-50">
                {adjacent.next.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1 text-right text-xs uppercase tracking-[0.3em] text-newspaper-gray dark:text-zinc-400">
              Fresh ink coming soon
            </div>
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <TableOfContents items={toc ?? []} />
        <div className="top-32 space-y-6">
          <div className="border border-black/10 bg-white px-6 py-6 dark:border-white/10 dark:bg-zinc-900">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
              Author
            </span>
            <p className="mt-2 font-serif text-lg text-newspaper-ink dark:text-zinc-50">
              {post.author.name}
            </p>
            {post.author.bio ? (
              <p className="mt-2 text-sm text-newspaper-gray dark:text-zinc-400">
                {post.author.bio}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
