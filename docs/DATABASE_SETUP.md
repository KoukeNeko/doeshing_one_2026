# 資料庫設定指南

## 已完成的修復

### 問題診斷
您遇到的連線問題已成功解決！主要問題是：

1. **缺少 `directUrl` 配置** - Prisma schema 中沒有設定 `directUrl`，導致遷移操作超時
2. **資料表尚未建立** - 資料庫中沒有建立 schema 定義的資料表

### 修復內容
✅ 已在 `prisma/schema.prisma` 中加入 `directUrl = env("DIRECT_URL")`
✅ 已成功推送 schema 到 Supabase 資料庫
✅ 所有資料表已建立：Post, Tag, Author, User, Account, Session, VerificationToken

## Supabase + Prisma 最佳實踐

### 1. 連線字串配置

Supabase + Prisma 需要兩種連線字串：

```env
# Connection Pooler - 用於應用程式查詢（高併發）
DATABASE_URL="postgresql://postgres.PROJECT-REF:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection - 用於遷移和 schema 變更
DIRECT_URL="postgresql://postgres.PROJECT-REF:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres"
```

**為什麼需要兩個連線？**
- **DATABASE_URL (Pooler)**: 透過 PgBouncer 連線池，適合高併發查詢，但不支援某些 PostgreSQL 功能（如 prepared statements）
- **DIRECT_URL**: 直接連線到 PostgreSQL，遷移操作需要完整的資料庫功能

### 2. Prisma Schema 配置

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // 用於應用程式查詢
  directUrl = env("DIRECT_URL")        // 用於遷移
}
```

### 3. 資料庫操作指令

#### 開發環境
```bash
# 快速同步 schema（不建立 migration 歷史）
npx prisma db push

# 測試連線
npx tsx scripts/test-db-connection.ts
```

#### 生產環境
```bash
# 建立新的 migration
npx prisma migrate dev --name add_feature_name

# 部署 migration
npx prisma migrate deploy

# 生成 Prisma Client
npx prisma generate
```

### 4. 連線池最佳實踐

在 Supabase 的 Connection Pooler 使用 PgBouncer，建議配置：

```env
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1&pool_timeout=0&connect_timeout=10"
```

參數說明：
- `pgbouncer=true`: 啟用 PgBouncer 相容模式
- `connection_limit=1`: 每個 Prisma Client 實例限制 1 個連線（適合 serverless）
- `pool_timeout=0`: 不等待連線池（立即失敗，避免超時）
- `connect_timeout=10`: 連線超時設定為 10 秒

### 5. 生產環境部署檢查清單

- [ ] 使用 `prisma migrate deploy` 而非 `db push`
- [ ] 確認 `DATABASE_URL` 使用 Connection Pooler（port 6543）
- [ ] 確認 `DIRECT_URL` 使用直接連線（port 5432）
- [ ] 在 CI/CD 中執行 `prisma generate`
- [ ] 設定適當的 `connection_limit`（Vercel 建議 1-2）
- [ ] 啟用 Supabase 的 Connection Pooling（Transaction mode 或 Session mode）

### 6. Supabase 專案維護

#### Free Tier 專案暫停
Supabase Free tier 專案會在 7 天不活動後暫停。如遇到連線問題：

1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 檢查專案狀態
3. 點擊 "Restore project" 恢復專案

#### 連線數限制
- Free tier: 60 connections
- Pro tier: 200 connections
- 使用 Connection Pooler 可大幅減少直接連線數

### 7. 疑難排解

如遇到連線問題，執行診斷腳本：

```bash
npx tsx scripts/test-db-connection.ts
```

該腳本會檢查：
- 環境變數配置
- 連線字串格式
- 資料庫連線狀態
- 資料表完整性

## 常見錯誤與解決方案

### 錯誤：Connection timeout
**原因**: 使用 Connection Pooler 進行遷移操作
**解決**: 在 schema.prisma 中加入 `directUrl = env("DIRECT_URL")`

### 錯誤：Table does not exist
**原因**: 資料表尚未建立
**解決**: 執行 `npx prisma db push` 或 `npx prisma migrate deploy`

### 錯誤：@prisma/client did not initialize
**原因**: Prisma Client 未生成
**解決**: 執行 `npx prisma generate`

### 錯誤：Too many connections
**原因**: 連線數超過限制
**解決**:
1. 使用 Connection Pooler
2. 設定 `connection_limit=1`
3. 在應用程式中使用單一 Prisma Client 實例

## 有用的資源

- [Prisma 官方文檔](https://www.prisma.io/docs)
- [Supabase + Prisma 整合指南](https://supabase.com/docs/guides/integrations/prisma)
- [PgBouncer 連線池說明](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#pgbouncer)
- [Vercel 部署 Prisma 指南](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## 下一步

現在資料庫已設定完成，您可以：

1. 建立種子資料：`npm run db:seed`
2. 開始開發：`npm run dev`
3. 使用 Prisma Studio 查看資料：`npx prisma studio`
