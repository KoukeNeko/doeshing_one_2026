import { promises as fs } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import type { Heading, Root as MdastRoot } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import { unstable_cache } from "next/cache";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
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
  content: string;
  readingTime: string;
  html?: string;
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

      const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkCallout) // Add callout support
        .use(extractHeadings, { slugger, headings })
        .use(remarkRehype, { allowDangerousHtml: true }) // Allow raw HTML for icons
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, {
          behavior: "wrap",
          properties: {
            className: ["heading-link"],
          },
        })
        .use(rehypeCallout) // Add callout icons
        .use(rehypePrettyCode, {
          theme: "github-dark",
          keepBackground: false,
        })
        .use(rehypeStringify, { allowDangerousHtml: true }); // Allow raw HTML in output

      const file = await processor.process(markdown);

      return {
        html: String(file),
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

function extractHeadings(
  this: unknown,
  options: { slugger: GithubSlugger; headings: TocItem[] },
) {
  return (tree: MdastRoot) => {
    visit(tree, "heading", (node: Heading) => {
      if (node.depth < 2 || node.depth > 3) return;
      const text = mdastToString(node).trim();
      if (!text) return;
      options.headings.push({
        id: options.slugger.slug(text),
        text,
        depth: node.depth,
      });
    });
  };
}

export async function getProjectSlugs() {
  try {
    // 檢查目錄是否存在
    await fs.access(PROJECTS_DIR);
    const files = await fs.readdir(PROJECTS_DIR);
    return files
      .filter((file) => /\.mdx?$/.test(file))
      .map((file) => file.replace(/\.mdx?$/, ""));
  } catch (error) {
    console.error(`Error reading projects directory ${PROJECTS_DIR}:`, error);
    return [];
  }
}

export async function loadProjectContent(
  slug: string,
): Promise<ProjectContent> {
  return unstable_cache(
    async () => {
      const filePath = path.join(PROJECTS_DIR, `${slug}.md`);
      const fallbackMdx = path.join(PROJECTS_DIR, `${slug}.mdx`);

      const content = await fs
        .readFile(filePath, "utf8")
        .catch(async () => fs.readFile(fallbackMdx, "utf8"));

      const { data, content: body } = matter(content);

      return {
        slug,
        frontmatter: data as ProjectFrontmatter,
        content: body,
        readingTime: getReadingTime(body),
        ...(await renderMarkdown(body)),
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
  try {
    const slugs = await getProjectSlugs();
    
    // 如果沒有找到任何專案，返回空陣列
    if (slugs.length === 0) {
      console.warn("No project files found in", PROJECTS_DIR);
      return [];
    }
    
    const projects = await Promise.all(
      slugs.map((slug) => loadProjectContent(slug)),
    );

    return projects.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error loading all projects:", error);
    return [];
  }
}
