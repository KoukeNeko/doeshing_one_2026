#!/usr/bin/env tsx
/**
 * Archive 頁面效能測試腳本
 * 測試 getPublishedPosts 和 getTagsWithCount 的執行時間
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

interface BlogFilters {
  search?: string;
  tag?: string;
  sort?: "latest" | "views";
  page?: number;
  perPage?: number;
}

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

async function testGetPublishedPosts(options: BlogFilters = {}) {
  const {
    search,
    tag,
    sort = "latest",
    page = 1,
    perPage = 9,
  } = options;

  const where: any = {
    published: true,
  };

  if (tag) {
    where.tags = {
      some: {
        slug: tag,
      },
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const startTotal = Date.now();
  const total = await prisma.post.count({ where });
  const totalTime = Date.now() - startTotal;

  const orderBy =
    sort === "views"
      ? { views: "desc" as const }
      : { publishedAt: "desc" as const };

  const startPosts = Date.now();
  const posts = await prisma.post.findMany({
    where,
    orderBy,
    select: listPostSelect,
    skip: (page - 1) * perPage,
    take: perPage,
  });
  const postsTime = Date.now() - startPosts;

  return {
    posts,
    total,
    timing: {
      countQuery: totalTime,
      findManyQuery: postsTime,
      total: totalTime + postsTime,
    },
  };
}

async function testGetTagsWithCount() {
  const start = Date.now();
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });
  const time = Date.now() - start;

  return {
    tags: tags.map((tagItem) => ({
      slug: tagItem.slug,
      name: tagItem.name,
      count: tagItem._count.posts,
    })),
    timing: time,
  };
}

async function runTests() {
  console.log("🧪 開始測試 Archive 頁面效能\n");

  // 測試 1: 並行請求（模擬實際頁面載入）
  console.log("1️⃣ 測試並行請求 (Promise.all):");
  const parallelStart = Date.now();
  const [postsResult, tagsResult] = await Promise.all([
    testGetPublishedPosts({ page: 1, perPage: 9 }),
    testGetTagsWithCount(),
  ]);
  const parallelTime = Date.now() - parallelStart;

  console.log(`   Posts 查詢:`);
  console.log(`     - COUNT 查詢: ${postsResult.timing.countQuery}ms`);
  console.log(`     - findMany 查詢: ${postsResult.timing.findManyQuery}ms`);
  console.log(`     - 小計: ${postsResult.timing.total}ms`);
  console.log(`   Tags 查詢: ${tagsResult.timing}ms`);
  console.log(`   ⏱️  並行總時間: ${parallelTime}ms`);
  console.log(`   📊 返回資料: ${postsResult.posts.length} posts, ${tagsResult.tags.length} tags`);

  // 測試 2: 序列請求
  console.log("\n2️⃣ 測試序列請求 (依序執行):");
  const sequentialStart = Date.now();
  const postsResult2 = await testGetPublishedPosts({ page: 1, perPage: 9 });
  const tagsResult2 = await testGetTagsWithCount();
  const sequentialTime = Date.now() - sequentialStart;

  console.log(`   Posts 查詢: ${postsResult2.timing.total}ms`);
  console.log(`   Tags 查詢: ${tagsResult2.timing}ms`);
  console.log(`   ⏱️  序列總時間: ${sequentialTime}ms`);

  // 測試 3: 不同的查詢情境
  console.log("\n3️⃣ 測試不同查詢情境:");

  console.log("   a) 按瀏覽次數排序:");
  const viewsSortStart = Date.now();
  const viewsResult = await testGetPublishedPosts({ sort: "views" });
  const viewsSortTime = Date.now() - viewsSortStart;
  console.log(`      ⏱️  ${viewsSortTime}ms`);

  console.log("   b) 按標籤篩選:");
  const tagFilterStart = Date.now();
  const tagResult = await testGetPublishedPosts({ tag: tagsResult.tags[0]?.slug });
  const tagFilterTime = Date.now() - tagFilterStart;
  console.log(`      ⏱️  ${tagFilterTime}ms`);

  console.log("   c) 搜尋功能:");
  const searchStart = Date.now();
  const searchResult = await testGetPublishedPosts({ search: "design" });
  const searchTime = Date.now() - searchStart;
  console.log(`      ⏱️  ${searchTime}ms`);

  // 測試 4: 連續多次請求測試快取效果
  console.log("\n4️⃣ 測試連續請求 (5次):");
  const times: number[] = [];
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    await testGetPublishedPosts({ page: 1, perPage: 9 });
    const time = Date.now() - start;
    times.push(time);
    console.log(`   第 ${i + 1} 次: ${time}ms`);
  }
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`   平均時間: ${avgTime.toFixed(2)}ms`);

  // 分析與建議
  console.log("\n📊 效能分析:");
  if (parallelTime > 200) {
    console.log("   ⚠️  並行請求超過 200ms，可能的原因：");
    if (postsResult.timing.countQuery > 50) {
      console.log("      - COUNT 查詢較慢 (${postsResult.timing.countQuery}ms)");
    }
    if (postsResult.timing.findManyQuery > 100) {
      console.log(`      - findMany 查詢較慢 (${postsResult.timing.findManyQuery}ms)`);
    }
    if (tagsResult.timing > 50) {
      console.log(`      - Tags 查詢較慢 (${tagsResult.timing}ms)`);
    }
    console.log("\n   💡 建議優化方向：");
    console.log("      1. 檢查是否有適當的資料庫索引");
    console.log("      2. 考慮使用 Redis 快取結果");
    console.log("      3. 檢查資料庫連線是否使用 Connection Pooler");
    console.log("      4. 減少查詢欄位或分頁大小");
  } else {
    console.log(`   ✅ 效能良好！並行請求只需 ${parallelTime}ms`);
  }

  // 檢查索引
  console.log("\n5️⃣ 檢查資料庫索引:");
  const indexes = await prisma.$queryRaw<Array<{ indexname: string; indexdef: string }>>`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'Post'
    ORDER BY indexname
  `;
  console.log(`   找到 ${indexes.length} 個索引:`);
  for (const idx of indexes) {
    console.log(`      - ${idx.indexname}`);
  }

  await prisma.$disconnect();
}

runTests().catch((error) => {
  console.error("❌ 測試失敗:", error);
  process.exit(1);
});
