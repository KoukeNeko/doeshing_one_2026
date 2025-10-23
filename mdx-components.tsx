import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/mdx/CodeBlock';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: ({ children, ...props }) => <div {...props}>{children}</div>,
    code: ({ className, children, ...props }) => {
      // Check if it's a code block (has language class) or inline code
      const isCodeBlock = className?.startsWith('language-');
      
      if (isCodeBlock) {
        return (
          <CodeBlock className={className} {...props}>
            {children as string}
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
