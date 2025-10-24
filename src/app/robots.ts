import type { MetadataRoute } from "next";

// 在 build 時靜態生成 robots.txt
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // 確保使用正確的基礎 URL，優先使用環境變數，否則使用生產域名
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = siteUrl?.startsWith("http")
    ? siteUrl
    : "https://doeshing.one";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
