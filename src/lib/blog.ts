import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache";
import type { BlogPostListItem } from "@/types/content";
import { RELATED_POSTS_FEATURED_COUNT } from "./constants";
import { renderMarkdown } from "./mdx";
import { getReadingTime } from "./utils";

export interface BlogFilters {
  search?: string;
  tag?: string;
  category?: string;
  sort?: "latest" | "views";
  page?: number;
  perPage?: number;
  published?: boolean;
}

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

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// In-memory view counter (in production, you'd use a database or file system)
const viewCounts = new Map<string, number>();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Helper to safely get timestamp from Date or string
function getTimestamp(date: Date | string): number {
  return date instanceof Date ? date.getTime() : new Date(date).getTime();
}

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

async function loadBlogPost(filePath: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(BLOG_DIR, filePath);
    const fileContent = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as BlogPostFrontmatter;

    // Validate required fields
    if (!frontmatter.title || !frontmatter.excerpt || !frontmatter.date) {
      console.warn(`Skipping ${filePath}: Missing required fields (title, excerpt, or date)`);
      return null;
    }

    if (!frontmatter.author || !frontmatter.author.name) {
      console.warn(`Skipping ${filePath}: Missing author information`);
      return null;
    }

    // Extract category from file path (automatic, based on folder structure)
    // Example: "tutorials/advanced/post.mdx" -> category: "tutorials/advanced"
    const pathParts = filePath.split(path.sep);
    const category = pathParts.length > 1
      ? pathParts.slice(0, -1).join('/') // Get all parts except filename
      : undefined; // Root level posts have no category

    // Generate slug from filename
    const fileName = path.basename(filePath, path.extname(filePath));
    const slug = frontmatter.slug || fileName;

    // Generate ID from slug
    const id = slug;

    // Parse date
    const publishedAt = new Date(frontmatter.date);

    // Get file stats for created/updated dates
    const stats = await fs.stat(fullPath);

    const tagValues = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : typeof frontmatter.tags === "string"
        ? frontmatter.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

    // Parse tags
    const tags = tagValues.map((tag) => ({
      id: slugify(tag),
      name: tag,
      slug: slugify(tag),
    }));

    // Get view count
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

async function getAllBlogPosts(): Promise<BlogPost[]> {
  return unstable_cache(
    async () => {
      try {
        // Check if directory exists
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

        const posts = await Promise.all(files.map((file) => loadBlogPost(file)));
        // Filter out null values (invalid posts)
        return posts.filter((post): post is BlogPost => post !== null);
      } catch (error) {
        console.error("Error loading blog posts:", error);
        return [];
      }
    },
    ["all-blog-posts"],
    {
      revalidate: 3600,
      tags: ["posts"],
    }
  )();
}

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

  // Filter posts
  let filtered = allPosts.filter((post) => {
    if (published && !post.published) return false;

    if (tag) {
      const hasTag = post.tags.some((t) => t.slug === tag || t.name.toLowerCase() === tag.toLowerCase());
      if (!hasTag) return false;
    }

    if (category) {
      // Support both exact match and parent category match
      // e.g., category="tutorials" matches "tutorials" and "tutorials/advanced"
      if (!post.category) return false;
      const matchesExact = post.category === category;
      const matchesParent = post.category.startsWith(`${category}/`);
      if (!matchesExact && !matchesParent) return false;
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(searchLower);
      const matchesContent = post.content.toLowerCase().includes(searchLower);
      const matchesExcerpt = post.excerpt.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesContent && !matchesExcerpt) return false;
    }

    return true;
  });
  
  // Sort posts
  if (sort === "views") {
    filtered.sort((a, b) => b.views - a.views);
  } else {
    filtered.sort((a, b) => getTimestamp(b.publishedAt) - getTimestamp(a.publishedAt));
  }
  
  const total = filtered.length;
  
  // Paginate
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);
  
  // Convert to list items (exclude content)
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

export async function getFeaturedPosts(limit = RELATED_POSTS_FEATURED_COUNT): Promise<BlogPostListItem[]> {
  return unstable_cache(
    async () => {
      const allPosts = await getAllBlogPosts();
      const published = allPosts.filter((p) => p.published);
      
      // Get featured posts
      const featured = published
        .filter((p) => p.featured)
        .sort((a, b) => {
          const orderA = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
          const orderB = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
          return orderA - orderB;
        })
        .slice(0, limit);
      
      // Fill with latest if needed
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

export interface Category {
  slug: string;
  name: string;
  path: string;
  count: number;
  parent?: string;
  level: number;
}

export async function getCategoriesWithCount(): Promise<Category[]> {
  return unstable_cache(
    async () => {
      const allPosts = await getAllBlogPosts();
      const published = allPosts.filter((p) => p.published);

      const categoryMap = new Map<string, Category>();

      for (const post of published) {
        if (!post.category) continue;

        const parts = post.category.split('/');
        let currentPath = '';

        // Build categories for each level (e.g., "tutorials" and "tutorials/advanced")
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          currentPath = i === 0 ? part : `${currentPath}/${part}`;

          const existing = categoryMap.get(currentPath);
          if (existing) {
            existing.count++;
          } else {
            categoryMap.set(currentPath, {
              slug: slugify(currentPath),
              name: part.charAt(0).toUpperCase() + part.slice(1), // Capitalize first letter
              path: currentPath,
              count: 1,
              parent: i > 0 ? parts.slice(0, i).join('/') : undefined,
              level: i,
            });
          }
        }
      }

      return Array.from(categoryMap.values()).sort((a, b) => {
        // Sort by level first (parent categories before children)
        if (a.level !== b.level) return a.level - b.level;
        // Then alphabetically
        return a.path.localeCompare(b.path);
      });
    },
    ["categories-with-count"],
    {
      revalidate: 120,
      tags: ["categories"],
    }
  )();
}
