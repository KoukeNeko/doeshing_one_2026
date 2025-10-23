import type { Blockquote, Root } from "mdast";
import { visit } from "unist-util-visit";

const CALLOUT_TYPES = ["info", "warning", "success", "danger"] as const;
type CalloutType = (typeof CALLOUT_TYPES)[number];

/**
 * Remark plugin to transform blockquotes with special syntax into callouts
 * Syntax: > [!TYPE] content
 * Example: > [!warning] This is a warning message
 */
export function remarkCallout() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote, index, parent) => {
      if (!parent || index === undefined) return;

      // Get the first paragraph in the blockquote
      const firstChild = node.children[0];
      if (firstChild?.type !== "paragraph") return;

      const firstTextNode = firstChild.children[0];
      if (firstTextNode?.type !== "text") return;

      // Check if it matches the callout syntax: [!TYPE]
      const match = firstTextNode.value.match(/^\[!(info|warning|success|danger)\]\s*/i);
      if (!match) return;

      const calloutType = match[1].toLowerCase() as CalloutType;
      
      // Remove the [!TYPE] marker from the text
      firstTextNode.value = firstTextNode.value.replace(match[0], "");

      // Add data to the blockquote node for later processing
      node.data = {
        ...node.data,
        hProperties: {
          className: `callout callout-${calloutType}`,
          "data-callout-type": calloutType,
        },
      };
    });
  };
}
