/**
 * 通用工具函式模組
 *
 * 提供常用的輔助函式：
 * - 樣式類別合併
 * - 日期格式化
 * - 閱讀時間計算
 */

import { type ClassValue, clsx } from "clsx";
import { format, isValid, parseISO } from "date-fns";
import readingTime from "reading-time";
import { twMerge } from "tailwind-merge";

/**
 * 合併 Tailwind CSS 類別名稱
 *
 * @param inputs - 可變數量的類別值（字串、物件、陣列）
 * @returns 合併並去重後的類別字串
 *
 * 功能：
 * - 使用 clsx 處理條件類別
 * - 使用 tailwind-merge 智慧合併衝突的 Tailwind 類別
 *
 * 範例：
 * ```typescript
 * cn("px-2 py-1", "px-4") // "py-1 px-4" (px-4 覆蓋 px-2)
 * cn("text-red-500", condition && "text-blue-500") // 依條件決定顏色
 * ```
 *
 * 為什麼需要 tailwind-merge？
 * - Tailwind 類別衝突時，後者應該覆蓋前者
 * - 例如：`cn("p-2", "p-4")` 應該輸出 "p-4" 而不是 "p-2 p-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期為指定格式
 *
 * @param date - 日期字串或 Date 物件
 * @param pattern - 日期格式模式（date-fns 格式）
 * @returns 格式化後的日期字串，無效日期返回空字串
 *
 * 預設格式："MMM d, yyyy" (例如："Jan 15, 2024")
 *
 * 常用格式：
 * - "MMM d, yyyy" → "Jan 15, 2024"
 * - "yyyy-MM-dd" → "2024-01-15"
 * - "MMMM d, yyyy" → "January 15, 2024"
 *
 * 注意：使用 parseISO 解析 ISO 8601 日期字串
 */
export function formatDate(date: string | Date, pattern = "MMM d, yyyy") {
  const target =
    typeof date === "string" ? parseISO(date) : new Date(date.valueOf());
  if (!isValid(target)) return "";
  return format(target, pattern);
}

/**
 * 格式化日期為完整格式（報紙風格）
 *
 * @param date - 日期字串或 Date 物件
 * @returns 格式化後的完整日期字串（例如："Monday, January 15, 2024"）
 *
 * 用於：文章頁面、專案頁面的日期顯示
 */
export function formatFullDate(date: string | Date) {
  return formatDate(date, "EEEE, MMMM d, yyyy");
}

/**
 * 計算文章的預估閱讀時間
 *
 * @param text - 文章內容（Markdown 或純文字）
 * @returns 閱讀時間字串（例如："5 min read"）
 *
 * 使用 reading-time 套件計算：
 * - 預設閱讀速度：每分鐘 200 字（英文）
 * - 自動偵測語言
 * - 返回人類可讀的文字
 */
export function getReadingTime(text: string) {
  return readingTime(text).text;
}

/**
 * 取得報紙風格的日期行（dateline）
 *
 * @param date - 日期物件（預設為當前日期）
 * @returns 完整的日期字串（例如："Monday, January 15, 2024"）
 *
 * 用於：網站標頭的日期顯示，模擬傳統報紙的日期行
 */
export function getNewspaperDateline(date = new Date()) {
  return format(date, "EEEE, MMMM d, yyyy");
}
