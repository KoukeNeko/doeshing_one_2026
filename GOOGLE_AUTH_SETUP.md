# Google OAuth 設定指南 test

## 1. 建立 Google Cloud 專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 在專案中啟用「Google+ API」

## 2. 建立 OAuth 憑證

1. 前往 [憑證頁面](https://console.cloud.google.com/apis/credentials)
2. 點擊「建立憑證」→「OAuth 用戶端 ID」
3. 如果是第一次，需要先設定「OAuth 同意畫面」：
   - 選擇「外部」使用者類型
   - 填寫應用程式名稱：`Doeshing Gazette`
   - 填寫使用者支援電子郵件
   - 在「授權網域」中新增您的網域（本地開發可以跳過）
   - 儲存並繼續

4. 建立 OAuth 用戶端 ID：
   - 應用程式類型：選擇「網頁應用程式」
   - 名稱：`Doeshing Admin`
   - 已授權的 JavaScript 來源：
     - 本地開發：`http://localhost:3000`
     - 生產環境：`https://yourdomain.com`
   - 已授權的重新導向 URI：
     - 本地開發：`http://localhost:3000/api/auth/callback/google`
     - 生產環境：`https://yourdomain.com/api/auth/callback/google`
   - 點擊「建立」

5. 複製顯示的「用戶端 ID」和「用戶端密碼」

## 3. 設定環境變數

在專案根目錄的 `.env.local` 檔案中添加：

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# 管理員 Email（只有此 Email 可以存取管理後台）
ADMIN_EMAIL="your-email@gmail.com"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret"
```

### 生成 NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 4. 測試登入

1. 啟動開發伺服器：`bun dev`
2. 前往 `http://localhost:3000/admin/login`
3. 點擊「Continue with Google」
4. 使用您在 `ADMIN_EMAIL` 中設定的 Google 帳號登入
5. 授權應用程式存取您的基本資訊
6. 成功登入後會重新導向至管理後台

## 5. 部署到生產環境

### Vercel 部署

1. 在 Vercel 專案設定中新增環境變數：
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ADMIN_EMAIL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`（設為您的生產環境網址）

2. 在 Google Cloud Console 中更新 OAuth 憑證：
   - 新增生產環境的授權來源和重新導向 URI
   - 例如：`https://yourdomain.com/api/auth/callback/google`

3. 重新部署專案

## 安全注意事項

- ✅ 只有 `ADMIN_EMAIL` 中指定的 Email 可以登入管理後台
- ✅ 其他使用者會被拒絕存取
- ✅ 不要將 `.env.local` 提交到 Git
- ✅ 在生產環境使用強密碼作為 `NEXTAUTH_SECRET`
- ✅ 定期檢查 Google Cloud Console 的授權活動

## 故障排除

### 問題：「redirect_uri_mismatch」錯誤

**解決方案**：檢查 Google Cloud Console 中的重新導向 URI 是否與您的應用程式 URL 完全一致。

### 問題：登入後顯示「Access Denied」

**解決方案**：確認您使用的 Google 帳號 Email 與 `.env.local` 中的 `ADMIN_EMAIL` 完全一致。

### 問題：「Invalid client」錯誤

**解決方案**：檢查 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET` 是否正確複製。

## 移除舊的認證方式

登入流程已從 Credentials Provider 改為 Google OAuth，您可以從 `.env.local` 中移除：
- ~~`ADMIN_PASSWORD`~~（不再需要）
