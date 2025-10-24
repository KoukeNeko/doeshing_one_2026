/**
 * Rehype Callout 外掛 - HTML AST 增強階段
 *
 * 此外掛負責為 callout 區塊添加視覺元素（圖示）和結構化 HTML。
 *
 * 處理流程：
 * 1. 接收 remark-callout 處理過的 HTML AST
 * 2. 找到所有標記為 callout 的 blockquote 元素
 * 3. 根據 callout 類型插入對應的 SVG 圖示
 * 4. 將內容包裹在結構化的容器中
 *
 * 輸入（來自 remark-callout）：
 * ```html
 * <blockquote class="callout callout-info">
 *   <p>這是一個資訊提示</p>
 * </blockquote>
 * ```
 *
 * 輸出：
 * ```html
 * <blockquote class="callout callout-info">
 *   <span class="callout-icon" aria-hidden="true">
 *     <svg>...</svg>
 *   </span>
 *   <div class="callout-content">
 *     <p>這是一個資訊提示</p>
 *   </div>
 * </blockquote>
 * ```
 *
 * 圖示來源：Lucide Icons（簡化版 Feather Icons）
 * 樣式：在 tailwind.config.ts 的 typography 外掛中定義
 */

import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Callout 圖示對應表
 * 每個 callout 類型對應一個 SVG 圖示（Lucide Icons）
 *
 * - info: 資訊圖示（圓圈加驚嘆號）
 * - warning: 警告圖示（三角形加驚嘆號）
 * - success: 成功圖示（圓圈加勾選記號）
 * - danger: 危險圖示（圓圈加叉叉）
 */
const CALLOUT_ICONS = {
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  danger: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>`,
};

/**
 * Rehype 外掛：為 callout 區塊添加圖示和結構化 HTML
 *
 * @returns Rehype 轉換函式
 *
 * 處理邏輯：
 * 1. 遍歷所有 HTML 元素
 * 2. 找到標記為 callout 的 blockquote
 * 3. 提取 callout 類型
 * 4. 插入對應的 SVG 圖示
 * 5. 將原始內容包裹在容器中
 */
export function rehypeCallout() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      // 只處理 blockquote 元素
      if (node.tagName !== "blockquote") return;

      const props = node.properties;
      if (!props?.className) return;

      // 將 className 統一為陣列格式（可能是字串或陣列）
      const classNames = Array.isArray(props.className)
        ? props.className
        : [props.className];

      // 檢查是否有 'callout' 類別
      if (!classNames.includes("callout")) return;

      // 找出 callout 類型類別（例如："callout-info"）
      const calloutClass = classNames.find((c) =>
        String(c).startsWith("callout-"),
      );
      if (!calloutClass) return;

      // 提取類型名稱（移除 "callout-" 前綴）
      const calloutType = String(calloutClass).replace(
        "callout-",
        "",
      ) as keyof typeof CALLOUT_ICONS;

      // 取得對應的圖示 SVG
      const icon = CALLOUT_ICONS[calloutType];
      if (!icon) return;

      // 建立圖示元素
      // 使用 type: "raw" 來插入原始 HTML（SVG）
      const iconElement: Element = {
        type: "element",
        tagName: "span",
        properties: {
          className: ["callout-icon"],
          "aria-hidden": "true",  // 對螢幕閱讀器隱藏（純裝飾性）
        },
        children: [
          {
            type: "raw",          // 允許插入原始 HTML
            value: icon,          // SVG 字串
          } as any,
        ],
      };

      // 將原始內容包裹在容器中
      const contentWrapper: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["callout-content"],
        },
        children: [...node.children],  // 保留原始內容
      };

      // 替換節點的子元素：圖示 + 內容容器
      node.children = [iconElement, contentWrapper];
    });
  };
}
