#!/bin/bash

# 環境切換腳本 - 在開發環境和生產環境之間快速切換

set -e

echo "=========================================="
echo "  環境切換工具"
echo "=========================================="
echo ""

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 檢查當前環境
CURRENT_NEXTAUTH_URL=$(grep "^NEXTAUTH_URL=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [[ $CURRENT_NEXTAUTH_URL == *"localhost"* ]]; then
    CURRENT_ENV="開發環境 (Development)"
    SWITCH_TO="生產環境 (Production)"
    NEW_NEXTAUTH_URL="https://doeshing.one"
    NEW_SITE_URL="https://doeshing.one"
else
    CURRENT_ENV="生產環境 (Production)"
    SWITCH_TO="開發環境 (Development)"
    NEW_NEXTAUTH_URL="http://localhost:3000"
    NEW_SITE_URL="http://localhost:3000"
fi

echo "當前環境: $CURRENT_ENV"
echo "NEXTAUTH_URL: $CURRENT_NEXTAUTH_URL"
echo ""

read -p "是否要切換到 $SWITCH_TO? [y/N] " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "取消切換"
    exit 0
fi

echo ""
echo "🔧 切換環境中..."

# 備份當前設定
BACKUP_FILE=".env.backup.$(date +%Y%m%d_%H%M%S)"
cp .env "$BACKUP_FILE"
echo "  ✓ 已備份當前設定到 $BACKUP_FILE"

# 更新環境變數
sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"$NEW_NEXTAUTH_URL\"|g" .env
sed -i "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=\"$NEW_SITE_URL\"|g" .env

echo "  ✓ 已更新環境變數"
echo ""

# 詢問是否重啟容器
read -p "是否要重啟容器以套用新設定? [y/N] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 重啟容器..."
    
    # 停止所有容器
    docker compose --profile dev down 2>/dev/null || true
    docker compose --profile prod down 2>/dev/null || true
    
    # 根據新環境啟動對應容器
    if [[ $NEW_NEXTAUTH_URL == *"localhost"* ]]; then
        echo "  ✓ 啟動開發環境..."
        docker compose --profile dev up -d
        
        sleep 5
        echo ""
        echo -e "${GREEN}✅ 已切換到開發環境！${NC}"
        echo ""
        echo "🌐 訪問: http://localhost:3000"
    else
        echo "  ✓ 啟動生產環境..."
        docker compose --profile prod up -d
        
        sleep 5
        echo ""
        echo -e "${GREEN}✅ 已切換到生產環境！${NC}"
        echo ""
        echo "🌐 訪問: https://doeshing.one"
        echo ""
        echo -e "${YELLOW}⚠️  記得確認：${NC}"
        echo "  1. DNS 指向正確"
        echo "  2. SSL 證書已設定"
        echo "  3. Google OAuth 包含生產環境 URL"
    fi
    
    echo ""
    echo "📊 容器狀態："
    docker compose ps
    
else
    echo ""
    echo -e "${GREEN}✅ 環境變數已更新！${NC}"
    echo ""
    echo "⚠️  請手動重啟容器以套用新設定："
    if [[ $NEW_NEXTAUTH_URL == *"localhost"* ]]; then
        echo "  docker compose --profile dev restart"
    else
        echo "  docker compose --profile prod restart"
    fi
fi

echo ""
