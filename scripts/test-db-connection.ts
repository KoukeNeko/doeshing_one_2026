#!/usr/bin/env tsx
/**
 * 資料庫連線診斷腳本
 * 用於測試 Prisma 和 Supabase 的連線狀態
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

async function testConnection() {
  console.log("🔍 開始診斷資料庫連線...\n");

  // 測試 1: 檢查環境變數
  console.log("1️⃣ 檢查環境變數:");
  const hasDbUrl = !!process.env.DATABASE_URL;
  const hasDirectUrl = !!process.env.DIRECT_URL;
  console.log(`   DATABASE_URL: ${hasDbUrl ? "✅ 已設定" : "❌ 未設定"}`);
  console.log(`   DIRECT_URL: ${hasDirectUrl ? "✅ 已設定" : "❌ 未設定"}`);

  if (!hasDbUrl) {
    console.error("\n❌ 錯誤: DATABASE_URL 環境變數未設定");
    process.exit(1);
  }

  // 測試 2: 檢查連線字串格式
  console.log("\n2️⃣ 檢查連線字串格式:");
  const dbUrl = process.env.DATABASE_URL || "";
  const isPooler = dbUrl.includes("pooler.supabase.com");
  const hasPgBouncer = dbUrl.includes("pgbouncer=true");
  const hasConnectionLimit = dbUrl.includes("connection_limit");

  console.log(`   使用 Connection Pooler: ${isPooler ? "✅" : "⚠️  建議使用"}`);
  console.log(`   pgbouncer 參數: ${hasPgBouncer ? "✅" : "⚠️  建議加入"}`);
  console.log(
    `   connection_limit 參數: ${hasConnectionLimit ? "✅" : "⚠️  建議加入"}`,
  );

  // 測試 3: 嘗試連線
  console.log("\n3️⃣ 測試資料庫連線:");
  const startTime = Date.now();

  try {
    console.log("   正在連線...");
    await prisma.$connect();
    const connectionTime = Date.now() - startTime;
    console.log(`   ✅ 連線成功 (${connectionTime}ms)`);

    // 測試 4: 執行簡單查詢
    console.log("\n4️⃣ 執行測試查詢:");
    const queryStart = Date.now();
    await prisma.$queryRaw`SELECT 1 as test`;
    const queryTime = Date.now() - queryStart;
    console.log(`   ✅ 查詢成功 (${queryTime}ms)`);

    // 測試 5: 檢查資料表
    console.log("\n5️⃣ 檢查資料表:");
    try {
      const postCount = await prisma.post.count();
      const tagCount = await prisma.tag.count();
      const authorCount = await prisma.author.count();

      console.log(`   Posts: ${postCount}`);
      console.log(`   Tags: ${tagCount}`);
      console.log(`   Authors: ${authorCount}`);
      console.log("   ✅ 所有資料表正常");
    } catch (error) {
      console.log("   ⚠️  部分資料表可能尚未遷移");
      if (error instanceof Error) {
        console.log(`   錯誤: ${error.message}`);
      }
    }

    console.log("\n✅ 診斷完成 - 資料庫連線正常！");
  } catch (error) {
    const connectionTime = Date.now() - startTime;
    console.error(`\n❌ 連線失敗 (${connectionTime}ms)`);

    if (error instanceof Error) {
      console.error(`\n錯誤訊息: ${error.message}`);

      // 提供具體的修復建議
      console.log("\n🔧 修復建議:");

      if (error.message.includes("timeout") || connectionTime > 5000) {
        console.log(`
   1. 檢查 Supabase 專案狀態:
      - 登入 https://supabase.com/dashboard
      - 確認專案沒有被暫停（Free tier 會在 7 天不活動後暫停）
      - 點擊 "Restore project" 恢復專案

   2. 使用 Connection Pooler:
      - 在 Supabase Dashboard > Project Settings > Database
      - 複製 "Connection Pooling" 下的連線字串
      - 更新 .env 中的 DATABASE_URL

   3. 檢查網路連線:
      - 確認可以訪問 Supabase 服務
      - 檢查防火牆設定
      - 嘗試使用 VPN
        `);
      } else if (
        error.message.includes("authentication") ||
        error.message.includes("password")
      ) {
        console.log(`
   1. 檢查資料庫密碼:
      - 確認 .env 中的密碼正確
      - 在 Supabase Dashboard > Project Settings > Database > Connection string
      - 重置密碼並更新 .env
        `);
      } else if (error.message.includes("does not exist")) {
        console.log(`
   1. 執行資料庫遷移:
      npm run prisma:generate
      npx prisma migrate deploy

   2. 或使用 Prisma push (開發環境):
      npx prisma db push
        `);
      } else {
        console.log(`
   1. 檢查完整錯誤訊息
   2. 確認 DATABASE_URL 格式正確
   3. 查看 Supabase Dashboard 日誌
        `);
      }
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().catch((error) => {
  console.error("診斷腳本執行失敗:", error);
  process.exit(1);
});
