# Sitemap 問題修復報告

## 🔍 根本原因

錯誤日誌顯示：
```
Error: ENOENT: no such file or directory, scandir '/var/task/content/work'
```

**問題**：在 Vercel 的生產環境中，使用 `output: "standalone"` 模式時，Next.js 沒有自動將 `content` 目錄複製到構建輸出中。

## ✅ 已完成的修復

### 1. 添加錯誤處理 (`src/app/sitemap.ts`)
為 sitemap 生成添加了完整的 try-catch 錯誤處理，確保即使部分內容載入失敗，sitemap 仍能生成。

### 2. 修復 MDX 函數 (`src/lib/mdx.ts`)
```typescript
export async function getProjectSlugs() {
  try {
    // 檢查目錄是否存在
    await fs.access(PROJECTS_DIR);
    const files = await fs.readdir(PROJECTS_DIR);
    return files
      .filter((file) => /\.mdx?$/.test(file))
      .map((file) => file.replace(/\.mdx?$/, ""));
  } catch (error) {
    console.error(`Error reading projects directory ${PROJECTS_DIR}:`, error);
    return [];
  }
}
```

### 3. 配置 Next.js 輸出追蹤 (`next.config.ts`)
添加 `outputFileTracingIncludes` 確保 content 目錄被包含在 standalone 構建中：
```typescript
outputFileTracingIncludes: {
  "/": ["./content/**/*"],
  "/sitemap.xml": ["./content/**/*"],
  "/archive/[slug]": ["./content/blog/**/*"],
  "/work/[slug]": ["./content/work/**/*"],
}
```

### 4. 創建 Vercel 配置 (`vercel.json`)
確保 Vercel 使用正確的構建設置。

## Google Search Console 下一步

### 選項 1：請求重新檢索
1. 前往 Google Search Console
2. 點擊 "Sitemaps" 頁面
3. 刪除舊的 sitemap
4. 重新提交 `https://doeshing.one/sitemap.xml`

### 選項 2：驗證 Sitemap
使用以下工具測試：
```bash
# 檢查 HTTP 狀態
curl -I https://doeshing.one/sitemap.xml

# 檢查內容
curl https://doeshing.one/sitemap.xml

# 驗證 XML 格式
curl https://doeshing.one/sitemap.xml | xmllint --format -
```

### 選項 3：使用 Google 的 URL 檢查工具
1. 在 Search Console 中選擇 "URL Inspection"
2. 輸入 `https://doeshing.one/sitemap.xml`
3. 點擊 "Test Live URL"
4. 查看 Google 是否能正確抓取

## 監控建議

### 添加 Sitemap 監控
考慮在部署流程中添加 sitemap 驗證：

```bash
# 在 CI/CD 中添加
curl -f https://doeshing.one/sitemap.xml > /dev/null || exit 1
```

### 查看部署日誌
檢查 Vercel 的部署日誌，查找是否有 sitemap 相關錯誤：
```
https://vercel.com/[your-project]/deployments
```

## 技術改進

### 當前配置
- ✅ `dynamic = "force-static"` - sitemap 在 build 時生成
- ✅ 錯誤處理完整
- ✅ 使用正確的 NEXT_PUBLIC_SITE_URL 環境變數
- ✅ 包含所有重要頁面（archive、work、about 等）

### 未來可能的改進
1. **分頁 Sitemap**：如果網站超過 50,000 個 URL
2. **Sitemap Index**：將不同類型的內容分成不同的 sitemap
3. **更精確的 lastModified**：使用 git commit 時間

## 驗證清單
- [x] Sitemap 在本地環境正常運作
- [x] Sitemap 在生產環境返回 200
- [x] Sitemap XML 格式正確
- [x] 包含所有重要頁面
- [ ] Google Search Console 重新檢索成功
- [ ] 0 個發現的頁面 -> 增加

## 下次遇到類似問題時

### 診斷步驟
1. 檢查本地：`curl http://localhost:3000/sitemap.xml`
2. 檢查生產：`curl https://doeshing.one/sitemap.xml`
3. 檢查狀態碼：`curl -I https://doeshing.one/sitemap.xml`
4. 查看 Vercel 日誌
5. 使用 Google Search Console 的 URL 檢查工具

### 常見原因
- 環境變數未設置
- 內容載入超時
- 文件權限問題
- CDN 緩存問題
- Build 時的暫時性錯誤
