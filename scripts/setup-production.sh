#!/bin/bash

# 設定生產環境部署

set -e

echo "=========================================="
echo "  生產環境設定腳本"
echo "=========================================="
echo ""

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 步驟 1: 檢查 .env 文件
echo "📋 步驟 1: 檢查環境變數設定"
echo "=========================================="

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ 找不到 .env 文件${NC}"
    exit 1
fi

# 檢查關鍵環境變數
NEXTAUTH_URL=$(grep "^NEXTAUTH_URL=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
SITE_URL=$(grep "^NEXT_PUBLIC_SITE_URL=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

echo "當前設定:"
echo "  NEXTAUTH_URL: $NEXTAUTH_URL"
echo "  NEXT_PUBLIC_SITE_URL: $SITE_URL"
echo ""

# 步驟 2: 詢問是否要切換到生產環境
echo "📝 步驟 2: 環境設定"
echo "=========================================="
echo ""
read -p "是否要設定為生產環境 (https://doeshing.one)? [y/N] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 設定生產環境..."
    
    # 備份當前 .env
    if [ ! -f ".env.development" ]; then
        echo "  ✓ 備份當前設定到 .env.development"
        cp .env .env.development
    fi
    
    # 更新 NEXTAUTH_URL 和 NEXT_PUBLIC_SITE_URL
    sed -i 's|^NEXTAUTH_URL=.*|NEXTAUTH_URL="https://doeshing.one"|g' .env
    sed -i 's|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL="https://doeshing.one"|g' .env
    
    echo -e "  ${GREEN}✓ 已更新為生產環境設定${NC}"
else
    echo "保持當前環境設定"
fi

echo ""

# 步驟 3: 修改頁面為動態渲染
echo "🔧 步驟 3: 設定動態渲染"
echo "=========================================="

# 首頁
HOME_PAGE="src/app/(site)/page.tsx"
if [ -f "$HOME_PAGE" ]; then
    if ! grep -q "export const dynamic" "$HOME_PAGE"; then
        echo "  ✓ 設定首頁為動態渲染..."
        # 在 import 之後添加動態渲染設定
        sed -i '/^import/a\\n// Force dynamic rendering to avoid build-time database connection\nexport const dynamic = '\''force-dynamic'\'';' "$HOME_PAGE"
    else
        echo "  ✓ 首頁已經設定為動態渲染"
    fi
fi

# 管理後台首頁
ADMIN_PAGE="src/app/admin/(dashboard)/page.tsx"
if [ -f "$ADMIN_PAGE" ]; then
    if ! grep -q "export const dynamic" "$ADMIN_PAGE"; then
        echo "  ✓ 設定管理後台為動態渲染..."
        sed -i '/^import/a\\n// Force dynamic rendering\nexport const dynamic = '\''force-dynamic'\'';' "$ADMIN_PAGE"
    else
        echo "  ✓ 管理後台已經設定為動態渲染"
    fi
fi

# Archive 頁面
ARCHIVE_PAGE="src/app/(site)/archive/page.tsx"
if [ -f "$ARCHIVE_PAGE" ]; then
    if ! grep -q "export const dynamic" "$ARCHIVE_PAGE"; then
        echo "  ✓ 設定 Archive 頁面為動態渲染..."
        sed -i '/^import/a\\n// Force dynamic rendering\nexport const dynamic = '\''force-dynamic'\'';' "$ARCHIVE_PAGE"
    else
        echo "  ✓ Archive 頁面已經設定為動態渲染"
    fi
fi

echo ""

# 步驟 4: Google OAuth 檢查清單
echo "🔐 步驟 4: Google OAuth 設定檢查"
echo "=========================================="
echo ""
echo "請確認以下設定已完成："
echo ""
echo "1. 前往 Google Cloud Console:"
echo "   https://console.cloud.google.com/apis/credentials"
echo ""
echo "2. 編輯 OAuth 2.0 用戶端 ID"
echo ""
echo "3. 確認「已授權的 JavaScript 來源」包含:"
echo "   ✓ https://doeshing.one"
echo ""
echo "4. 確認「已授權的重新導向 URI」包含:"
echo "   ✓ https://doeshing.one/api/auth/callback/google"
echo ""
read -p "按 Enter 繼續..."
echo ""

# 步驟 5: 部署選項
echo "🚀 步驟 5: 選擇部署方式"
echo "=========================================="
echo ""
echo "1) 重新建置並啟動生產環境"
echo "2) 僅啟動生產環境（使用現有映像）"
echo "3) 跳過，稍後手動部署"
echo ""
read -p "請選擇 [1-3]: " deploy_option

case $deploy_option in
    1)
        echo ""
        echo "🔨 重新建置生產環境..."
        echo "=========================================="
        
        # 停止所有容器
        echo "  ✓ 停止現有容器..."
        docker compose --profile dev down 2>/dev/null || true
        docker compose --profile prod down 2>/dev/null || true
        
        # 重新建置
        echo "  ✓ 重新建置 Docker 映像（這可能需要幾分鐘）..."
        docker compose --profile prod build --no-cache
        
        # 啟動
        echo "  ✓ 啟動生產環境..."
        docker compose --profile prod up -d
        
        echo ""
        echo -e "${GREEN}✅ 生產環境已啟動！${NC}"
        echo ""
        echo "📊 容器狀態："
        docker compose --profile prod ps
        echo ""
        echo "📋 查看日誌: docker compose --profile prod logs -f"
        ;;
    2)
        echo ""
        echo "🚀 啟動生產環境..."
        
        # 停止開發環境
        docker compose --profile dev down 2>/dev/null || true
        
        # 啟動生產環境
        docker compose --profile prod up -d
        
        echo ""
        echo -e "${GREEN}✅ 生產環境已啟動！${NC}"
        echo ""
        docker compose --profile prod ps
        ;;
    3)
        echo ""
        echo "跳過部署"
        ;;
    *)
        echo ""
        echo "無效的選項"
        ;;
esac

echo ""
echo "=========================================="
echo "  設定完成！"
echo "=========================================="
echo ""

# 最終提示
FINAL_NEXTAUTH_URL=$(grep "^NEXTAUTH_URL=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [[ $FINAL_NEXTAUTH_URL == *"https://doeshing.one"* ]]; then
    echo -e "${GREEN}✅ 生產環境設定完成${NC}"
    echo ""
    echo "🌐 請訪問: https://doeshing.one"
    echo "🔐 登入頁面: https://doeshing.one/admin/login"
    echo ""
    echo "⚠️  重要提醒:"
    echo "1. 確認 DNS 已指向正確的伺服器"
    echo "2. 確認 SSL 證書已設定（Nginx/Cloudflare）"
    echo "3. 確認 Google OAuth 已添加生產環境 URL"
else
    echo -e "${YELLOW}⚠️  當前仍為開發環境設定${NC}"
    echo ""
    echo "🌐 訪問: http://localhost:3000"
fi

echo ""
echo "📚 更多資訊請參考: PRODUCTION_DEPLOYMENT.md"
echo ""
