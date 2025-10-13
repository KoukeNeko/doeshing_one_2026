#!/bin/bash
# 完整的效能驗證測試腳本

echo "🧪 /archive 頁面效能驗證"
echo "================================"
echo ""

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 檢查 curl 是否可用
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl 未安裝${NC}"
    exit 1
fi

URL="https://doeshing.one/archive"

echo "1️⃣ 測試基本頁面載入"
echo "---"

# 測試 5 次並計算平均值
declare -a ttfb_times
for i in {1..5}; do
    ttfb=$(curl -o /dev/null -s -w "%{time_starttransfer}" "$URL")
    ttfb_ms=$(echo "$ttfb * 1000" | bc)
    ttfb_times+=($ttfb_ms)
    echo "第 $i 次: ${ttfb_ms%.*}ms"
    sleep 1
done

# 計算平均值
sum=0
for time in "${ttfb_times[@]}"; do
    sum=$(echo "$sum + $time" | bc)
done
avg=$(echo "scale=2; $sum / ${#ttfb_times[@]}" | bc)
echo ""
echo "平均 TTFB: ${avg%.*}ms"

# 評估結果
if (( $(echo "$avg < 100" | bc -l) )); then
    echo -e "${GREEN}✅ 效能優秀！${NC}"
elif (( $(echo "$avg < 200" | bc -l) )); then
    echo -e "${GREEN}✅ 效能良好${NC}"
elif (( $(echo "$avg < 500" | bc -l) )); then
    echo -e "${YELLOW}⚠️  效能可接受，但有改善空間${NC}"
else
    echo -e "${RED}❌ 效能不佳，需要優化${NC}"
fi

echo ""
echo "2️⃣ 測試帶參數的請求"
echo "---"

# 測試不同的查詢參數
declare -A test_cases=(
    ["基本"]="$URL"
    ["標籤篩選"]="$URL?tag=design"
    ["排序"]="$URL?sort=views"
    ["分頁"]="$URL?page=2"
    ["搜尋"]="$URL?search=design"
)

for name in "${!test_cases[@]}"; do
    test_url="${test_cases[$name]}"
    ttfb=$(curl -o /dev/null -s -w "%{time_starttransfer}" "$test_url")
    ttfb_ms=$(echo "$ttfb * 1000" | bc)
    printf "%-15s: %6.0fms\n" "$name" "$ttfb_ms"
done

echo ""
echo "3️⃣ 測試快取效果 (連續請求)"
echo "---"

# 連續快速請求，檢查快取
declare -a cache_test_times
for i in {1..3}; do
    ttfb=$(curl -o /dev/null -s -w "%{time_starttransfer}" "$URL")
    ttfb_ms=$(echo "$ttfb * 1000" | bc)
    cache_test_times+=($ttfb_ms)
    echo "請求 $i: ${ttfb_ms%.*}ms"
done

# 檢查是否有改善
first=${cache_test_times[0]%.*}
last=${cache_test_times[2]%.*}
improvement=$(echo "scale=2; (($first - $last) / $first) * 100" | bc)

echo ""
if (( $(echo "$improvement > 20" | bc -l) )); then
    echo -e "${GREEN}✅ 快取運作正常 (改善 ${improvement%.*}%)${NC}"
elif (( $(echo "$improvement > 0" | bc -l) )); then
    echo -e "${YELLOW}⚠️  快取略有作用 (改善 ${improvement%.*}%)${NC}"
else
    echo -e "${RED}❌ 快取可能未生效${NC}"
fi

echo ""
echo "4️⃣ 詳細時間分析"
echo "---"

curl -o /dev/null -s -w "\
DNS 查詢:        %{time_namelookup}s\n\
TCP 連線:        %{time_connect}s\n\
TLS 握手:        %{time_appconnect}s\n\
開始傳輸:        %{time_starttransfer}s\n\
總時間:          %{time_total}s\n\
下載速度:        %{speed_download} bytes/s\n\
" "$URL"

echo ""
echo "5️⃣ HTTP 標頭檢查"
echo "---"

# 檢查快取相關標頭
cache_headers=$(curl -s -I "$URL" | grep -i -E "cache-control|etag|x-vercel-cache|x-nextjs-cache")
if [ -n "$cache_headers" ]; then
    echo "$cache_headers"
else
    echo "無快取相關標頭"
fi

echo ""
echo "================================"
echo "✅ 測試完成"
echo ""
echo "📊 建議基準:"
echo "  優秀:    TTFB < 100ms"
echo "  良好:    TTFB < 200ms"
echo "  可接受:  TTFB < 500ms"
echo "  需優化:  TTFB > 500ms"
