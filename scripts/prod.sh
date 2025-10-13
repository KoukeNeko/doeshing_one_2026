#!/bin/bash

# 正式環境啟動腳本
# Usage: ./scripts/prod.sh [build|up|down|logs|restart|shell]

set -e

COMPOSE_FILE="docker-compose.yml"
PROFILE="prod"
SERVICE="app"

case "${1:-up}" in
  build)
    echo "🔨 構建正式環境映像..."
    docker compose build app
    echo "✅ 映像構建完成"
    ;;
  
  up)
    echo "🚀 啟動正式環境..."
    docker compose --profile $PROFILE up
    ;;
  
  up-d)
    echo "🚀 在背景啟動正式環境..."
    docker compose --profile $PROFILE up -d
    echo "✅ 正式環境已在背景啟動"
    echo "📝 查看日誌: ./scripts/prod.sh logs"
    ;;
  
  deploy)
    echo "🚀 部署正式環境（構建 + 啟動）..."
    docker compose build app
    docker compose --profile $PROFILE up -d
    echo "✅ 正式環境部署完成"
    echo "📝 查看日誌: ./scripts/prod.sh logs"
    ;;
  
  down)
    echo "🛑 停止正式環境..."
    docker compose --profile $PROFILE down
    echo "✅ 正式環境已停止"
    ;;
  
  logs)
    echo "📋 查看正式環境日誌 (Ctrl+C 退出)..."
    docker compose logs -f $SERVICE
    ;;
  
  restart)
    echo "🔄 重啟正式環境..."
    docker compose --profile $PROFILE down
    docker compose --profile $PROFILE up -d
    echo "✅ 正式環境已重啟"
    ;;
  
  shell)
    echo "🐚 進入容器 shell..."
    docker compose exec $SERVICE sh
    ;;
  
  migrate)
    echo "🔧 執行資料庫 migration..."
    docker compose exec $SERVICE npx prisma migrate deploy
    echo "✅ Migration 完成"
    ;;
  
  prisma)
    echo "🔧 執行 Prisma 指令: ${2:-help}"
    docker compose exec $SERVICE npx prisma ${2:-help}
    ;;
  
  clean)
    echo "🧹 清理容器和映像..."
    docker compose --profile $PROFILE down
    docker rmi doeshing-one:latest 2>/dev/null || true
    echo "✅ 已清理"
    ;;
  
  *)
    echo "Usage: $0 {build|up|up-d|deploy|down|logs|restart|shell|migrate|prisma|clean}"
    echo ""
    echo "指令說明:"
    echo "  build    - 構建正式環境映像"
    echo "  up       - 啟動正式環境（前景）"
    echo "  up-d     - 啟動正式環境（背景）"
    echo "  deploy   - 完整部署（構建 + 啟動）"
    echo "  down     - 停止正式環境"
    echo "  logs     - 查看日誌"
    echo "  restart  - 重啟正式環境"
    echo "  shell    - 進入容器 shell"
    echo "  migrate  - 執行資料庫 migration"
    echo "  prisma   - 執行 Prisma 指令（例如：./scripts/prod.sh prisma studio）"
    echo "  clean    - 清理容器和映像"
    exit 1
    ;;
esac
