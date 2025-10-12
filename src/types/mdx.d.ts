declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  const MDXComponent: (props: MDXProps) => JSX.Element;
  export default MDXComponent;
  export const frontmatter: Record<string, unknown>;
}

declare module "*.md" {
  const content: string;
  export default content;
  export const frontmatter: Record<string, unknown>;
}
