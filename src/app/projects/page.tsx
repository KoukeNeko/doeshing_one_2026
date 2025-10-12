import Link from "next/link";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { loadAllProjects } from "@/lib/mdx";

interface ProjectsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const STATUSES = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "archived", label: "Archived" },
];

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const tag = toStringParam(searchParams.tag);
  const statusParam = toStringParam(searchParams.status) ?? "all";

  const projects = await loadAllProjects();

  const tags = Array.from(
    new Set(projects.flatMap((project) => project.frontmatter.tags ?? [])),
  ).sort((a, b) => a.localeCompare(b));

  const filtered = projects.filter((project) => {
    const matchesTag = tag
      ? project.frontmatter.tags
          ?.map((t) => t.toLowerCase())
          .includes(tag.toLowerCase())
      : true;
    const matchesStatus =
      statusParam === "all" || project.frontmatter.status === statusParam;
    return matchesTag && matchesStatus;
  });

  const buildHref = (nextTag?: string, nextStatus?: string) => {
    const params = new URLSearchParams();
    if (nextTag) params.set("tag", nextTag);
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    return params.toString() ? `?${params.toString()}` : "";
  };

  return (
    <div className="space-y-10">
      <SectionHeading
        kicker="Project Portfolio"
        title="A cross-disciplinary practice of editorial web builds"
        description="From rapid prototypes to fully produced launch campaigns, these projects showcase the systems, visuals, and storytelling behind each engagement."
      />

      <div className="flex flex-col gap-4 border border-black/10 bg-white px-6 py-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray">
          <span>Tags</span>
          <Link href={buildHref(undefined, statusParam)}>
            <Badge variant={!tag ? "accent" : "outline"}>All</Badge>
          </Link>
          {tags.map((item) => (
            <Link key={item} href={buildHref(item, statusParam)}>
              <Badge
                variant={
                  tag?.toLowerCase() === item.toLowerCase()
                    ? "accent"
                    : "outline"
                }
              >
                {item}
              </Badge>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-gray">
          <span>Status</span>
          {STATUSES.map((status) => (
            <Link
              key={status.value}
              href={buildHref(tag ?? undefined, status.value)}
            >
              <Badge
                variant={statusParam === status.value ? "accent" : "outline"}
              >
                {status.label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <ProjectGrid projects={filtered} />
    </div>
  );
}

function toStringParam(param?: string | string[]) {
  if (Array.isArray(param)) return param[0];
  return param ?? undefined;
}
