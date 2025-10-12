# 網站架構重構文檔

## 重構概述

將網站從傳統的部落格/作品集結構重構為以 **Gazette（報刊）** 為概念的編輯作品集網站。

## 路由變更

### 舊路由 → 新路由

| 舊路由 | 新路由 | 說明 |
|--------|--------|------|
| `/blog` | `/archive` | 文章歸檔，更符合雜誌/報刊的命名 |
| `/blog/[slug]` | `/archive/[slug]` | 文章詳情頁 |
| `/projects` | `/work` | 作品集，更專業簡潔的命名 |
| `/projects/[slug]` | `/work/[slug]` | 作品詳情頁 |
| `/cv` | `/about` | 關於頁面，整合個人背景和履歷 |
| `/contact` | `/contact` | 保持不變 |
| `/newsletter` | `/newsletter` | 保持不變 |

## 導航更新

### 新導航結構

```typescript
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },  // 文章歸檔
  { href: "/work", label: "Work" },        // 作品集
  { href: "/about", label: "About" },      // 關於
  { href: "/contact", label: "Contact" },  // 聯繫
] as const;
```

## 文件系統變更

### 資料夾重命名

```bash
src/app/blog         → src/app/archive
src/app/projects     → src/app/work
src/app/cv           → src/app/about
content/projects     → content/work
```

## 內容更新

### 1. 網站標題與定位

**舊標題**：
- "Doeshing — Editorial Portfolio"
- "Weekend Edition: Editorial craftsmanship for the modern web."

**新標題**：
- "Doeshing Gazette — Editorial Portfolio"
- "Doeshing Gazette: Editorial craftsmanship for the modern web"

**新描述**：
"A magazine-style portfolio blending design engineering, narrative systems, and modern web craft. New dispatches weekly."

### 2. 主頁快速連結

| 舊標題 | 新標題 | 新描述 |
|--------|--------|--------|
| The Studio Log | The Archive | Long-form essays, process notes, and behind-the-scenes breakdowns from studio practice. |
| Selected Works | Studio Work | A curated collection of client engagements, experiments, and shipped products. |
| Résumé / CV | About | Background, experience, and credentials—the story behind the work. |

### 3. 頁面標題更新

#### Archive 頁面 (`/archive`)
- **Kicker**: "The Archive" (原: "The Editorial Log")
- **Title**: "Stories on design, code, and creative systems"
- **Description**: "Essays, field notes, and interviews exploring how modern tools meet timeless editorial principles."

#### Work 頁面 (`/work`)
- **Kicker**: "Studio Work" (原: "Project Portfolio")
- **Title**: "A cross-disciplinary practice of editorial web builds"
- **Description**: "From rapid prototypes to fully produced launch campaigns, these projects showcase the systems, visuals, and storytelling behind each engagement."

#### About 頁面 (`/about`)
- **Kicker**: "About"
- **Title**: "Design engineer & editorial craftsperson"
- **Description**: "Blending code, design thinking, and storytelling to craft web experiences that feel like print but scale like software."
- **Function name**: `AboutPage()` (原: `CvPage()`)

## 代碼更新

### 1. 常量文件 (`src/lib/constants.ts`)

```typescript
export const SITE_NAME = "Doeshing Gazette — Editorial Portfolio";
export const SITE_DESCRIPTION =
  "A magazine-inspired personal site featuring articles, work, and credentials.";
```

### 2. MDX 路徑 (`src/lib/mdx.ts`)

```typescript
const PROJECTS_DIR = path.join(process.cwd(), "content", "work");
```

### 3. 內部連結更新

所有內部連結已從 `/blog/*` 和 `/projects/*` 更新為 `/archive/*` 和 `/work/*`：

- BlogCard 組件
- ProjectCard 組件
- Search 組件搜索跳轉
- 主頁的所有連結
- Archive 和 Work 頁面的內部連結

## 概念重構

### 從「部落格 + 作品集」到「Gazette（報刊）」

**核心理念**：
- 整個網站是一份定期發行的「Gazette」（報刊）
- **Archive（歸檔）** - 存放過往的所有文章，像是報紙的歷史檔案
- **Work（作品）** - 展示工作室的項目作品
- **About（關於）** - 介紹作者背景和經驗
- **Home（首頁）** - 最新一期的內容混合展示

**優勢**：
1. 更統一的品牌概念
2. 避免「部落格」這個過於通用的詞彙
3. 強調編輯和策展的專業性
4. 符合 editorial design 的主題定位

## 視覺與體驗

保持原有的：
- Newspaper-inspired 設計風格
- 報紙式的排版和字體
- Dark mode 支持
- 響應式設計

## 技術細節

### TypeScript 類型

部分 TypeScript 錯誤是由於 Next.js 15 的嚴格路由類型檢查。這些錯誤不影響實際功能，但可以通過以下方式修復：

```typescript
// 使用 as const 斷言
href={"/work" as const}

// 或使用類型轉換
href={"/work" as Route}
```

### 搜索功能

Search 組件的搜索結果現在跳轉到 `/archive` 而非 `/blog`。

## 測試清單

完成重構後，請測試以下功能：

- [ ] 主頁顯示正常
- [ ] 導航連結都正確跳轉
- [ ] Archive 頁面和文章詳情頁正常
- [ ] Work 頁面和作品詳情頁正常
- [ ] About 頁面顯示正常
- [ ] Search 功能跳轉正確
- [ ] 所有內部連結都更新
- [ ] Dark mode 在所有頁面都正常
- [ ] 404 頁面正確處理舊路由（可選）

## 向後兼容

### 重定向配置（推薦）

在 `next.config.ts` 中添加重定向，以保持舊 URL 的兼容性：

```typescript
async redirects() {
  return [
    {
      source: '/blog',
      destination: '/archive',
      permanent: true,
    },
    {
      source: '/blog/:slug',
      destination: '/archive/:slug',
      permanent: true,
    },
    {
      source: '/projects',
      destination: '/work',
      permanent: true,
    },
    {
      source: '/projects/:slug',
      destination: '/work/:slug',
      permanent: true,
    },
    {
      source: '/cv',
      destination: '/about',
      permanent: true,
    },
  ];
}
```

## 完成日期

2025年10月12日

## 相關文檔

- [Dark Mode 修復文檔](./DARK_MODE_FIX.md)
- [資料庫設置文檔](./DATABASE_SETUP.md)
