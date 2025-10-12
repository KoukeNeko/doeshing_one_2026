# Dark Mode 修復文檔

## 問題概述

Dark Mode 切換功能無法正常工作，且在以下頁面的部分組件在 Dark Mode 下仍顯示為亮色模式：
- `/projects`
- `/cv`
- `/contact`
- 以及其他頁面的多個組件

## 修復內容

### 1. Tailwind 配置更新 (`tailwind.config.ts`)

添加了 `prose-invert` 樣式以支持 dark mode 下的 typography：

```typescript
typography: {
  DEFAULT: {
    // ... 原有配置
  },
  invert: {
    css: {
      color: theme("colors.zinc.100"),
      a: {
        color: theme("colors.red.400"),
        "&:hover": {
          color: theme("colors.red.300"),
        },
      },
      h1: { color: theme("colors.zinc.50") },
      h2: { color: theme("colors.zinc.50") },
      h3: { color: theme("colors.zinc.50") },
      // ... 更多 dark mode 樣式
    },
  },
}
```

### 2. 全局樣式更新 (`src/styles/globals.css`)

添加了 dark mode 的全局樣式：

```css
.dark body {
  @apply bg-zinc-900 text-zinc-100;
}

.dark ::selection {
  @apply bg-red-400 text-zinc-900;
}

/* 更新所有組件的 dark mode 樣式 */
a:hover {
  @apply text-newspaper-accent dark:text-red-400;
}

.dropcap:first-letter {
  @apply ... dark:text-red-400;
}

.prose img {
  @apply ... dark:border-white/5;
}

.prose figcaption {
  @apply ... dark:text-zinc-400;
}

.sr-only-focusable:focus {
  @apply ... dark:bg-zinc-100 dark:text-zinc-900 dark:focus:ring-red-400;
}
```

### 3. UI 組件更新

#### Card 組件 (`src/components/ui/Card.tsx`)
- 添加了 `dark:border-white/10`、`dark:bg-zinc-900`、`dark:shadow-white/5` 等樣式

#### Badge 組件 (`src/components/ui/Badge.tsx`)
- 所有變體都已包含 dark mode 樣式

#### Button 組件 (`src/components/ui/Button.tsx`)
- 所有變體都已包含 dark mode 樣式

#### Pagination 組件 (`src/components/ui/Pagination.tsx`)
- 添加了 dark mode 樣式到導航元素

#### Search 組件 (`src/components/ui/Search.tsx`)
- 添加了對話框和輸入框的 dark mode 樣式
- 更新了按鈕和背景的 dark mode 樣式

#### SectionHeading 組件 (`src/components/ui/SectionHeading.tsx`)
- 已包含完整的 dark mode 樣式

### 4. Layout 組件更新

#### Header (`src/components/layout/Header.tsx`)
- 已包含完整的 dark mode 樣式

#### Footer (`src/components/layout/Footer.tsx`)
- 已包含完整的 dark mode 樣式

#### Navigation (`src/components/layout/Navigation.tsx`)
- 已包含完整的 dark mode 樣式

### 5. Blog 相關組件更新

#### BlogCard (`src/components/blog/BlogCard.tsx`)
- 已包含完整的 dark mode 樣式

#### TagFilter (`src/components/blog/TagFilter.tsx`)
- 添加了 dark mode 樣式

#### TableOfContents (`src/components/blog/TableOfContents.tsx`)
- 添加了 dark mode 樣式

#### ShareButtons (`src/components/blog/ShareButtons.tsx`)
- 添加了 dark mode 樣式

### 6. Projects 相關組件更新

#### ProjectCard (`src/components/projects/ProjectCard.tsx`)
- 已包含完整的 dark mode 樣式

### 7. 頁面更新

#### 主頁 (`src/app/page.tsx`)
- 已包含完整的 dark mode 樣式

#### CV 頁 (`src/app/cv/page.tsx`)
- 添加了完整的 dark mode 樣式到所有部分
- 包括頭像、技能卡片、經驗時間軸、教育和獎項部分

#### Contact 頁 (`src/app/contact/page.tsx`)
- 已包含完整的 dark mode 樣式

#### Newsletter 頁 (`src/app/newsletter/page.tsx`)
- 添加了表單和輸入框的 dark mode 樣式

#### Projects 頁 (`src/app/projects/page.tsx`)
- 已包含完整的 dark mode 樣式

#### Projects 詳情頁 (`src/app/projects/[slug]/page.tsx`)
- 添加了完整的 dark mode 樣式
- 包括 header、內容區域和側邊欄

#### Blog 頁 (`src/app/blog/page.tsx`)
- 已包含完整的 dark mode 樣式

#### Blog 詳情頁 (`src/app/blog/[slug]/page.tsx`)
- 添加了完整的 dark mode 樣式
- 包括 header、文章內容、相關文章和導航

## Dark Mode 配色方案

### Light Mode
- 背景：`#fafafa` (newspaper-paper)
- 文字：`#1a1a1a` (newspaper-ink)
- 強調色：`#dc2626` (newspaper-accent)
- 灰色：`#6b7280` (newspaper-gray)

### Dark Mode
- 背景：`zinc-900` (#18181b)
- 文字：`zinc-100` (#f4f4f5)
- 強調色：`red-400` (#f87171)
- 灰色：`zinc-400` (#a1a1aa)

## ThemeProvider 配置

在 `src/app/layout.tsx` 中的配置：

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
```

這個配置確保：
1. 使用 `class` 屬性來應用 dark mode
2. 默認跟隨系統主題
3. 啟用系統主題檢測
4. 切換時不顯示過渡動畫

## 測試建議

請訪問以下頁面並測試 Dark Mode 切換：

1. **主頁** (`/`): 檢查 hero section、快速連結和所有卡片
2. **Blog** (`/blog`): 檢查搜索框、篩選器、文章列表
3. **Blog 詳情** (`/blog/[slug]`): 檢查文章內容、目錄、分享按鈕
4. **Projects** (`/projects`): 檢查標籤篩選、項目卡片
5. **Projects 詳情** (`/projects/[slug]`): 檢查項目內容和側邊欄
6. **CV** (`/cv`): 檢查所有部分（技能、經驗、教育、獎項）
7. **Contact** (`/contact`): 檢查表單和社交連結
8. **Newsletter** (`/newsletter`): 檢查表單輸入框

## 已知問題

### TypeScript 類型錯誤
有一些 TypeScript 類型錯誤與 `authorId` 屬性缺失有關。這些不影響 Dark Mode 功能，但需要在 `src/types/content.ts` 中修復類型定義。

### CSS 警告
全局 CSS 文件中的 `@tailwind` 和 `@apply` 指令會顯示 "Unknown at rule" 警告。這是正常的，因為編輯器不識別 Tailwind 指令，但不影響實際功能。

## 完成日期

2025年10月12日
