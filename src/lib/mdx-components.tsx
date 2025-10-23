import { CodeBlock } from "@/components/mdx/CodeBlock";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(): MDXComponents {
  return {
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children, ...props }) => {
      // Check if this is a code block (inside a <pre>) or inline code
      // Code blocks will have className starting with 'language-' or be multi-line
      const isCodeBlock = className?.startsWith('language-') || 
                         (typeof children === 'string' && children.includes('\n'));
      
      if (isCodeBlock && typeof children === 'string') {
        return (
          <CodeBlock className={className || 'language-text'} {...props}>
            {children}
          </CodeBlock>
        );
      }
      
      // Inline code
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };
}
