/**
 * MDX 處理與專案內容載入模組
 *
 * 此模組負責：
 * 1. 將 Markdown/MDX 內容轉換為 HTML
 * 2. 生成目錄（Table of Contents）
 * 3. 套用語法高亮（使用 Shiki）
 * 4. 載入和管理專案（work）內容
 *
 * 使用的 Unified 處理管道：
 * remark (Markdown) → rehype (HTML) → 最終 HTML 輸出
 *
 * 外掛順序：
 * 1. remarkParse - 解析 Markdown
 * 2. remarkGfm - GitHub Flavored Markdown 支援（表格、刪除線等）
 * 3. remarkCallout - 自定義 callout 區塊語法
 * 4. extractHeadings - 提取標題生成目錄
 * 5. remarkRehype - 轉換 Markdown AST 為 HTML AST
 * 6. rehypeSlug - 為標題添加 id 屬性
 * 7. rehypeAutolinkHeadings - 標題自動連結
 * 8. rehypeCallout - 為 callout 區塊添加圖示
 * 9. rehypePrettyCode - 程式碼語法高亮
 * 10. rehypeStringify - 輸出最終 HTML
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger"; // 生成 GitHub 風格的 slug（URL 片段識別碼）
import matter from "gray-matter"; // 解析 YAML frontmatter
import type { Heading, Root as MdastRoot } from "mdast"; // Markdown AST 類型
import { toString as mdastToString } from "mdast-util-to-string"; // 將 AST 節點轉為純文字
import { unstable_cache } from "next/cache"; // Next.js 快取 API
import rehypeAutolinkHeadings from "rehype-autolink-headings"; // 標題自動連結外掛
import rehypePrettyCode from "rehype-pretty-code"; // 語法高亮外掛（使用 Shiki）
import rehypeSlug from "rehype-slug"; // 為標題生成 slug
import rehypeStringify from "rehype-stringify"; // HTML 序列化
import remarkGfm from "remark-gfm"; // GitHub Flavored Markdown
import remarkParse from "remark-parse"; // Markdown 解析器
import remarkRehype from "remark-rehype"; // Markdown → HTML 轉換
import { unified } from "unified"; // 統一處理框架
import { visit } from "unist-util-visit"; // AST 遍歷工具
import { rehypeCallout } from "./rehype-callout";
import { remarkCallout } from "./remark-callout";
import { getReadingTime } from "./utils";

/**
 * 專案 Frontmatter 介面
 * 定義專案 MDX 檔案頂部的元資料結構
 */
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

/**
 * 專案目錄的絕對路徑
 * 指向專案根目錄下的 content/work 資料夾
 */
const PROJECTS_DIR = path.join(process.cwd(), "content", "work");

/**
 * 目錄項目介面（Table of Contents Item）
 * 用於生成文章/專案的目錄導航
 */
export interface TocItem {
  id: string;    // 標題的 slug（用於錨點連結）
  text: string;  // 標題文字
  depth: number; // 標題層級（2=h2, 3=h3）
}

/**
 * 將 Markdown 轉換為 HTML 並生成目錄
 *
 * @param markdown - 原始 Markdown 字串
 * @returns 包含 HTML 和目錄的物件
 *
 * 功能：
 * - Markdown → HTML 轉換
 * - 語法高亮（使用 Shiki，github-dark 主題）
 * - 生成目錄（h2 和 h3 標題）
 * - Callout 區塊支援（> [!info], [!warning] 等）
 * - 標題自動連結
 * - GitHub Flavored Markdown 支援
 *
 * 快取策略：
 * - 快取鍵：基於內容的 hash（前 32 個字元）
 * - 重新驗證時間：3600 秒（1 小時）
 * - 快取標籤：["markdown"]
 *
 * 使用範例：
 * ```typescript
 * const { html, toc } = await renderMarkdown("# Hello\n\n## Section 1")
 * // html: "<h1>Hello</h1><h2 id='section-1'>Section 1</h2>"
 * // toc: [{ id: "section-1", text: "Section 1", depth: 2 }]
 * ```
 *
 * 注意：
 * - allowDangerousHtml: true 允許在 Markdown 中使用原始 HTML（用於 callout 圖示）
 * - 只提取 h2 和 h3 標題到目錄（h1 通常是頁面標題）
 */
export async function renderMarkdown(markdown: string) {
  // 基於內容建立 hash 作為快取鍵（避免相同內容重複處理）
  const contentHash = Buffer.from(markdown).toString("base64").slice(0, 32);

  return unstable_cache(
    async () => {
      const slugger = new GithubSlugger(); // 生成唯一的 slug
      const headings: TocItem[] = []; // 儲存提取的標題

      // 建立 Unified 處理器管道
      const processor = unified()
        .use(remarkParse)               // 1. 解析 Markdown
        .use(remarkGfm)                 // 2. 支援 GFM（表格、刪除線等）
        .use(remarkCallout)             // 3. 處理 callout 語法
        .use(extractHeadings, { slugger, headings }) // 4. 提取標題到 headings 陣列
        .use(remarkRehype, { allowDangerousHtml: true }) // 5. 轉換為 HTML AST
        .use(rehypeSlug)                // 6. 為標題添加 id
        .use(rehypeAutolinkHeadings, {  // 7. 標題自動連結
          behavior: "wrap",             //    將整個標題包裹在連結中
          properties: {
            className: ["heading-link"], //    添加 CSS 類別
          },
        })
        .use(rehypeCallout)             // 8. 為 callout 添加圖示
        .use(rehypePrettyCode, {        // 9. 語法高亮
          theme: "github-dark",
          keepBackground: false,        //    不保留背景色（由 CSS 控制）
        })
        .use(rehypeStringify, { allowDangerousHtml: true }); // 10. 輸出 HTML

      const file = await processor.process(markdown);

      return {
        html: String(file),
        toc: headings,
      };
    },
    [`markdown-${contentHash}`],
    {
      revalidate: 3600, // 1 小時後重新驗證
      tags: ["markdown"],
    },
  )();
}

/**
 * Remark 外掛：從 Markdown AST 提取標題
 *
 * @param options - 包含 slugger 和 headings 陣列的選項物件
 * @returns Remark 轉換函式
 *
 * 功能：
 * - 遍歷 Markdown AST，找出所有標題節點（h2, h3）
 * - 生成標題的 slug（URL 友善的識別碼）
 * - 將標題資訊加入 headings 陣列
 *
 * 注意：
 * - 只提取 h2 (depth=2) 和 h3 (depth=3)
 * - h1 通常是頁面主標題，不包含在目錄中
 * - 使用 GithubSlugger 確保 slug 唯一性
 */
function extractHeadings(
  this: unknown,
  options: { slugger: GithubSlugger; headings: TocItem[] },
) {
  return (tree: MdastRoot) => {
    visit(tree, "heading", (node: Heading) => {
      // 只處理 h2 和 h3（depth 2-3）
      if (node.depth < 2 || node.depth > 3) return;

      // 將標題節點轉為純文字
      const text = mdastToString(node).trim();
      if (!text) return;

      // 添加到目錄陣列
      options.headings.push({
        id: options.slugger.slug(text), // 生成 URL 友善的 slug
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
