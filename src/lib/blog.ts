/**
 * 部落格內容管理系統 (Blog Content Management System)
 *
 * 此模組是整個部落格的核心引擎，負責：
 * 1. 從 content/blog 目錄遞迴讀取所有 .md/.mdx 檔案
 * 2. 解析每個檔案的 YAML frontmatter 元資料
 * 3. 根據資料夾結構自動生成分類（例如：tutorials/advanced）
 * 4. 提供強大的過濾、搜尋、排序功能
 * 5. 使用 Next.js unstable_cache 進行效能最佳化
 * 6. 追蹤文章瀏覽次數（記憶體內存儲）
 *
 * 快取策略：
 * - getAllBlogPosts: 1 小時快取，標籤為 'posts'
 * - getFeaturedPosts: 60 秒快取，標籤為 'posts' 和 'featured'
 * - getPostBySlug: 60 秒快取（草稿不快取），標籤為 'posts' 和 'post-{slug}'
 *
 * 資料流：
 * 檔案系統 → getAllBlogFiles → loadBlogPost → getAllBlogPosts → 各種過濾/排序函式 → 頁面元件
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter"; // 用於解析 Markdown 檔案的 YAML frontmatter
import { unstable_cache } from "next/cache"; // Next.js 快取 API，用於 ISR (Incremental Static Regeneration)
import type { BlogPostListItem } from "@/types/content";
import { RELATED_POSTS_FEATURED_COUNT } from "./constants";
import { renderMarkdown } from "./mdx";
import { getReadingTime } from "./utils";

/**
 * 部落格文章過濾選項介面
 * 用於 getPublishedPosts() 函式的參數，提供靈活的文章查詢功能
 */
export interface BlogFilters {
  search?: string;              // 全文搜尋：搜尋標題、摘要、內容
  tag?: string;                 // 標籤過濾：依標籤 slug 或名稱過濾
  category?: string;            // 分類過濾：支援父分類匹配（例如 "tutorials" 匹配 "tutorials" 和 "tutorials/advanced"）
  sort?: "latest" | "views";    // 排序方式：latest=最新發布，views=最多瀏覽
  page?: number;                // 當前頁碼（用於分頁，從 1 開始）
  perPage?: number;             // 每頁顯示文章數（預設 9）
  published?: boolean;          // 是否只顯示已發布文章（預設 true）
}

/**
 * 部落格文章 Frontmatter 介面
 * 定義 MDX 檔案頂部 YAML 區塊的資料結構
 *
 * 範例：
 * ---
 * title: "我的文章標題"
 * excerpt: "文章摘要"
 * date: "2024-01-01"
 * author:
 *   name: "作者名稱"
 * tags: ["React", "Next.js"]
 * published: true
 * featured: true
 * featuredOrder: 1
 * ---
 */
export interface BlogPostFrontmatter {
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags?: string[] | string;
  published: boolean;
  featured?: boolean;
  featuredOrder?: number;
  category?: string;
  slug?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  featured: boolean;
  featuredOrder?: number;
  tags: Array<{ id: string; name: string; slug: string }>;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  readingTime?: string;
  category?: string;
  filePath?: string;
}

/**
 * 部落格文章目錄的絕對路徑
 * 指向專案根目錄下的 content/blog 資料夾
 */
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * 記憶體內的文章瀏覽次數計數器
 * 注意：這是臨時的開發解決方案
 * 在生產環境中，應該使用資料庫或持久化存儲（如 Redis、PostgreSQL）
 * 當伺服器重啟時，此計數器會重置為 0
 */
const viewCounts = new Map<string, number>();

/**
 * 將字串轉換為 URL 友善的 slug 格式
 *
 * @param input - 原始字串（例如："Hello World!"）
 * @returns URL slug（例如："hello-world"）
 *
 * 轉換規則：
 * 1. 轉換為小寫
 * 2. 將所有非字母數字字元替換為連字號
 * 3. 移除開頭和結尾的連字號
 */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * 安全地從 Date 物件或字串取得時間戳記
 *
 * @param date - Date 物件或日期字串
 * @returns Unix 時間戳記（毫秒）
 *
 * 用途：統一處理不同格式的日期，方便進行日期比較和排序
 */
function getTimestamp(date: Date | string): number {
  return date instanceof Date ? date.getTime() : new Date(date).getTime();
}

/**
 * 遞迴取得指定目錄下所有部落格檔案的相對路徑
 *
 * @param dir - 要掃描的目錄
 * @param baseDir - 基礎目錄（用於計算相對路徑）
 * @returns 所有符合條件的檔案相對路徑陣列
 *
 * 功能：
 * - 遞迴掃描子目錄
 * - 只包含 .md 和 .mdx 檔案
 * - 排除 README.md 和 README.mdx
 * - 返回相對於 baseDir 的路徑（例如："tutorials/advanced/post.mdx"）
 *
 * 範例：
 * content/blog/
 *   ├── post1.mdx              → ["post1.mdx"]
 *   ├── tutorials/
 *   │   └── react.mdx          → ["tutorials/react.mdx"]
 *   └── README.md              → 被排除
 */
async function getAllBlogFiles(dir: string, baseDir: string = dir): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return getAllBlogFiles(fullPath, baseDir);
        }
        // Exclude README files and only include .md or .mdx files
        if (/\.mdx?$/.test(entry.name) && !/^README\.mdx?$/i.test(entry.name)) {
          return [path.relative(baseDir, fullPath)];
        }
        return [];
      })
    );
    return files.flat();
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

/**
 * 載入並解析單一部落格文章
 *
 * @param filePath - 相對於 BLOG_DIR 的檔案路徑（例如："tutorials/react.mdx"）
 * @returns 完整的 BlogPost 物件，或在錯誤時返回 null
 *
 * 處理流程：
 * 1. 讀取檔案內容
 * 2. 使用 gray-matter 解析 frontmatter 和內容
 * 3. 驗證必填欄位（title, excerpt, date, author）
 * 4. 從檔案路徑自動提取分類（例如："tutorials/advanced/post.mdx" → category: "tutorials/advanced"）
 * 5. 生成 slug（優先使用 frontmatter.slug，否則使用檔名）
 * 6. 解析標籤（支援陣列或逗號分隔字串）
 * 7. 計算閱讀時間
 * 8. 取得檔案的建立和修改時間
 *
 * 注意：如果缺少必填欄位，會記錄警告並返回 null，該文章將被跳過
 */
async function loadBlogPost(filePath: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(BLOG_DIR, filePath);
    const fileContent = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as BlogPostFrontmatter;

    // 驗證必填欄位 - 如果缺少這些欄位，文章將被跳過
    if (!frontmatter.title || !frontmatter.excerpt || !frontmatter.date) {
      console.warn(`Skipping ${filePath}: Missing required fields (title, excerpt, or date)`);
      return null;
    }

    if (!frontmatter.author || !frontmatter.author.name) {
      console.warn(`Skipping ${filePath}: Missing author information`);
      return null;
    }

    // 從檔案路徑自動提取分類（基於資料夾結構）
    // 範例："tutorials/advanced/post.mdx" → category: "tutorials/advanced"
    const pathParts = filePath.split(path.sep);
    const category = pathParts.length > 1
      ? pathParts.slice(0, -1).join('/') // 取得除了檔名之外的所有路徑部分
      : undefined; // 根目錄層級的文章沒有分類

    // 從檔名生成 slug（可在 frontmatter 中覆寫）
    const fileName = path.basename(filePath, path.extname(filePath));
    const slug = frontmatter.slug || fileName;

    // Generate ID from slug
    const id = slug;

    // Parse date
    const publishedAt = new Date(frontmatter.date);

    // Get file stats for created/updated dates
    const stats = await fs.stat(fullPath);

    // 解析標籤 - 支援陣列或逗號分隔字串格式
    // frontmatter.tags 可以是：
    // 1. 陣列：["React", "Next.js"]
    // 2. 字串："React, Next.js"
    // 3. 未定義：[]
    const tagValues = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : typeof frontmatter.tags === "string"
        ? frontmatter.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

    // 將標籤字串轉換為標準化的標籤物件
    const tags = tagValues.map((tag) => ({
      id: slugify(tag),
      name: tag,
      slug: slugify(tag),
    }));

    // 從記憶體計數器取得瀏覽次數（預設為 0）
    const views = viewCounts.get(slug) || 0;

    return {
      id,
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      content,
      coverImage: frontmatter.coverImage,
      published: frontmatter.published ?? false,
      publishedAt,
      createdAt: stats.birthtime,
      updatedAt: stats.mtime,
      views,
      featured: frontmatter.featured || false,
      featuredOrder: frontmatter.featuredOrder,
      tags,
      author: {
        id: slugify(frontmatter.author.name),
        name: frontmatter.author.name,
        avatar: frontmatter.author.avatar,
        bio: frontmatter.author.bio,
      },
      readingTime: getReadingTime(content),
      category,
      filePath,
    };
  } catch (error) {
    console.error(`Error loading blog post ${filePath}:`, error);
    return null;
  }
}

/**
 * 取得所有部落格文章（包含草稿）
 *
 * @returns 所有文章的陣列
 *
 * 快取策略：
 * - 快取鍵：["all-blog-posts"]
 * - 重新驗證時間：3600 秒（1 小時）
 * - 快取標籤：["posts"]
 *
 * 處理流程：
 * 1. 檢查 content/blog 目錄是否存在
 * 2. 遞迴掃描所有 .md/.mdx 檔案
 * 3. 並行載入和解析所有文章
 * 4. 過濾掉無效的文章（返回 null 的）
 *
 * 注意：此函式會快取所有文章（包含未發布的草稿），
 * 如果只需要已發布文章，請使用 getPublishedPosts()
 */
async function getAllBlogPosts(): Promise<BlogPost[]> {
  return unstable_cache(
    async () => {
      try {
        // 檢查目錄是否存在
        try {
          await fs.access(BLOG_DIR);
        } catch {
          console.warn(`Blog directory ${BLOG_DIR} does not exist, returning empty array`);
          return [];
        }

        const files = await getAllBlogFiles(BLOG_DIR);
        if (files.length === 0) {
          console.warn("No blog post files found");
          return [];
        }

        // 並行載入所有文章以提升效能
        const posts = await Promise.all(files.map((file) => loadBlogPost(file)));
        // 過濾掉無效的文章（loadBlogPost 返回 null 的情況）
        return posts.filter((post): post is BlogPost => post !== null);
      } catch (error) {
        console.error("Error loading blog posts:", error);
        return [];
      }
    },
    ["all-blog-posts"],
    {
      revalidate: 3600, // 1 小時後重新驗證
      tags: ["posts"],  // 可用於按需重新驗證（revalidateTag）
    }
  )();
}

/**
 * 取得已發布的部落格文章（支援過濾、搜尋、排序、分頁）
 *
 * @param filters - 過濾選項物件
 * @returns 包含文章列表和總數的物件
 *
 * 功能：
 * - **發布狀態過濾**：預設只返回已發布文章（published: true）
 * - **標籤過濾**：依標籤 slug 或名稱過濾
 * - **分類過濾**：支援精確匹配和父分類匹配
 *   - "tutorials" 會匹配 "tutorials" 和 "tutorials/advanced"
 * - **全文搜尋**：在標題、摘要、內容中搜尋關鍵字
 * - **排序**：依發布日期（latest）或瀏覽次數（views）
 * - **分頁**：支援分頁顯示
 *
 * 使用範例：
 * ```typescript
 * // 取得第 1 頁的文章（每頁 9 篇）
 * const { posts, total } = await getPublishedPosts({ page: 1, perPage: 9 })
 *
 * // 搜尋包含 "React" 的文章
 * const { posts } = await getPublishedPosts({ search: "React" })
 *
 * // 取得 "tutorials" 分類的文章（包含子分類）
 * const { posts } = await getPublishedPosts({ category: "tutorials" })
 * ```
 *
 * 注意：此函式不使用快取，因為過濾條件太多樣化
 */
export async function getPublishedPosts({
  search,
  tag,
  category,
  sort = "latest",
  page = 1,
  perPage = 9,
  published = true,
}: BlogFilters = {}): Promise<{
  posts: BlogPostListItem[];
  total: number;
}> {
  const allPosts = await getAllBlogPosts();

  // 第一階段：過濾文章
  // 所有過濾條件都必須同時滿足（AND 邏輯）
  let filtered = allPosts.filter((post) => {
    // 1. 發布狀態過濾
    if (published && !post.published) return false;

    // 2. 標籤過濾 - 支援 slug 或名稱匹配（不區分大小寫）
    if (tag) {
      const hasTag = post.tags.some((t) => t.slug === tag || t.name.toLowerCase() === tag.toLowerCase());
      if (!hasTag) return false;
    }

    // 3. 分類過濾 - 支援精確匹配和父分類匹配
    // 例如：category="tutorials" 會匹配：
    //   - "tutorials" (精確匹配)
    //   - "tutorials/advanced" (父分類匹配)
    //   - "tutorials/beginner" (父分類匹配)
    if (category) {
      if (!post.category) return false;
      const matchesExact = post.category === category;
      const matchesParent = post.category.startsWith(`${category}/`);
      if (!matchesExact && !matchesParent) return false;
    }

    // 4. 全文搜尋 - 搜尋標題、內容、摘要（不區分大小寫）
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(searchLower);
      const matchesContent = post.content.toLowerCase().includes(searchLower);
      const matchesExcerpt = post.excerpt.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesContent && !matchesExcerpt) return false;
    }

    return true;
  });

  // 第二階段：排序
  if (sort === "views") {
    // 依瀏覽次數排序（高到低）
    filtered.sort((a, b) => b.views - a.views);
  } else {
    // 依發布日期排序（新到舊）
    filtered.sort((a, b) => getTimestamp(b.publishedAt) - getTimestamp(a.publishedAt));
  }

  const total = filtered.length;

  // 第三階段：分頁
  // 計算起始索引並切片陣列
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  // 第四階段：轉換為列表項目（排除 content 欄位以減少資料大小）
  // 用於列表頁面，不需要完整的文章內容
  const posts: BlogPostListItem[] = paginated.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    published: post.published,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    views: post.views,
    featured: post.featured,
    featuredOrder: post.featuredOrder,
    tags: post.tags,
    readingTime: post.readingTime,
  }));
  
  return { posts, total };
}

/**
 * 取得特色文章（Featured Posts）
 *
 * @param limit - 要返回的文章數量（預設值來自 RELATED_POSTS_FEATURED_COUNT）
 * @returns 特色文章列表
 *
 * 選擇邏輯：
 * 1. 優先選擇標記為 featured 的文章，依 featuredOrder 排序
 * 2. 如果特色文章數量不足，用最新發布的文章補足
 *
 * 範例：
 * - 如果 limit=5，有 3 篇 featured 文章
 * - 會返回：3 篇 featured 文章 + 2 篇最新文章
 *
 * 快取策略：
 * - 快取鍵：["featured-posts"]
 * - 重新驗證時間：60 秒
 * - 快取標籤：["posts", "featured"]
 *
 * 使用場景：首頁、側邊欄推薦文章
 */
export async function getFeaturedPosts(limit = RELATED_POSTS_FEATURED_COUNT): Promise<BlogPostListItem[]> {
  return unstable_cache(
    async () => {
      const allPosts = await getAllBlogPosts();
      const published = allPosts.filter((p) => p.published);

      // 第一步：取得所有 featured 文章，依 featuredOrder 排序
      const featured = published
        .filter((p) => p.featured)
        .sort((a, b) => {
          // featuredOrder 越小越優先（如果沒有設定則視為最低優先級）
          const orderA = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
          const orderB = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        })
        .slice(0, limit);

      // 第二步：如果 featured 文章不足，用最新文章補足
      if (featured.length < limit) {
        const latest = published
          .filter((p) => !p.featured)
          .sort((a, b) => getTimestamp(b.publishedAt) - getTimestamp(a.publishedAt))
          .slice(0, limit - featured.length);
        featured.push(...latest);
      }
      
      return featured.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        published: post.published,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        views: post.views,
        featured: post.featured,
        featuredOrder: post.featuredOrder,
        tags: post.tags,
        readingTime: post.readingTime,
      }));
    },
    ["featured-posts"],
    {
      revalidate: 60,
      tags: ["posts", "featured"],
    }
  )();
}

export async function getPostBySlug(slug: string, includeDraft = false) {
  return unstable_cache(
    async () => {
      const allPosts = await getAllBlogPosts();
      const post = allPosts.find((p) => p.slug === slug);
      
      if (!post) return null;
      if (!includeDraft && !post.published) return null;
      
      return post;
    },
    [`post-${slug}`],
    {
      revalidate: includeDraft ? 0 : 60,
      tags: ["posts", `post-${slug}`],
    }
  )();
}

export async function getAdjacentPosts(publishedAt: Date, postId: string) {
  const allPosts = await getAllBlogPosts();
  const published = allPosts
    .filter((p) => p.published)
    .sort((a, b) => getTimestamp(b.publishedAt) - getTimestamp(a.publishedAt));
  
  const currentIndex = published.findIndex((p) => p.id === postId);
  
  const previous = currentIndex < published.length - 1 ? published[currentIndex + 1] : null;
  const next = currentIndex > 0 ? published[currentIndex - 1] : null;
  
  return {
    previous: previous ? {
      id: previous.id,
      slug: previous.slug,
      title: previous.title,
      excerpt: previous.excerpt,
      coverImage: previous.coverImage,
      published: previous.published,
      publishedAt: previous.publishedAt,
      createdAt: previous.createdAt,
      updatedAt: previous.updatedAt,
      views: previous.views,
      featured: previous.featured,
      featuredOrder: previous.featuredOrder,
      tags: previous.tags,
    } : null,
    next: next ? {
      id: next.id,
      slug: next.slug,
      title: next.title,
      excerpt: next.excerpt,
      coverImage: next.coverImage,
      published: next.published,
      publishedAt: next.publishedAt,
      createdAt: next.createdAt,
      updatedAt: next.updatedAt,
      views: next.views,
      featured: next.featured,
      featuredOrder: next.featuredOrder,
      tags: next.tags,
    } : null,
  };
}

export async function incrementPostViews(postId: string) {
  const current = viewCounts.get(postId) || 0;
  viewCounts.set(postId, current + 1);
}

export async function getRelatedPosts(
  postId: string,
  tagSlugs: string[],
  limit = RELATED_POSTS_FEATURED_COUNT,
): Promise<BlogPostListItem[]> {
  if (!tagSlugs.length) return [];
  
  const allPosts = await getAllBlogPosts();
  const published = allPosts.filter((p) => p.published && p.id !== postId);
  
  // Find posts with matching tags
  const related = published
    .filter((post) => post.tags.some((tag) => tagSlugs.includes(tag.slug)))
    .sort((a, b) => getTimestamp(b.publishedAt) - getTimestamp(a.publishedAt))
    .slice(0, limit);
  
  return related.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    published: post.published,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    views: post.views,
    featured: post.featured,
    featuredOrder: post.featuredOrder,
    tags: post.tags,
    readingTime: post.readingTime,
  }));
}

export async function getTagsWithCount() {
  return unstable_cache(
    async () => {
      const allPosts = await getAllBlogPosts();
      const published = allPosts.filter((p) => p.published);
      
      const tagMap = new Map<string, { slug: string; name: string; count: number }>();
      
      for (const post of published) {
        for (const tag of post.tags) {
          const existing = tagMap.get(tag.slug);
          if (existing) {
            existing.count++;
          } else {
            tagMap.set(tag.slug, {
              slug: tag.slug,
              name: tag.name,
              count: 1,
            });
          }
        }
      }
      
      return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    },
    ["tags-with-count"],
    {
      revalidate: 120,
      tags: ["tags"],
    }
  )();
}

export async function getLatestPost() {
  return unstable_cache(
    async () => {
      const allPosts = await getAllBlogPosts();
      const published = allPosts
        .filter((p) => p.published)
        .sort((a, b) => getTimestamp(b.publishedAt) - getTimestamp(a.publishedAt));

      const latest = published[0];
      if (!latest) return null;

      return {
        slug: latest.slug,
        title: latest.title,
        publishedAt: latest.publishedAt,
      };
    },
    ["latest-post"],
    {
      revalidate: 60,
      tags: ["posts", "latest"],
    }
  )();
}

/**
 * 分類介面
 * 表示一個部落格分類及其統計資訊
 */
export interface Category {
  slug: string;    // URL 友善的 slug（例如："tutorials-advanced"）
  name: string;    // 顯示名稱（例如："Advanced"）
  path: string;    // 完整路徑（例如："tutorials/advanced"）
  count: number;   // 此分類下的文章數量
  parent?: string; // 父分類路徑（例如："tutorials"）
  level: number;   // 巢狀層級（0=根分類，1=第一層子分類）
}

/**
 * 取得所有分類及其文章計數（支援巢狀分類）
 *
 * @returns 分類陣列，依層級和名稱排序
 *
 * 分類來源：
 * - 從檔案路徑自動提取（例如：content/blog/tutorials/advanced/post.mdx → "tutorials/advanced"）
 * - 支援多層巢狀結構
 *
 * 處理邏輯：
 * 1. 遍歷所有已發布文章
 * 2. 拆解每個分類路徑，為每一層建立分類物件
 * 3. 計算每個分類（包含子分類）的文章數量
 * 4. 依層級排序（父分類優先），同層級依字母排序
 *
 * 範例：
 * 假設有以下檔案結構：
 * ```
 * content/blog/
 *   ├── tutorials/
 *   │   ├── react.mdx          → 分類："tutorials"
 *   │   └── advanced/
 *   │       └── hooks.mdx      → 分類："tutorials/advanced"
 *   └── devops/
 *       └── docker.mdx         → 分類："devops"
 * ```
 *
 * 會生成以下分類：
 * ```javascript
 * [
 *   { path: "tutorials", level: 0, count: 2, parent: undefined },
 *   { path: "devops", level: 0, count: 1, parent: undefined },
 *   { path: "tutorials/advanced", level: 1, count: 1, parent: "tutorials" }
 * ]
 * ```
 *
 * 快取策略：
 * - 快取鍵：["categories-with-count"]
 * - 重新驗證時間：120 秒（2 分鐘）
 * - 快取標籤：["categories"]
 */
export async function getCategoriesWithCount(): Promise<Category[]> {
  return unstable_cache(
    async () => {
      const allPosts = await getAllBlogPosts();
      const published = allPosts.filter((p) => p.published);

      const categoryMap = new Map<string, Category>();

      // 遍歷所有已發布文章，建構分類樹
      for (const post of published) {
        if (!post.category) continue;

        const parts = post.category.split('/');
        let currentPath = '';

        // 為每一層建立分類物件
        // 例如："tutorials/advanced" 會建立兩個分類：
        // 1. "tutorials" (level 0)
        // 2. "tutorials/advanced" (level 1)
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          currentPath = i === 0 ? part : `${currentPath}/${part}`;

          const existing = categoryMap.get(currentPath);
          if (existing) {
            // 分類已存在，增加計數
            existing.count++;
          } else {
            // 建立新分類
            categoryMap.set(currentPath, {
              slug: slugify(currentPath),
              name: part.charAt(0).toUpperCase() + part.slice(1), // 首字母大寫
              path: currentPath,
              count: 1,
              parent: i > 0 ? parts.slice(0, i).join('/') : undefined, // 設定父分類
              level: i, // 記錄巢狀層級
            });
          }
        }
      }

      // 排序：先依層級（父分類優先），再依字母順序
      return Array.from(categoryMap.values()).sort((a, b) => {
        // 第一優先：層級（父分類在前）
        if (a.level !== b.level) return a.level - b.level;
        // 第二優先：字母順序
        return a.path.localeCompare(b.path);
      });
    },
    ["categories-with-count"],
    {
      revalidate: 120, // 2 分鐘後重新驗證
      tags: ["categories"],
    }
  )();
}
