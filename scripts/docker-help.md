# Docker 環境管理腳本使用指南

## 🚀 快速開始

### 開發環境 (Development)

```bash
# 給予執行權限（首次使用）
chmod +x scripts/dev.sh

# 啟動開發環境（前景模式，會顯示日誌）
./scripts/dev.sh up

# 啟動開發環境（背景模式）
./scripts/dev.sh up-d

# 查看日誌
./scripts/dev.sh logs

# 停止開發環境
./scripts/dev.sh down

# 重啟開發環境
./scripts/dev.sh restart
```

### 正式環境 (Production)

```bash
# 給予執行權限（首次使用）
chmod +x scripts/prod.sh

# 完整部署（構建映像 + 啟動）
./scripts/prod.sh deploy

# 只構建映像
./scripts/prod.sh build

# 啟動正式環境（背景模式）
./scripts/prod.sh up-d

# 查看日誌
./scripts/prod.sh logs

# 停止正式環境
./scripts/prod.sh down
```

---

## 📋 詳細指令說明

### 開發環境指令 (`./scripts/dev.sh`)

| 指令 | 說明 |
|------|------|
| `up` | 啟動開發環境（前景，顯示即時日誌） |
| `up-d` | 啟動開發環境（背景執行） |
| `down` | 停止並移除容器 |
| `logs` | 查看即時日誌（Ctrl+C 退出） |
| `restart` | 重啟開發環境 |
| `shell` | 進入容器的 shell |
| `prisma <cmd>` | 執行 Prisma 指令 |
| `clean` | 清理容器和 volumes |

### 正式環境指令 (`./scripts/prod.sh`)

| 指令 | 說明 |
|------|------|
| `build` | 構建 Docker 映像 |
| `up` | 啟動正式環境（前景） |
| `up-d` | 啟動正式環境（背景） |
| `deploy` | 完整部署（構建 + 啟動） |
| `down` | 停止並移除容器 |
| `logs` | 查看即時日誌 |
| `restart` | 重啟正式環境 |
| `shell` | 進入容器的 shell |
| `migrate` | 執行資料庫 migration（只部署） |
| `prisma <cmd>` | 執行 Prisma 指令 |
| `clean` | 清理容器和映像 |

---

## 🔧 Prisma 相關操作

### 開發環境

```bash
# 建立新的 migration
./scripts/dev.sh prisma migrate dev --name add_user_table

# 查看資料庫（會開啟瀏覽器）
./scripts/dev.sh prisma studio

# 重新生成 Prisma Client
./scripts/dev.sh prisma generate

# 重置資料庫（會清空所有資料！）
./scripts/dev.sh prisma migrate reset
```

### 正式環境

```bash
# 部署 migrations（不會建立新的 migration）
./scripts/prod.sh migrate

# 或使用完整指令
./scripts/prod.sh prisma migrate deploy

# 查看 Prisma Studio
./scripts/prod.sh prisma studio
```

---

## 🐛 常見問題與解決方案

### 1. OpenSSL 錯誤

**錯誤訊息：** `libssl.so.1.1: cannot open shared object file`

**解決方案：**

```bash
# 重新構建並啟動
./scripts/prod.sh clean
./scripts/prod.sh deploy
```

### 1-1. TypeScript 找不到模組錯誤

**錯誤訊息：** `Cannot find module 'typescript'`

**原因：** 構建階段需要 devDependencies（如 TypeScript）

**解決方案：** 已在 Dockerfile 中修復，使用 `npm ci --include=dev`

```bash
# 重新構建
./scripts/prod.sh build
```

### 2. Port 已被佔用
**錯誤訊息：** `port is already allocated`

**解決方案：**
```bash
# 查看佔用 port 的程序
lsof -i :3000

# 停止舊的容器
docker ps -a
docker stop <container_id>

# 或清理所有停止的容器
docker container prune
```

### 3. 資料庫連接失敗

**錯誤訊息：** `Environment variable not found: DATABASE_URL`

**原因：** Next.js 在構建時嘗試預渲染頁面，需要連接資料庫

**解決方案：** 

1. 確保 `.env` 檔案包含所有必要的環境變數
2. Docker Compose 會自動將 `.env` 中的變數傳遞給構建過程

**檢查步驟：**

```bash
# 1. 確認 .env 檔案存在且包含正確的 DATABASE_URL
cat .env | grep DATABASE_URL

# 2. 確認所有必要的環境變數都存在
cat .env | grep -E "DATABASE_URL|DIRECT_URL|NEXTAUTH_URL|NEXTAUTH_SECRET"

# 3. 重新構建
./scripts/prod.sh clean
./scripts/prod.sh deploy
```

### 4. node_modules 權限問題
**解決方案：**
```bash
# 清理並重新建立
./scripts/dev.sh clean
./scripts/dev.sh up-d
```

---

## 🎯 最佳實踐

### 開發流程
1. **首次啟動：**
   ```bash
   chmod +x scripts/dev.sh scripts/prod.sh
   ./scripts/dev.sh up-d
   ./scripts/dev.sh prisma migrate dev
   ```

2. **日常開發：**
   ```bash
   ./scripts/dev.sh up-d    # 啟動
   ./scripts/dev.sh logs    # 查看日誌
   ```

3. **修改 Prisma Schema 後：**
   ```bash
   ./scripts/dev.sh prisma migrate dev --name <migration_name>
   ```

### 部署流程
1. **測試構建：**
   ```bash
   ./scripts/prod.sh build
   ```

2. **部署到正式環境：**
   ```bash
   ./scripts/prod.sh deploy
   ./scripts/prod.sh migrate
   ./scripts/prod.sh logs
   ```

3. **更新正式環境：**
   ```bash
   ./scripts/prod.sh down
   ./scripts/prod.sh deploy
   ./scripts/prod.sh migrate
   ```

---

## 📊 監控與維護

### 查看容器狀態
```bash
# 查看所有容器
docker ps -a

# 查看映像
docker images

# 查看資源使用情況
docker stats
```

### 清理系統
```bash
# 清理未使用的映像
docker image prune

# 清理未使用的 volumes
docker volume prune

# 完整清理（小心使用！）
docker system prune -a
```

---

## 🔐 環境變數

確保 `.env` 檔案包含以下必要變數：

```env
# 資料庫
DATABASE_URL="postgresql://user:password@host:5432/dbname"
DIRECT_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth (如果使用)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

## 📞 需要幫助？

如果遇到問題：
1. 查看日誌：`./scripts/dev.sh logs` 或 `./scripts/prod.sh logs`
2. 進入容器檢查：`./scripts/dev.sh shell` 或 `./scripts/prod.sh shell`
3. 完全重置：清理並重新啟動
