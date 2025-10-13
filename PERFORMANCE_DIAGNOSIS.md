# /archive 頁面效能診斷報告

## 🔍 問題診斷結果

### 問題根源
✅ **已找到！** Docker 容器內的 Next.js 快取目錄 (`/app/.next/cache`) 沒有寫入權限，導致快取完全失效。

### 效能測試數據

#### 1. 資料庫查詢效能 ✅
- **連線時間**: 18ms
- **並行查詢** (posts + tags): 27ms
- **查詢結果**: 快速且穩定

#### 2. SSR 渲染效能 ✅
- **本地測試**: ~40ms
- **資料庫索引**: 7 個索引正常運作
- **查詢優化**: 已使用 `listPostSelect` 減少欄位

#### 3. 實際部署效能 ❌
- **TTFB (Time To First Byte)**: 700ms - 1100ms
- **原因**: 快取無法寫入，每次都要重新渲染

#### 4. 錯誤日誌
```
Failed to update prerender cache for ... [Error: EACCES: permission denied, mkdir '/app/.next/cache']
errno: -13,
code: 'EACCES',
syscall: 'mkdir',
path: '/app/.next/cache'
```

---

## 🔧 解決方案

### 已實施的修復
在 `Dockerfile` 中添加：
```dockerfile
# Create cache directories with correct permissions
RUN mkdir -p .next/cache/fetch-cache .next/cache/images \
  && chown -R nextjs:nodejs .next
```

### 重建步驟
```bash
# 使用提供的腳本
./scripts/rebuild-fix-cache.sh

# 或手動執行
docker compose --profile prod down
docker compose --profile prod build --no-cache
docker compose --profile prod up -d
```

---

## 📊 預期改善

### 修復前
- 無快取: 每次請求 ~1000ms
- 快取失效率: 100%

### 修復後 (預期)
- 首次請求: ~100-200ms
- 快取命中: ~10-50ms
- 快取有效期: 60 秒

---

## 💡 額外優化建議

### 1. 啟用 Prisma Connection Pooler
當前 DATABASE_URL 直連資料庫，建議使用 pgBouncer：

```env
# 添加 pgbouncer 參數
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=10"
```

### 2. 優化快取策略
針對有參數的請求也啟用快取：

```typescript
// src/lib/blog.ts
export async function getPublishedPosts({
  search,
  tag,
  sort = "latest",
  page = 1,
  perPage = 9,
}: BlogFilters = {}) {
  // 為所有查詢建立快取（包含 search/tag）
  const cacheKey = `posts-${sort}-${page}-${perPage}-${tag || 'all'}-${search || 'none'}`;
  
  return unstable_cache(fetchPosts, [cacheKey], {
    revalidate: search ? 300 : 60, // 搜尋結果快取 5 分鐘
    tags: ["posts", tag ? `tag-${tag}` : null].filter(Boolean),
  })();
}
```

### 3. 考慮使用 Redis 快取
對於高流量場景，可以使用 Redis：

```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

export async function getPublishedPosts(filters: BlogFilters) {
  const cacheKey = `posts:${JSON.stringify(filters)}`;
  
  // 嘗試從 Redis 取得
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // 執行查詢
  const result = await fetchPosts(filters);
  
  // 存入 Redis (60 秒)
  await redis.setex(cacheKey, 60, JSON.stringify(result));
  
  return result;
}
```

### 4. 使用 Edge Runtime (選配)
如果部署在 Vercel 或支援 Edge 的平台：

```typescript
// src/app/(site)/archive/page.tsx
export const runtime = 'edge'; // 使用 Edge Runtime
export const revalidate = 60;
```

### 5. 監控快取效能
添加快取命中率監控：

```typescript
// 在生產環境記錄快取效能
if (process.env.NODE_ENV === 'production') {
  console.log('[Cache]', {
    key: cacheKey,
    hit: fromCache,
    duration: Date.now() - start,
  });
}
```

---

## 🧪 驗證步驟

重建後執行以下測試：

### 1. 檢查快取目錄權限
```bash
docker exec doeshing_one_2026-app-1 ls -la .next/cache
```

### 2. 測試 TTFB
```bash
# 首次請求 (cold start)
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://doeshing.one/archive

# 第二次請求 (應該有快取)
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://doeshing.one/archive
```

### 3. 檢查日誌
```bash
docker logs doeshing_one_2026-app-1 --tail 50 | grep -i "cache\|error"
```

### 4. 壓力測試
```bash
# 使用 ab 或 wrk 進行壓力測試
ab -n 100 -c 10 https://doeshing.one/archive
```

---

## 📈 效能基準

### 目標指標
- TTFB: < 200ms (首次), < 50ms (快取)
- 資料庫查詢: < 50ms
- SSR 渲染: < 100ms
- 快取命中率: > 80%

### 可接受範圍
- TTFB: 200-500ms
- 資料庫查詢: 50-100ms
- SSR 渲染: 100-200ms

### 需要優化
- TTFB: > 500ms ❌ (當前狀況)
- 資料庫查詢: > 100ms
- SSR 渲染: > 200ms

---

## 🎯 總結

**問題根源**: Docker 容器檔案權限問題導致 Next.js 快取失效

**解決方案**: 修改 Dockerfile，在切換到 `nextjs` 使用者前創建並設定快取目錄權限

**預期效果**: TTFB 從 ~1000ms 降低到 ~50ms (快取命中時)

**建議動作**:
1. ✅ 立即重建 Docker 容器 (使用 `rebuild-fix-cache.sh`)
2. ⏭️ 驗證快取是否正常運作
3. 🔄 考慮實施額外優化建議
