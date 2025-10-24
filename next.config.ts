/**
 * Next.js 設定檔
 *
 * 此檔案配置了 Next.js 應用程式的各種設定：
 * - MDX 支援和處理管道
 * - 輸出模式（Standalone）
 * - 快取策略和安全標頭
 * - 路由重定向
 * - 檔案追蹤設定（用於 Docker 部署）
 *
 * MDX 處理流程：
 * 1. 使用 @next/mdx 將 .md/.mdx 檔案視為 React 元件
 * 2. 透過 remark 外掛處理 Markdown 語法（remarkGfm）
 * 3. 透過 rehype 外掛處理 HTML 輸出（slug、語法高亮、自動連結）
 *
 * 注意：lib/mdx.ts 中的 renderMarkdown 函式使用了更完整的外掛鏈（包含 callout），
 *      這裡的設定主要用於直接 import MDX 檔案的情況
 */

import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * MDX 設定
 * 將 .md 和 .mdx 檔案轉換為 React 元件
 */
const withMDX = createMDX({
  extension: /\.mdx?$/,  // 支援 .md 和 .mdx 檔案
  options: {
    // Remark 外掛（處理 Markdown）
    remarkPlugins: [remarkGfm],  // GitHub Flavored Markdown 支援

    // Rehype 外掛（處理 HTML）
    rehypePlugins: [
      rehypeSlug,  // 為標題生成 id 屬性
      [
        rehypeAutolinkHeadings,  // 標題自動連結
        {
          behavior: "wrap",      // 將整個標題包裹在連結中
          properties: {
            className: ["anchor-link"],  // CSS 類別
          },
        },
      ],
      [
        rehypePrettyCode,  // 程式碼語法高亮（使用 Shiki）
        {
          theme: "github-dark",
          keepBackground: false,  // 不保留背景色，由 CSS 控制
        },
      ],
    ],
  },
});

const nextConfig: NextConfig = {
  /**
   * 輸出模式：standalone
   * 生成獨立的伺服器應用程式，適合 Docker 部署
   * 會在 .next/standalone 目錄生成完整的應用程式
   */
  output: "standalone",

  /**
   * 類型化路由：啟用 TypeScript 類型檢查
   * 提供路由的自動完成和類型安全
   */
  typedRoutes: true,

  /**
   * 實驗性功能設定
   */
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",  // Server Actions 的請求大小限制
    },
  },

  /**
   * 檔案追蹤設定（用於 Standalone 輸出）
   * 確保 content 目錄被包含在部署包中
   *
   * 這對於 Docker 部署很重要，因為 standalone 模式只會包含必要的檔案
   * 我們需要明確告訴 Next.js 追蹤 content 目錄的檔案
   */
  outputFileTracingIncludes: {
    "/": ["./content/**/*"],                  // 根路由需要所有內容
    "/sitemap.xml": ["./content/**/*"],       // Sitemap 需要所有內容
    "/archive/[slug]": ["./content/blog/**/*"],  // 部落格頁面需要部落格內容
    "/work/[slug]": ["./content/work/**/*"],  // 專案頁面需要專案內容
  },

  /**
   * 支援的頁面副檔名
   * 允許 .ts, .tsx, .md, .mdx 檔案作為頁面
   */
  pageExtensions: ["ts", "tsx", "md", "mdx"],


  /**
   * HTTP 標頭設定
   * 包含安全標頭和快取策略
   */
  async headers() {
    return [
      /**
       * 安全標頭 - 套用到所有路由
       * 這些標頭提升網站的安全性
       */
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            // HSTS：強制使用 HTTPS
            // max-age=63072000：63 天（約 2 個月）
            // includeSubDomains：包含所有子網域
            // preload：可提交到 HSTS preload 清單
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            // 防止 MIME 類型嗅探攻擊
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            // 控制 Referer 標頭：跨域時只傳送 origin
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            // 防止 clickjacking：只允許同源 iframe
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            // 停用瀏覽器功能（相機、麥克風、地理位置）
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      /**
       * Archive 頁面快取策略
       * 部落格文章使用較短的快取時間，以便快速更新
       */
      {
        source: "/archive/:path*",
        headers: [
          {
            key: "Cache-Control",
            // s-maxage=300：CDN 快取 5 分鐘
            // stale-while-revalidate=600：允許在 10 分鐘內使用過期快取並在背景重新驗證
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
        ],
      },
      /**
       * 靜態資源快取策略
       * Next.js 建置的靜態檔案可以永久快取（檔名包含 hash）
       */
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            // max-age=31536000：快取 1 年
            // immutable：檔案永不改變（因為有 content hash）
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /**
   * 圖片設定
   * 允許從任何 HTTPS 來源載入圖片
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",  // 匹配所有 HTTPS 網域
      },
    ],
  },

  /**
   * URL 重定向設定
   * 維護舊 URL 的 SEO 價值，將舊路由重定向到新路由
   *
   * permanent: true 表示 301 永久重定向，搜尋引擎會更新索引
   */
  async redirects() {
    return [
      // 部落格路由重定向：/blog → /archive
      {
        source: "/blog",
        destination: "/archive",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/archive/:slug",
        permanent: true,
      },
      // 專案路由重定向：/projects → /work
      {
        source: "/projects",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/projects/:slug",
        destination: "/work/:slug",
        permanent: true,
      },
      // CV 重定向：/cv → /about
      {
        source: "/cv",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);
