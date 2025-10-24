/**
 * 部落格文章網格佈局元件
 *
 * 此元件負責以報紙風格的網格佈局顯示部落格文章清單。
 *
 * 佈局邏輯：
 * 1. 第一篇文章：大標題樣式（headline），橫向卡片，佔滿整行
 * 2. 接下來的 N-1 篇特色文章：標準卡片，直向排列
 * 3. 其餘文章：標準卡片，直向排列
 *
 * 響應式設計：
 * - 手機：1 欄
 * - 平板（md）：2 欄
 * - 桌面（lg）：3 欄
 *
 * 使用範例：
 * ```tsx
 * <BlogGrid posts={posts} featuredCount={2} />
 * // 第 1 篇：大標題卡片（橫向）
 * // 第 2 篇：標準卡片（直向）
 * // 其餘：標準卡片（直向）
 * ```
 *
 * 注意：featuredCount 包含第一篇 headline 文章
 */

import type { BlogPostListItem } from "@/types/content";
import { BlogCard } from "./BlogCard";

interface BlogGridProps {
  posts: BlogPostListItem[];  // 要顯示的文章陣列
  featuredCount?: number;     // 特色文章數量（包含 headline），預設 1
}

/**
 * 部落格網格元件
 *
 * @param posts - 文章列表
 * @param featuredCount - 特色文章數量（預設 1，即只有 headline）
 */
export function BlogGrid({ posts, featuredCount = 1 }: BlogGridProps) {
  // 空狀態：當沒有文章時顯示
  if (!posts.length) {
    return (
      <div className="border border-dashed border-black/20 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.35em] text-newspaper-gray dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-400">
        No posts yet. Fresh ink is on the way.
      </div>
    );
  }

  // 文章分組邏輯
  const [headline, ...rest] = posts;  // 第一篇作為 headline

  // 特色文章陣列（包含 headline + 前 N-1 篇）
  const featured = [headline, ...rest.slice(0, featuredCount - 1)].filter(
    Boolean,  // 過濾掉 undefined（當文章總數 < featuredCount 時）
  );

  // 剩餘的一般文章
  const remaining = rest.slice(featuredCount - 1);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Headline 文章 - 橫向卡片，佔滿整行 */}
      {featured[0] && (
        <BlogCard
          key={featured[0].id}
          post={featured[0]}
          featured={true}           // 啟用特殊樣式
          orientation="horizontal"   // 橫向佈局
        />
      )}

      {/* 其他特色文章 - 標準直向卡片 */}
      {featured.slice(1).map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          featured={false}           // 標準樣式
          orientation="vertical"     // 直向佈局
        />
      ))}

      {/* 剩餘的一般文章 - 標準直向卡片 */}
      {remaining.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
