#!/bin/bash

# 開發環境啟動腳本
# Usage: ./scripts/dev.sh [up|down|logs|restart|shell]

set -e

COMPOSE_FILE="docker-compose.yml"
PROFILE="dev"
SERVICE="web"

case "${1:-up}" in
  up)
    echo "🚀 啟動開發環境..."
    docker compose --profile $PROFILE up
    ;;
  
  up-d)
    echo "🚀 在背景啟動開發環境..."
    docker compose --profile $PROFILE up -d
    echo "✅ 開發環境已在背景啟動"
    echo "📝 查看日誌: ./scripts/dev.sh logs"
    ;;
  
  down)
    echo "🛑 停止開發環境..."
    docker compose --profile $PROFILE down
    echo "✅ 開發環境已停止"
    ;;
  
  logs)
    echo "📋 查看開發環境日誌 (Ctrl+C 退出)..."
    docker compose logs -f $SERVICE
    ;;
  
  restart)
    echo "🔄 重啟開發環境..."
    docker compose --profile $PROFILE down
    docker compose --profile $PROFILE up -d
    echo "✅ 開發環境已重啟"
    ;;
  
  shell)
    echo "🐚 進入容器 shell..."
    docker compose exec $SERVICE sh
    ;;
  
  prisma)
    echo "🔧 執行 Prisma 指令: ${2:-help}"
    docker compose exec $SERVICE npx prisma ${2:-help}
    ;;
  
  clean)
    echo "🧹 清理容器和 volumes..."
    docker compose --profile $PROFILE down -v
    echo "✅ 已清理"
    ;;
  
  *)
    echo "Usage: $0 {up|up-d|down|logs|restart|shell|prisma|clean}"
    echo ""
    echo "指令說明:"
    echo "  up       - 啟動開發環境（前景）"
    echo "  up-d     - 啟動開發環境（背景）"
    echo "  down     - 停止開發環境"
    echo "  logs     - 查看日誌"
    echo "  restart  - 重啟開發環境"
    echo "  shell    - 進入容器 shell"
    echo "  prisma   - 執行 Prisma 指令（例如：./scripts/dev.sh prisma migrate dev）"
    echo "  clean    - 清理容器和 volumes"
    exit 1
    ;;
esac
