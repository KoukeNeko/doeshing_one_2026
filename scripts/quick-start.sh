#!/bin/bash

# 快速啟動正式環境的腳本
# Usage: ./scripts/quick-start.sh

set -e
# Disable BuildKit to avoid transient /proc/stat transport issues during build.
export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0
echo "移除現有容器（如果有的話）..."
docker compose --profile prod down

echo "🔨 重新建立 Docker 映像檔（包含最新的程式碼變更）..."
docker compose --profile prod build

echo "🚀 啟動正式環境容器..."
docker compose --profile prod up -d

echo ""
echo "✅ 容器已啟動！"
echo ""
echo "📊 容器狀態："
docker compose ps

echo ""
echo "🌐 應用程式應該執行在: http://localhost:3000"
echo ""
echo "📋 查看日誌: ./scripts/prod.sh logs"
echo "🛑 停止容器: ./scripts/prod.sh down"
