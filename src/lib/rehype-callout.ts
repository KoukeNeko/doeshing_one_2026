import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

const CALLOUT_ICONS = {
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  danger: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>`,
};

/**
 * Rehype plugin to enhance callout blockquotes with icons
 */
export function rehypeCallout() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "blockquote") return;

      const props = node.properties;
      if (!props?.className) return;

      const classNames = Array.isArray(props.className)
        ? props.className
        : [props.className];

      const calloutClass = classNames.find((c) =>
        String(c).startsWith("callout-"),
      );
      if (!calloutClass) return;

      const calloutType = String(calloutClass).replace(
        "callout-",
        "",
      ) as keyof typeof CALLOUT_ICONS;
      const icon = CALLOUT_ICONS[calloutType];
      if (!icon) return;

      // Create icon element
      const iconElement: Element = {
        type: "element",
        tagName: "span",
        properties: {
          className: ["callout-icon"],
          "aria-hidden": "true",
        },
        children: [
          {
            type: "raw",
            value: icon,
          } as any,
        ],
      };

      // Wrap content in a div
      const contentWrapper: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["callout-content"],
        },
        children: node.children,
      };

      // Replace node children with icon + content wrapper
      node.children = [iconElement, contentWrapper];
    });
  };
}
