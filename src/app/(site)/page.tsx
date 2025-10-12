import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedPosts } from "@/lib/blog";
import { loadAllProjects } from "@/lib/mdx";
import { getNewspaperDateline } from "@/lib/utils";

const quickLinks: Array<{
  title: string;
  description: string;
  href: string;
}> = [
  {
    title: "The Archive",
    description:
      "Long-form essays, process notes, and behind-the-scenes breakdowns from studio practice.",
    href: "/archive",
  },
  {
    title: "Studio Work",
    description:
      "A curated collection of client engagements, experiments, and shipped products.",
    href: "/work",
  },
  {
    title: "About",
    description:
      "Background, experience, and credentials—the story behind the work.",
    href: "/about",
  },
];

export default async function HomePage() {
  const [featuredPosts, projects] = await Promise.all([
    getFeaturedPosts(3),
    loadAllProjects(),
  ]);

  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="space-y-20">
      <section className="grid gap-6 border border-black/10 bg-white px-6 py-10 shadow-editorial dark:border-white/10 dark:bg-zinc-900 md:grid-cols-[2fr,1fr] md:gap-12 md:px-10 md:py-12">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-newspaper-gray dark:text-zinc-400">
            {getNewspaperDateline()}
          </span>
          <h1 className="font-serif text-4xl tracking-tight text-newspaper-ink dark:text-zinc-50 sm:text-5xl md:text-6xl">
            Doeshing Gazette: Editorial craftsmanship for the modern web
          </h1>
          <p className="max-w-2xl text-base text-newspaper-gray dark:text-zinc-400">
            A magazine-style portfolio blending design engineering, narrative systems, and modern web craft. New dispatches weekly.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild>
              <Link href="/work" className="gap-2">
                View Work
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact" className="gap-2">
                Get In Touch
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-6 border-t border-black/10 pt-6 dark:border-white/10 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
              Latest Dispatch
            </span>
            <p className="mt-4 text-sm text-newspaper-gray dark:text-zinc-400">
              {featuredPosts[0]?.excerpt ??
                "Fresh essays on design systems, developer tooling, and narrative-driven product work."}
            </p>
          </div>
          <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            <span>FEATURED AREAS</span>
            <span className="flex flex-wrap gap-3 text-[11px]">
              <span className="rounded-sm border border-black/10 px-2 py-1 dark:border-white/10">
                Product Design
              </span>
              <span className="rounded-sm border border-black/10 px-2 py-1 dark:border-white/10">
                Frontend Engineering
              </span>
              <span className="rounded-sm border border-black/10 px-2 py-1 dark:border-white/10">
                Narrative Systems
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            <Newspaper size={18} strokeWidth={1.5} />
            Weekly briefings direct to your inbox.
            <Link
              href="/newsletter"
              className="text-newspaper-accent underline-offset-4 hover:underline dark:text-red-400"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          kicker="Quick Navigation"
          title="Highlights from the newsroom"
          description="Browse the latest writing, explore featured projects, or download the résumé for offline reading."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href as any}
              className="flex flex-col gap-4 border border-black/10 bg-white px-6 py-8 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:border-newspaper-ink hover:shadow-editorial dark:border-white/10 dark:bg-zinc-900 dark:hover:border-zinc-400"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-accent dark:text-red-400">
                {link.title}
              </span>
              <p className="text-sm text-newspaper-gray dark:text-zinc-400">{link.description}</p>
              <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-ink dark:text-zinc-100">
                Explore
                <ArrowRight size={16} strokeWidth={1.5} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          kicker="Featured Stories"
          title="Latest essays and field notes"
          description="The editorial feed surfaces well-crafted pieces on design, development, and the craft of storytelling."
        />
        <BlogGrid posts={featuredPosts} featuredCount={2} />
        <div className="flex justify-end">
          <Button asChild variant="ghost">
            <Link href="/archive" className="gap-2">
              Read the archive
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          kicker="Studio Work"
          title="Current focus and featured collaborations"
          description="Case studies that blend storytelling with product thinking across web, mobile, and experiential media."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              highlight={false}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button asChild variant="ghost">
            <Link href="/work" className="gap-2">
              View all work
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
