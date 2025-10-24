/**
 * Remark Callout 外掛 - Markdown AST 轉換階段
 *
 * 此外掛負責識別和轉換特殊的 blockquote 語法為 callout 區塊。
 *
 * 支援的 Callout 類型：
 * - info: 資訊提示（藍色）
 * - warning: 警告訊息（黃色）
 * - success: 成功訊息（綠色）
 * - danger: 危險警告（紅色）
 *
 * Markdown 語法：
 * ```markdown
 * > [!info] 這是一個資訊提示
 * > 內容可以多行
 *
 * > [!warning] 注意事項
 * > 請小心操作
 * ```
 *
 * 轉換流程：
 * 1. 掃描所有 blockquote 節點
 * 2. 檢查第一段文字是否符合 `[!TYPE]` 格式
 * 3. 移除 `[!TYPE]` 標記
 * 4. 添加 CSS 類別和資料屬性到節點
 *
 * 輸出（HTML AST）：
 * ```html
 * <blockquote class="callout callout-info" data-callout-type="info">
 *   <p>這是一個資訊提示</p>
 * </blockquote>
 * ```
 *
 * 注意：此外掛只處理 Markdown AST，實際的 HTML 圖示由 rehype-callout.ts 添加
 */

import type { Blockquote, Root } from "mdast";
import { visit } from "unist-util-visit";

// 支援的 callout 類型常數
const CALLOUT_TYPES = ["info", "warning", "success", "danger"] as const;
type CalloutType = (typeof CALLOUT_TYPES)[number];

/**
 * Remark 外掛：將特殊語法的 blockquote 轉換為 callout 區塊
 *
 * @returns Remark 轉換函式
 *
 * 處理邏輯：
 * 1. 遍歷所有 blockquote 節點
 * 2. 檢查是否符合 callout 語法：`> [!TYPE] 內容`
 * 3. 提取 callout 類型並移除標記
 * 4. 添加 CSS 類別和資料屬性
 */
export function remarkCallout() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote, index, parent) => {
      // 確保節點有父節點和索引（用於可能的節點替換）
      if (!parent || index === undefined) return;

      // 取得 blockquote 的第一個子節點（應該是段落）
      const firstChild = node.children[0];
      if (firstChild?.type !== "paragraph") return;

      // 取得段落的第一個文字節點
      const firstTextNode = firstChild.children[0];
      if (firstTextNode?.type !== "text") return;

      // 檢查是否符合 callout 語法：[!TYPE]
      // 正則表達式：匹配 [!info]、[!warning] 等，不區分大小寫
      const match = firstTextNode.value.match(/^\[!(info|warning|success|danger)\]\s*/i);
      if (!match) return;

      // 提取 callout 類型（轉為小寫）
      const calloutType = match[1].toLowerCase() as CalloutType;

      // 從文字中移除 [!TYPE] 標記
      firstTextNode.value = firstTextNode.value.replace(match[0], "");

      // 在節點上添加資料屬性，供後續的 rehype 外掛使用
      // hProperties 會被轉換為 HTML 屬性
      node.data = {
        ...node.data,
        hProperties: {
          className: `callout callout-${calloutType}`, // CSS 類別
          "data-callout-type": calloutType,             // 資料屬性（供 JS 使用）
        },
      };
    });
  };
}
