---
# ============================================
# 專案 Frontmatter 欄位說明
# ============================================
# 此檔案展示所有可用的專案 frontmatter 欄位
# 檔名開頭使用 _ 表示這是範例檔案，不會在網站上顯示

# --------------------------------------------
# 必填欄位 (Required Fields)
# --------------------------------------------

title: "Example Project - Complete Field Guide"
# 專案標題
# - 會顯示在專案卡片、專案頁面頂部
# - 建議長度：10-60 字元
# - 支援 Markdown（但不建議使用）

description: "This is a comprehensive example showing all available frontmatter fields for projects. Use this as a reference when creating new project documentation."
# 專案簡介
# - 會顯示在專案卡片下方
# - 建議長度：100-200 字元
# - 用於 SEO meta description
# - 應該清楚說明專案的核心價值

tags: ["Example", "Documentation", "Reference", "TypeScript", "React"]
# 專案技術標籤
# - 必須是陣列格式 (使用方括號)
# - 會顯示為標籤徽章
# - 建議數量：3-8 個
# - 常用標籤：TypeScript, JavaScript, React, Next.js, Node.js, Python, Go, Java, etc.

date: "2025-01"
# 專案完成日期或發布日期
# - 格式：YYYY-MM 或 YYYY-MM-DD
# - 用於專案列表的排序（越新越前面）
# - 顯示在專案頁面頂部

# --------------------------------------------
# 選填欄位 (Optional Fields)
# --------------------------------------------

image: "/images/projects/example-project.png"
# 專案封面圖片
# - 路徑相對於 public/ 目錄
# - 建議尺寸：1200x630px (OpenGraph 標準)
# - 支援格式：.png, .jpg, .webp, .svg
# - 如果省略，會使用預設佔位圖

github: "https://github.com/yourusername/example-project"
# GitHub 倉庫連結
# - 完整 URL (包含 https://)
# - 會在專案頁面顯示 GitHub 圖示按鈕
# - 如果是私有專案可以省略

demo: "https://example-project.vercel.app"
# 線上展示連結
# - 完整 URL (包含 https://)
# - 可以是：
#   - 部署的網站 (Vercel, Netlify, etc.)
#   - 產品頁面 (Modrinth, npm, etc.)
#   - 影片展示 (YouTube, Vimeo)
#   - 文件網站
# - 會在專案頁面顯示外部連結圖示按鈕

featured: true
# 是否為精選專案
# - 值：true 或 false (預設為 false)
# - 功能：
#   - Work 頁面：featured 專案會以 2 欄大卡片優先顯示
#   - 首頁：featured 專案會優先出現
# - 注意：
#   - Work 頁面只顯示前 1 個 featured 專案在大卡片區
#   - 超過數量的 featured 專案會降級到一般區塊
#   - 順序取決於檔案排序或 date 欄位
# - 建議：最多設定 2-3 個專案為 featured

status: "completed"
# 專案狀態
# - 可用值：
#   - "completed"    - 已完成 (會顯示綠色標籤)
#   - "in-progress"  - 進行中 (會顯示藍色標籤)
#   - "archived"     - 已封存 (會顯示灰色標籤)
# - 顯示位置：專案卡片、專案頁面頂部
# - Work 頁面可以依狀態過濾專案
# - 如果省略，預設為 completed

# --------------------------------------------
# 未來可能新增的欄位 (Future Fields)
# --------------------------------------------
# 以下欄位目前尚未實作，但程式碼可能支援：

# featuredOrder: 1
# 精選專案排序
# - 數字越小越優先 (1 > 2 > 3)
# - 僅對 featured: true 的專案有效
# - 目前專案系統尚未實作此功能（但部落格文章有）

# category: "Web Development"
# 專案分類
# - 目前尚未實作分類系統
# - 可能的分類：Web, Mobile, Desktop, Library, Plugin, etc.

# collaborators: ["Alice", "Bob"]
# 協作者列表
# - 目前尚未實作

# client: "Company Name"
# 客戶或委託方
# - 適用於接案專案

# duration: "3 months"
# 專案開發時長
# - 例如："2 weeks", "3 months", "1 year"

# technologies:
#   frontend: ["React", "TypeScript"]
#   backend: ["Node.js", "PostgreSQL"]
#   devops: ["Docker", "GitHub Actions"]
# 詳細技術棧分類
# - 目前用 tags 欄位替代

---

## 專案內容範例

這裡是專案的主要內容區域，使用 Markdown 格式撰寫。

### 支援的 Markdown 功能

#### 基本語法

- **粗體文字**
- *斜體文字*
- ~~刪除線~~
- `行內程式碼`
- [連結](https://example.com)

#### 程式碼區塊

```typescript
// 支援語法高亮
interface Project {
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

const exampleProject: Project = {
  title: "My Awesome Project",
  description: "A project that does amazing things",
  tags: ["TypeScript", "React"],
  featured: true,
};
```

#### Callout 區塊

> [!NOTE]
> 這是一個提示區塊，用於顯示重要資訊。

> [!WARNING]
> 這是一個警告區塊，用於提醒注意事項。

> [!TIP]
> 這是一個技巧區塊，用於分享有用的建議。

#### 表格

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| title | string | ✅ | 專案標題 |
| description | string | ✅ | 專案簡介 |
| tags | string[] | ✅ | 技術標籤 |
| featured | boolean | ❌ | 是否精選 |

#### 圖片

![專案截圖範例](/images/projects/example-screenshot.png)

#### 清單

1. 有序清單項目 1
2. 有序清單項目 2
   - 巢狀無序清單
   - 另一個項目

### 建議的專案結構

一個完整的專案文件通常包含以下章節：

1. **Project Overview** - 專案概述
2. **Motivation** / **Why I Built This** - 建立動機
3. **Technical Architecture** / **How It Works** - 技術架構
4. **Core Features** / **What It Does** - 核心功能
5. **Implementation Highlights** / **Technical Details** - 實作細節
6. **Testing** - 測試方法
7. **Installation** / **Deployment** - 安裝部署
8. **Reception** / **Community Impact** - 社群反應
9. **What I Learned** - 學習心得
10. **Conclusion** / **Wrapping Up** - 結論

### 撰寫風格建議

- 使用第一人稱（"I built this" 而不是 "This was built"）
- 分享真實經驗和挑戰
- 解釋技術決策的原因
- 包含程式碼範例和架構圖
- 展示實際成果（下載數、使用者回饋等）
- 保持真實和謙遜的語氣

---

**注意**：此檔案僅供參考，檔名開頭的 `_` 表示不會在網站上顯示。
