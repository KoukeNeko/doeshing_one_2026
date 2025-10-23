import { CodeBlock } from "@/components/mdx/CodeBlock";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(): MDXComponents {
  return {
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children, ...props }) => {
      const isCodeBlock = className?.startsWith('language-');
      if (isCodeBlock && typeof children === 'string') {
        return (
          <CodeBlock className={className} {...props}>
            {children}
          </CodeBlock>
        );
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };
}
