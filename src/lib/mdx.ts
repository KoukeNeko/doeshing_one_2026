import { promises as fs } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import type { Heading, Root as MdastRoot } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import { unstable_cache } from "next/cache";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { rehypeCallout } from "./rehype-callout";
import { remarkCallout } from "./remark-callout";
import { getReadingTime } from "./utils";

export interface ProjectFrontmatter {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  github?: string;
  demo?: string;
  date: string;
  featured?: boolean;
  status?: "completed" | "in-progress" | "archived";
}

export interface ProjectContent {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: ReactNode;
  readingTime: string;
  toc?: TocItem[];
}

const PROJECTS_DIR = path.join(process.cwd(), "content", "work");

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export async function renderMarkdown(markdown: string) {
  // Create a hash of the markdown content for cache key
  const contentHash = Buffer.from(markdown).toString("base64").slice(0, 32);

  return unstable_cache(
    async () => {
      const slugger = new GithubSlugger();
      const headings: TocItem[] = [];

      // Extract headings from markdown using remark
      function extractHeadingsPlugin() {
        return (tree: MdastRoot) => {
          visit(tree, "heading", (node: Heading) => {
            if (node.depth < 2 || node.depth > 3) return;
            const text = mdastToString(node).trim();
            if (!text) return;
            headings.push({
              id: slugger.slug(text),
              text,
              depth: node.depth,
            });
          });
        };
      }

      const { content: renderedContent } = await compileMDX({
        source: markdown,
        options: {
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkCallout, extractHeadingsPlugin],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "wrap",
                  properties: {
                    className: ["heading-link"],
                  },
                },
              ],
              rehypeCallout,
            ],
          },
        },
        components: (await import("./mdx-components")).getMDXComponents(),
      });

      return {
        content: renderedContent,
        toc: headings,
      };
    },
    [`markdown-${contentHash}`],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ["markdown"],
    },
  )();
}

export async function getProjectSlugs() {
  const files = await fs.readdir(PROJECTS_DIR);
  return files
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

export async function loadProjectContent(
  slug: string,
): Promise<ProjectContent> {
  return unstable_cache(
    async () => {
      const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
      const fallbackMdx = path.join(PROJECTS_DIR, `${slug}.mdx`);

      const fileContent = await fs
        .readFile(filePath, "utf8")
        .catch(async () => fs.readFile(fallbackMdx, "utf8"));

      const { data, content: body } = matter(fileContent);
      const { content, toc } = await renderMarkdown(body);

      return {
        slug,
        frontmatter: data as ProjectFrontmatter,
        content,
        readingTime: getReadingTime(body),
        toc,
      };
    },
    [`project-${slug}`],
    {
      revalidate: 3600,
      tags: ["projects", `project-${slug}`],
    },
  )();
}

export async function loadAllProjects() {
  const slugs = await getProjectSlugs();
  const projects = await Promise.all(
    slugs.map((slug) => loadProjectContent(slug)),
  );

  return projects.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}
