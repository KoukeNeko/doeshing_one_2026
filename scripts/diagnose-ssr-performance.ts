#!/usr/bin/env tsx
/**
 * SSR 效能診斷腳本
 * 測試 Server-Side Rendering 各個階段的時間
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TimingResult {
  step: string;
  duration: number;
}

async function measureStep<T>(
  step: string,
  fn: () => Promise<T>,
): Promise<{ result: T; timing: TimingResult }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return {
    result,
    timing: { step, duration },
  };
}

async function simulateArchivePageRender() {
  console.log("🔍 模擬 /archive 頁面 SSR 渲染過程\n");

  const timings: TimingResult[] = [];
  const overallStart = Date.now();

  // Step 1: Parse searchParams (instant in real scenario)
  const { timing: t1 } = await measureStep("解析 searchParams", async () => {
    const params = {
      search: undefined,
      tag: undefined,
      sort: "latest",
      page: 1,
    };
    return params;
  });
  timings.push(t1);
  console.log(`✓ ${t1.step}: ${t1.duration}ms`);

  // Step 2: Execute database queries (parallel)
  const { result: queryResults, timing: t2 } = await measureStep(
    "執行資料庫查詢 (Promise.all)",
    async () => {
      const listPostSelect = {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        views: true,
        tags: true,
      };

      const where = { published: true };

      const [posts, total, tags] = await Promise.all([
        prisma.post.findMany({
          where,
          orderBy: { publishedAt: "desc" },
          select: listPostSelect,
          skip: 0,
          take: 9,
        }),
        prisma.post.count({ where }),
        prisma.tag.findMany({
          orderBy: { name: "asc" },
          include: {
            _count: {
              select: { posts: true },
            },
          },
        }),
      ]);

      return { posts, total, tags };
    },
  );
  timings.push(t2);
  console.log(`✓ ${t2.step}: ${t2.duration}ms`);
  console.log(`  - 查詢到 ${queryResults.posts.length} 篇文章`);
  console.log(`  - 查詢到 ${queryResults.tags.length} 個標籤`);

  // Step 3: Process data for rendering
  const { timing: t3 } = await measureStep("處理資料", async () => {
    const processed = queryResults.posts.map((post) => ({
      ...post,
      readingTime: undefined,
    }));

    const processedTags = queryResults.tags.map((tag) => ({
      slug: tag.slug,
      name: tag.name,
      count: tag._count.posts,
    }));

    return { posts: processed, tags: processedTags };
  });
  timings.push(t3);
  console.log(`✓ ${t3.step}: ${t3.duration}ms`);

  // Step 4: Render React components (simulated)
  const { timing: t4 } = await measureStep("渲染 React 組件 (模擬)", async () => {
    // Simulate React render time
    await new Promise((resolve) => setTimeout(resolve, 10));
    return null;
  });
  timings.push(t4);
  console.log(`✓ ${t4.step}: ${t4.duration}ms`);

  const totalTime = Date.now() - overallStart;

  console.log("\n📊 時間分析:");
  console.log("─".repeat(50));
  for (const t of timings) {
    const percentage = ((t.duration / totalTime) * 100).toFixed(1);
    const bar = "█".repeat(Math.round((t.duration / totalTime) * 30));
    console.log(`${t.step.padEnd(25)} ${t.duration}ms\t${bar} ${percentage}%`);
  }
  console.log("─".repeat(50));
  console.log(`總計: ${totalTime}ms`);

  return { timings, totalTime };
}

async function testCacheEffectiveness() {
  console.log("\n🔄 測試快取效果\n");

  const iterations = 5;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const { totalTime } = await simulateArchivePageRender();
    times.push(totalTime);
    console.log(`\n第 ${i + 1} 次渲染: ${totalTime}ms`);

    if (i < iterations - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log("\n📈 統計結果:");
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`平均: ${avg.toFixed(2)}ms`);
  console.log(`最快: ${min}ms`);
  console.log(`最慢: ${max}ms`);
  console.log(`變異: ${(max - min)}ms`);

  if (max - min > 50) {
    console.log("\n⚠️  渲染時間變異較大，可能沒有有效的快取");
  } else {
    console.log("\n✅ 渲染時間穩定");
  }
}

async function checkNextJsCacheConfig() {
  console.log("\n⚙️  檢查 Next.js 快取設定\n");

  const envVars = [
    "NODE_ENV",
    "NEXT_PUBLIC_VERCEL_ENV",
    "DATABASE_URL",
  ];

  for (const varName of envVars) {
    const value = process.env[varName];
    if (value) {
      const displayValue =
        varName === "DATABASE_URL"
          ? value.substring(0, 30) + "..."
          : value;
      console.log(`✓ ${varName}: ${displayValue}`);
    } else {
      console.log(`✗ ${varName}: 未設定`);
    }
  }

  console.log("\n建議檢查項目:");
  console.log("1. 確認 Next.js revalidate 設定 (當前: 60 秒)");
  console.log("2. 確認 unstable_cache 是否正確使用");
  console.log("3. 檢查是否使用 Connection Pooler");
  console.log("4. 確認部署環境的網路延遲");
}

async function main() {
  console.log("🚀 開始 SSR 效能診斷\n");
  console.log("=".repeat(50));

  try {
    // 1. 測試單次渲染
    await simulateArchivePageRender();

    // 2. 測試快取效果
    // await testCacheEffectiveness();

    // 3. 檢查環境設定
    await checkNextJsCacheConfig();

    console.log("\n" + "=".repeat(50));
    console.log("\n💡 效能優化建議:\n");

    console.log("如果 SSR 時間過長 (>100ms):");
    console.log("1. 使用 Prisma Connection Pooler (pgBouncer)");
    console.log("2. 優化資料庫查詢 (減少欄位、增加索引)");
    console.log("3. 使用 Redis 快取查詢結果");
    console.log("4. 考慮使用 ISR (Incremental Static Regeneration)");
    console.log("5. 檢查網路延遲 (database 到 application 的距離)");

    console.log("\n如果網路請求時間過長 (>300ms):");
    console.log("1. 檢查 CDN 設定");
    console.log("2. 啟用 HTTP/2 或 HTTP/3");
    console.log("3. 優化 Next.js 產生的 bundle 大小");
    console.log("4. 使用 Edge Runtime");

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("\n❌ 診斷失敗:", error);
  process.exit(1);
});
