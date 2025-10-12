# 作者設定指南

## 單作者系統

此專案設計為單作者部落格系統，所有文章都會自動關聯到您的帳號。

## 設定步驟

### 1. 設定環境變數

在 `.env.local` 檔案中添加：

```bash
# 管理員 Email（用於 Google 登入）
ADMIN_EMAIL="your-email@gmail.com"

# 作者名稱（顯示在文章中）
AUTHOR_NAME="Your Name"
```

### 2. 初始化作者資料

有三種方式可以在資料庫中創建作者：

#### 選項 A：使用初始化腳本（推薦）

```bash
bun run author:init
```

這個腳本會：
- ✅ 檢查作者是否已存在
- ✅ 如果不存在則自動創建
- ✅ 如果已存在則更新名稱
- ✅ 顯示作者資訊和文章統計

#### 選項 B：執行完整的資料庫 seed

```bash
bun run db:seed
```

⚠️ 注意：這會清空並重新建立所有資料（包括測試文章）

#### 選項 C：自動創建（首次發文時）

如果您忘記初始化，系統會在您第一次發布文章時自動創建作者記錄。

### 3. 驗證設定

運行初始化腳本後，您應該會看到類似的輸出：

```
🔍 Checking for author: your-email@gmail.com
✅ Author created: Your Name (your-email@gmail.com)

📊 Summary:
   Name: Your Name
   Email: your-email@gmail.com
   Posts: 0

✨ Done!
```

## 工作原理

### 作者匹配邏輯

當您發布文章時，系統會依照以下順序尋找作者：

1. **優先**：查找與您的 Google 登入 Email 完全匹配的作者
2. **備用**：使用資料庫中第一個創建的作者
3. **自動創建**：如果都找不到，使用您的 Google 帳號資訊自動創建

### 未來擴展

雖然目前是單作者系統，但程式碼已預留多作者的擴展空間：

```typescript
// 未來可以根據 session.user.email 匹配不同的作者
let author = await prisma.author.findFirst({
  where: { email: session.user?.email },
});
```

## 常見問題

### Q: 為什麼需要 ADMIN_EMAIL 和 AUTHOR_NAME？

- **ADMIN_EMAIL**：用於 Google OAuth 登入驗證，只有此 Email 可以訪問管理後台
- **AUTHOR_NAME**：顯示在文章中的作者名稱，可以是您的筆名或真名

### Q: 我可以使用不同的 Email 和作者名稱嗎？

可以！例如：
```bash
ADMIN_EMAIL="john.doe@gmail.com"      # 用於登入
AUTHOR_NAME="John the Blogger"        # 顯示在文章中
```

### Q: 如果我更改了 AUTHOR_NAME 怎麼辦？

再次運行初始化腳本即可更新：
```bash
bun run author:init
```

### Q: 我可以有多個作者嗎？

目前系統設計為單作者，但資料庫結構支援多作者。如果未來需要，可以：
1. 在資料庫中手動添加其他作者記錄
2. 修改 API 邏輯根據不同的登入用戶選擇對應的作者

## 故障排除

### 問題：發文時顯示 "No author found"

**解決方案**：
1. 確認 `.env.local` 中已設定 `ADMIN_EMAIL`
2. 運行 `bun run author:init`
3. 檢查資料庫連線是否正常

### 問題：作者名稱顯示錯誤

**解決方案**：
1. 更新 `.env.local` 中的 `AUTHOR_NAME`
2. 運行 `bun run author:init` 更新資料庫
3. 重新整理頁面

### 問題：想要重新設定作者

**解決方案**：
```bash
# 方法 1：使用初始化腳本（保留現有文章）
bun run author:init

# 方法 2：完整重置（會刪除所有資料）
bun run db:seed
```

## 資料庫結構

```prisma
model Author {
  id        String   @id @default(cuid())
  name      String   // 從 AUTHOR_NAME
  email     String   @unique // 從 ADMIN_EMAIL
  bio       String?
  avatar    String?
  posts     Post[]
  user      User?    @relation(fields: [userId], references: [id])
  userId    String?  @unique
}
```

## 相關檔案

- 📄 `scripts/init-author.ts` - 作者初始化腳本
- 📄 `prisma/seed.ts` - 完整資料庫 seed（包含測試資料）
- 📄 `src/app/api/blog/route.ts` - 文章發布 API（包含自動創建邏輯）
- 📄 `src/lib/auth.ts` - Google OAuth 設定
