/**
 * 首頁元件 (Homepage)
 *
 * 這是網站的主要入口頁面，採用報紙風格的雜誌式佈局。
 *
 * 頁面結構：
 * 1. Hero Section - 標題、簡介、CTA 按鈕、最新文章摘要
 * 2. Quick Navigation - 三個快速導航卡片（Archive、Work、About）
 * 3. Featured Stories - 特色部落格文章網格
 * 4. Studio Work - 特色專案展示
 *
 * 資料載入策略：
 * - 使用 Promise.all 並行載入文章和專案，提升效能
 * - getFeaturedPosts: 從快取取得特色文章（60 秒快取）
 * - loadAllProjects: 載入所有專案並依日期排序
 *
 * ISR (Incremental Static Regeneration)：
 * - revalidate: 60 秒 - 每分鐘重新生成一次頁面
 * - 確保內容保持相對新鮮，同時保有靜態頁面的效能優勢
 *
 * 使用的常數（來自 lib/constants.ts）：
 * - HOMEPAGE_FEATURED_COUNT: 首頁特色文章數（預設 2）
 * - HOMEPAGE_POSTS_FETCH_LIMIT: 首頁總共載入的文章數（預設 6）
 * - FEATURED_PROJECT_LIMIT: 首頁顯示的專案數（預設 3）
 */

import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedPosts } from "@/lib/blog";
import { loadAllProjects } from "@/lib/mdx";
import { getNewspaperDateline } from "@/lib/utils";
import {
  HOMEPAGE_FEATURED_COUNT,
  HOMEPAGE_POSTS_FETCH_LIMIT,
  FEATURED_PROJECT_LIMIT,
} from "@/lib/constants";

/**
 * ISR 設定：每 60 秒重新驗證頁面
 * 這使得首頁可以在不完全重建網站的情況下保持內容更新
 */
export const revalidate = 60;

/**
 * 快速導航連結資料
 * 顯示在首頁的 "Quick Navigation" 區段
 * 每個連結都是一個可點擊的卡片，提供網站主要區域的快速訪問
 */
const quickLinks: Array<{
  title: string;
  description: string;
  href: string;
}> = [
  {
    title: "The Archive",
    description:
      "Long-form essays, process notes, and behind-the-scenes breakdowns from studio practice.",
    href: "/archive",
  },
  {
    title: "Studio Work",
    description:
      "A curated collection of client engagements, experiments, and shipped products.",
    href: "/work",
  },
  {
    title: "About",
    description:
      "Background, experience, and credentials—the story behind the work.",
    href: "/about",
  },
];

/**
 * 首頁元件 (非同步 Server Component)
 *
 * 在伺服器端載入資料並渲染頁面
 * Next.js 會自動處理資料載入和快取
 *
 * @returns 首頁 JSX
 */
export default async function HomePage() {
  // 並行載入特色文章和專案資料
  // 使用 Promise.all 可以同時發起兩個請求，減少總載入時間
  const [featuredPosts, projects] = await Promise.all([
    getFeaturedPosts(HOMEPAGE_POSTS_FETCH_LIMIT),  // 取得特色文章（快取 60 秒）
    loadAllProjects(),                              // 載入所有專案（快取 1 小時）
  ]);

  // 只取前 N 個專案顯示在首頁
  const featuredProjects = projects.slice(0, FEATURED_PROJECT_LIMIT);

  return (

    <div className="space-y-20">
      <section className="grid gap-6 border border-black/10 bg-white px-6 py-10 shadow-editorial dark:border-white/10 dark:bg-zinc-900 md:grid-cols-[2fr,1fr] md:gap-12 md:px-10 md:py-12">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-newspaper-gray dark:text-zinc-400">
            {getNewspaperDateline()}
          </span>
          <h1 className="font-serif text-4xl tracking-tight text-newspaper-ink dark:text-zinc-50 sm:text-5xl md:text-6xl">
            Doeshing Gazette: Editorial craftsmanship for the modern web
          </h1>
          <p className="max-w-2xl text-base text-newspaper-gray dark:text-zinc-400">
            A magazine-style portfolio blending design engineering, narrative systems, and modern web craft. New dispatches weekly.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild>
              <Link href="/work" className="gap-2">
                View Work
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact" className="gap-2">
                Get In Touch
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-6 border-t border-black/10 pt-6 dark:border-white/10 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-accent dark:text-red-400">
              Latest Dispatch
            </span>
            <p className="mt-4 text-sm text-newspaper-gray dark:text-zinc-400">
              {featuredPosts[0]?.excerpt ??
                "Fresh essays on design systems, developer tooling, and narrative-driven product work."}
            </p>
          </div>
          <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            <span>FEATURED AREAS</span>
            <span className="flex flex-wrap gap-3 text-[11px]">
              <span className="rounded-sm border border-black/10 px-2 py-1 dark:border-white/10">
                Product Design
              </span>
              <span className="rounded-sm border border-black/10 px-2 py-1 dark:border-white/10">
                Frontend Engineering
              </span>
              <span className="rounded-sm border border-black/10 px-2 py-1 dark:border-white/10">
                Narrative Systems
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-newspaper-gray dark:text-zinc-400">
            <Newspaper size={18} strokeWidth={1.5} />
            Weekly briefings direct to your inbox.
            <Link
              href="/newsletter"
              className="text-newspaper-accent underline-offset-4 hover:underline dark:text-red-400"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          kicker="Quick Navigation"
          title="Highlights from the newsroom"
          description="Browse the latest writing, explore featured projects, or download the résumé for offline reading."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href as any}
              className="flex flex-col gap-4 border border-black/10 bg-white px-6 py-8 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:border-newspaper-ink hover:shadow-editorial dark:border-white/10 dark:bg-zinc-900 dark:hover:border-zinc-400"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-accent dark:text-red-400">
                {link.title}
              </span>
              <p className="text-sm text-newspaper-gray dark:text-zinc-400">{link.description}</p>
              <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-newspaper-ink dark:text-zinc-100">
                Explore
                <ArrowRight size={16} strokeWidth={1.5} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          kicker="Featured Stories"
          title="Latest essays and field notes"
          description="The editorial feed surfaces well-crafted pieces on design, development, and the craft of storytelling."
        />
        <BlogGrid posts={featuredPosts} featuredCount={HOMEPAGE_FEATURED_COUNT} />
        <div className="flex justify-end">
          <Button asChild variant="ghost">
            <Link href="/archive" className="gap-2">
              Read the archive
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          kicker="Studio Work"
          title="Current focus and featured collaborations"
          description="Case studies that blend storytelling with product thinking across web, mobile, and experiential media."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              highlight={false}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button asChild variant="ghost">
            <Link href="/work" className="gap-2">
              View all work
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
