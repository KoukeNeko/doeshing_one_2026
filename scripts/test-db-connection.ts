#!/usr/bin/env tsx
/**
 * 資料庫連線診斷腳本
 * 用於測試 Prisma 對 PostgreSQL 的連線狀態
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
  const isPostgresProtocol = dbUrl.startsWith("postgresql://");
  const hasSslMode = dbUrl.includes("sslmode=");
  const hasSchema = dbUrl.includes("schema=");

  console.log(
    `   使用 postgresql:// 協定: ${isPostgresProtocol ? "✅" : "⚠️  建議確認"}`,
  );
  console.log(
    `   指定 schema 參數: ${hasSchema ? "✅" : "ℹ️  未指定時預設為 public"}`,
  );
  console.log(
    `   設定 SSL (sslmode): ${hasSslMode ? "✅" : "ℹ️  是否需要視環境而定"}`,
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
   1. 確認 PostgreSQL 服務是否啟動並可接受連線（本機可使用 \`psql\` 測試，雲端請查看供應商主控台狀態）
   2. 檢查網路與防火牆設定：請確認資料庫主機的 5432 埠對目前環境開放，必要時更新允許的來源 IP
   3. 若使用雲端服務，檢查是否需要透過連線池或強制 SSL，並將相關參數加入 DATABASE_URL
        `);
      } else if (
        error.message.includes("authentication") ||
        error.message.includes("password")
      ) {
        console.log(`
   1. 檢查資料庫帳號與密碼：確認 .env 憑證與實際使用者一致
   2. 嘗試使用 \`psql\` 或圖形化工具登入；必要時於資料庫主控台重新設定密碼
   3. 確認使用者對指定資料庫與 schema 擁有 CONNECT / USAGE 權限
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
   2. 確認 DATABASE_URL 格式正確（可參考 Prisma 文件：https://pris.ly/d/connection-strings）
   3. 嘗試以 psql 或其他工具連線，以判斷是否為 Prisma 設定問題
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
