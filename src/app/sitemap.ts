import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog";
import { loadAllProjects } from "@/lib/mdx";

// 讓 sitemap 在每次請求時重新生成，並快取 1 分鐘
export const revalidate = 60; // 60 秒重新驗證一次

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 確保使用正確的基礎 URL，優先使用環境變數，否則使用生產域名
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = siteUrl?.startsWith("http")
    ? siteUrl
    : "https://doeshing.one";

  // 獲取所有已發布的部落格文章（不分頁，獲取所有文章）
  const { posts } = await getPublishedPosts({ perPage: 1000 });

  // 獲取所有專案
  const projects = await loadAllProjects();

  // 靜態頁面（只包含最終目標 URL，不包含會被重定向的 URL）
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Archive 文章頁面（不包含 /blog/:slug，因為會被重新導向到 /archive/:slug）
  const archivePages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/archive/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 專案頁面
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: project.frontmatter.date
      ? new Date(project.frontmatter.date)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...archivePages, ...projectPages];
}
