import type { ProjectItem } from "@/types/content";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: ProjectItem[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (!projects.length) {
    return (
      <div className="border border-dashed border-black/20 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.35em] text-newspaper-gray dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-400">
        Project showcase coming soon.
      </div>
    );
  }

  const featured = projects.filter((project) => project.frontmatter.featured);
  const rest = projects.filter((project) => !project.frontmatter.featured);

  return (
    <div className="flex flex-col gap-12">
      {featured.length ? (
        <section className="grid gap-6 md:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} highlight />
          ))}
        </section>
      ) : null}
      {rest.length ? (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
