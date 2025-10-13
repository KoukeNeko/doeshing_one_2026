#!/bin/bash

# 快速啟動正式環境的腳本
# Usage: ./scripts/quick-start.sh

set -e

echo "🚀 啟動正式環境容器..."
docker compose --profile prod up -d

echo ""
echo "✅ 容器已啟動！"
echo ""
echo "📊 容器狀態："
docker compose ps

echo ""
echo "🌐 應用程式應該運行在: http://localhost:3000"
echo ""
echo "📋 查看日誌: ./scripts/prod.sh logs"
echo "🛑 停止容器: ./scripts/prod.sh down"
