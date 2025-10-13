#!/bin/bash
# 重建並重啟 Docker 容器（修復快取權限問題）

set -e

echo "🔧 修復 Next.js 快取權限問題"
echo "================================"
echo ""

# 停止現有容器
echo "1️⃣ 停止現有容器..."
docker compose --profile prod down

# 重建映像
echo ""
echo "2️⃣ 重建 Docker 映像..."
docker compose --profile prod build --no-cache

# 啟動新容器
echo ""
echo "3️⃣ 啟動新容器..."
docker compose --profile prod up -d

# 等待容器啟動
echo ""
echo "4️⃣ 等待容器啟動..."
sleep 5

# 檢查容器狀態
echo ""
echo "5️⃣ 檢查容器狀態..."
docker compose --profile prod ps

# 檢查快取目錄權限
echo ""
echo "6️⃣ 檢查快取目錄權限..."
CONTAINER_ID=$(docker compose --profile prod ps -q app)
if [ -n "$CONTAINER_ID" ]; then
  docker exec $CONTAINER_ID ls -la .next/ 2>/dev/null || echo "⚠️  無法檢查快取目錄"
fi

# 檢查日誌
echo ""
echo "7️⃣ 檢查最近的日誌..."
docker compose --profile prod logs --tail 20

echo ""
echo "✅ 重建完成！"
echo ""
echo "📊 測試效能："
echo "請執行: curl -o /dev/null -s -w \"TTFB: %{time_starttransfer}s\\n\" https://doeshing.one/archive"
