# Archive 頁面效能問題診斷與解決方案

## 🎯 問題總結

你的 `/archive` 頁面 fetch 超過 300ms 的問題，**根源在於 Docker 容器的檔案權限配置**，導致 Next.js 快取完全失效。

## 📊 診斷數據

### ✅ 資料庫層面（無問題）
- 連線時間: 18ms
- 查詢時間: 27ms (並行)
- 索引配置: 完善
- 資料量: 3 篇文章，效能良好

### ✅ 應用層面（無問題）
- SSR 渲染: ~40ms
- 程式邏輯: 已優化
- 快取策略: `unstable_cache` 已配置

### ❌ 部署層面（問題所在）
- **TTFB: 700-1100ms** ❌
- 錯誤: `EACCES: permission denied, mkdir '/app/.next/cache'`
- 影響: 每次請求都要完整 SSR，快取無法寫入

## 🔧 已實施的修復

### 1. Dockerfile 權限修復
```dockerfile
# Create cache directories with correct permissions
RUN mkdir -p .next/cache/fetch-cache .next/cache/images \
  && chown -R nextjs:nodejs .next
```

### 2. 快取策略優化
改進 `src/lib/blog.ts` 中的 `getPublishedPosts`：
- ✅ 所有查詢都啟用快取（包含 search/tag 參數）
- ✅ 搜尋結果快取 5 分鐘，一般查詢 1 分鐘
- ✅ 使用 cache tags 支援精確的快取失效

### 3. 提供測試工具
- `scripts/rebuild-fix-cache.sh` - 重建容器
- `scripts/test-performance.sh` - 驗證效能
- `scripts/test-archive-performance.ts` - 資料庫效能測試
- `scripts/diagnose-ssr-performance.ts` - SSR 診斷

## 🚀 執行修復

### 步驟 1: 重建容器
```bash
cd /root/doeshing_one_2026
./scripts/rebuild-fix-cache.sh
```

### 步驟 2: 驗證修復
```bash
# 檢查快取目錄權限
docker exec doeshing_one_2026-app-1 ls -la .next/cache

# 檢查錯誤日誌是否消失
docker logs doeshing_one_2026-app-1 --tail 50 | grep -i "EACCES"
```

### 步驟 3: 效能測試
```bash
# 使用自動化測試腳本
./scripts/test-performance.sh

# 或手動測試
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://doeshing.one/archive
```

## 📈 預期改善

| 指標 | 修復前 | 修復後（預期）| 改善 |
|------|--------|---------------|------|
| 首次請求 TTFB | ~1000ms | ~100-200ms | 80-90% ⬇️ |
| 快取命中 TTFB | ~1000ms | ~10-50ms | 95-99% ⬇️ |
| 快取有效率 | 0% | ~80-95% | ⬆️ |
| 資料庫查詢 | 27ms | 27ms | 無變化 ✅ |

## 🎓 技術細節

### 問題的技術原因
1. **Dockerfile 使用 `USER nextjs`**，但在切換使用者前沒有創建快取目錄
2. Next.js 嘗試在運行時創建 `.next/cache`，但 `nextjs` 使用者沒有寫入權限
3. 每次快取寫入失敗，導致每個請求都要執行完整的 SSR

### 解決方案的原理
1. 在 `USER nextjs` 之前，以 `root` 身份創建快取目錄
2. 使用 `chown` 將目錄所有權轉移給 `nextjs:nodejs`
3. 確保 Next.js 運行時能正常寫入快取

### Next.js 快取機制
- **unstable_cache**: 應用層快取，存儲在檔案系統
- **revalidate**: ISR (Incremental Static Regeneration)
- **cache tags**: 支援精確的快取失效策略

## 🔍 除錯指令

```bash
# 1. 檢查容器日誌
docker logs -f doeshing_one_2026-app-1

# 2. 進入容器檢查
docker exec -it doeshing_one_2026-app-1 /bin/sh
ls -la .next/cache/

# 3. 檢查快取檔案
docker exec doeshing_one_2026-app-1 find .next/cache -type f

# 4. 即時效能監控
watch -n 1 'curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://doeshing.one/archive'

# 5. 資料庫效能測試
bun run scripts/test-archive-performance.ts
```

## 💡 後續優化建議

### 短期（立即可做）
1. ✅ 修復快取權限（已完成）
2. ✅ 優化快取策略（已完成）
3. ⏭️ 監控快取命中率
4. ⏭️ 設定效能告警

### 中期（1-2 週）
1. 考慮使用 Prisma Connection Pooler (pgBouncer)
2. 添加 Redis 快取層（如果流量增加）
3. 實施效能監控儀表板
4. 優化圖片載入（如果有大量圖片）

### 長期（1 個月+）
1. 考慮 CDN 配置
2. 評估 Edge Runtime
3. 實施漸進式載入策略
4. A/B 測試不同快取策略

## 📚 相關文件

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🆘 如果問題持續

如果重建後問題仍然存在，請檢查：

1. **容器日誌**: 是否仍有 EACCES 錯誤
2. **環境變數**: DATABASE_URL 等是否正確
3. **網路延遲**: 應用伺服器到資料庫的距離
4. **資源限制**: Docker 容器的 CPU/記憶體限制
5. **反向代理**: Nginx/Caddy 的配置

聯絡方式或開 issue 討論。

---

**更新日期**: 2025-10-13  
**狀態**: 已識別問題，解決方案已實施，待驗證
