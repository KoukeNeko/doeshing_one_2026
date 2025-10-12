# 連線問題修復摘要

## 問題描述
資料庫連線超時，無法正常執行 Prisma 操作。

## 根本原因
1. **缺少 `directUrl` 配置**：Prisma schema 中只有 `url` 而沒有 `directUrl`
2. **Connection Pooler 限制**：Supabase 的 Connection Pooler (PgBouncer) 不支援某些資料庫操作（如 migrations）
3. **資料表未建立**：資料庫中沒有建立應用程式所需的資料表

## 修復步驟

### 1. 更新 Prisma Schema
在 [prisma/schema.prisma](../prisma/schema.prisma) 中加入 `directUrl`：

```diff
datasource db {
-  provider = "postgresql"
-  url      = env("DATABASE_URL")
+  provider  = "postgresql"
+  url       = env("DATABASE_URL")
+  directUrl = env("DIRECT_URL")
}
```

### 2. 推送 Schema 到資料庫
```bash
npx prisma generate
npx prisma db push
```

### 3. 驗證連線
```bash
npm run db:test
```

## 修復結果

✅ 資料庫連線成功（約 2-3 秒）
✅ 所有資料表已建立：
   - Post
   - Tag
   - Author
   - User
   - Account
   - Session
   - VerificationToken

## 新增的工具

### 診斷腳本
位置：[scripts/test-db-connection.ts](../scripts/test-db-connection.ts)

功能：
- 檢查環境變數配置
- 驗證連線字串格式
- 測試資料庫連線
- 檢查資料表完整性

使用方式：
```bash
npm run db:test
```

### 新增的 npm scripts
```json
{
  "prisma:push": "prisma db push",        // 推送 schema（開發用）
  "prisma:studio": "prisma studio",       // 開啟資料庫 GUI
  "db:test": "tsx scripts/test-db-connection.ts"  // 測試連線
}
```

## 後續建議

### 1. 優化連線字串
在 `.env` 中加入更多參數：

```env
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1&pool_timeout=0&connect_timeout=10"
```

### 2. 建立種子資料
如果需要測試資料：

```bash
npm run db:seed
```

### 3. 使用 Prisma Studio
視覺化管理資料：

```bash
npm run prisma:studio
```

### 4. 生產環境部署
使用 migrations 而非 `db push`：

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy
```

## 相關文件
- [資料庫設定指南](./DATABASE_SETUP.md)
- [Prisma 官方文檔](https://www.prisma.io/docs)
- [Supabase + Prisma 整合](https://supabase.com/docs/guides/integrations/prisma)

## 檢查清單

- [x] 修復 Prisma schema 配置
- [x] 建立所有資料表
- [x] 驗證資料庫連線
- [x] 建立診斷工具
- [x] 更新 package.json scripts
- [x] 撰寫文檔
- [ ] 建立種子資料（選用）
- [ ] 設定 CI/CD（選用）

## 下一步

1. 執行 `npm run dev` 啟動開發伺服器
2. 測試應用程式功能
3. 如需新增資料，使用 `npm run prisma:studio`
4. 準備部署時，建立 migration：`npx prisma migrate dev`

---

修復完成時間：2025-10-12
修復工具：Prisma, Supabase, tsx
