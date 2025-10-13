# ⚡️ 效能問題最終診斷報告

## 🎯 問題根源

經過完整診斷，**問題不在應用程式或資料庫，而在 CDN 和快取策略配置**。

## 📊 效能測試結果

### ✅ 應用程式本身效能優秀
```bash
# 直接連接 localhost:3000
TTFB: 9.8ms  ⚡️ 超快！
```

### ❌ 透過 Cloudflare CDN 效能差
```bash
# 透過 https://doeshing.one
TTFB: 700-1000ms 🐌 很慢
```

### 🔍 關鍵證據
```
HTTP 標頭：
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
cf-cache-status: DYNAMIC
```

## 🚨 問題分析

### 1. Cloudflare 不快取 (cf-cache-status: DYNAMIC)
- **原因**: `cache-control: no-cache, no-store` 告訴 CDN 不要快取
- **影響**: 每個請求都要回源到你的伺服器
- **結果**: 網路延遲 + TLS 握手 ≈ 700-1000ms

### 2. Cache-Control 標頭設定過於保守
```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
```
這是**最保守的快取設定**，完全禁用所有快取。

### 3. 網路延遲分析
從 curl 詳細輸出：
```
DNS 查詢:     31ms
TCP 連線:    200ms
TLS 握手:    443ms
開始傳輸:  1,153ms  ← 這裡是瓶頸
```

## 🔧 解決方案

### 方案 1: 修改 Next.js Cache-Control (推薦)

在 `next.config.ts` 中添加：

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  
  // 添加這個配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/archive',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
  
  // ... 其他設定
};
```

**說明**:
- `public`: 允許 CDN 快取
- `max-age=60`: 瀏覽器快取 60 秒
- `s-maxage=300`: CDN 快取 5 分鐘
- `stale-while-revalidate=600`: 背景更新機制

### 方案 2: 在 Cloudflare 設定 Page Rules

1. 登入 Cloudflare Dashboard
2. 選擇你的網域 `doeshing.one`
3. 進入 **Rules** > **Page Rules**
4. 創建新規則：
   - **URL**: `*doeshing.one/archive*`
   - **設定**: 
     - Cache Level: Standard
     - Edge Cache TTL: 5 minutes
     - Browser Cache TTL: 1 minute
5. 儲存並部署

### 方案 3: 使用 Cloudflare Workers (進階)

創建一個 Worker 來覆寫 Cache-Control：

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)
  
  // 針對 /archive 頁面修改快取標頭
  if (new URL(request.url).pathname.startsWith('/archive')) {
    newResponse.headers.set(
      'Cache-Control',
      'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
    )
  }
  
  return newResponse
}
```

## 🎯 立即行動方案

### 最快的修復 (5分鐘)

修改 `next.config.ts`:

```typescript
// next.config.ts
import createMDX from "@next/mdx";
import type { NextConfig } from "next";
// ... imports

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  
  // ✨ 添加快取標頭
  async headers() {
    return [
      {
        source: '/archive/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    // ... 現有的 redirects
  },
};

export default withMDX(nextConfig);
```

然後重新部署：
```bash
docker compose --profile prod down
docker compose --profile prod build
docker compose --profile prod up -d
```

## 📈 預期改善

### 修復前
- 首次訪問: 1000ms
- 再次訪問: 1000ms (無快取)
- CDN: 不快取

### 修復後
- 首次訪問: ~200ms (CDN 緩存)
- 再次訪問: ~50ms (CDN 命中)
- CDN: 快取 5 分鐘

**效能提升: 95% ⬇️**

## 🧪 驗證步驟

1. **部署後測試**
```bash
# 第一次請求
curl -I https://doeshing.one/archive | grep -i "cache\|cf-cache"

# 第二次請求（應該看到 HIT）
curl -I https://doeshing.one/archive | grep -i "cf-cache-status"
```

2. **檢查 TTFB**
```bash
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://doeshing.one/archive
```

預期結果：
- 第一次: `cf-cache-status: MISS` + TTFB ~200ms
- 第二次: `cf-cache-status: HIT` + TTFB ~50ms

## 💡 額外優化建議

### 1. 靜態資源 CDN 快取
確保 `_next/static/*` 有長期快取：
```typescript
{
  source: '/_next/static/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

### 2. 圖片優化
使用 Next.js Image Optimization API 配合 CDN

### 3. 考慮使用 ISG (Incremental Static Generation)
將 `/archive` 改為靜態生成：
```typescript
// src/app/(site)/archive/page.tsx
export const dynamic = 'force-static';
export const revalidate = 300; // 5 分鐘
```

## 📚 相關資源

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Cloudflare Cache Rules](https://developers.cloudflare.com/cache/)
- [HTTP Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)

## ✅ 總結

**真正的問題**:
- ❌ 不是程式邏輯
- ❌ 不是 Supabase/資料庫  
- ❌ 不是 Docker 權限（已修復）
- ✅ **是 CDN 快取配置**

**解決方案**:
修改 `next.config.ts` 添加適當的 Cache-Control 標頭，讓 Cloudflare CDN 快取內容。

**預期效果**:
從 1000ms 降到 50-200ms，**效能提升 80-95%** 🚀

---

**更新日期**: 2025-10-13  
**狀態**: 已找到根本原因，待實施 CDN 快取策略
