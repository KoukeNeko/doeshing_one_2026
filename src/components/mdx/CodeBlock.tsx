'use client';

import { CodeBlock as ReactCodeBlock } from 'react-code-block';

interface CodeBlockProps {
  children: string;
  className?: string;
  [key: string]: unknown;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = className?.replace(/language-/, '') || 'text';
  
  // Get the code string from children
  const code = typeof children === 'string' ? children.trim() : '';

  return (
    <ReactCodeBlock
      code={code}
      language={language}
      {...props}
    >
      <div className="relative my-6">
        <ReactCodeBlock.Code className="bg-zinc-950 text-zinc-50 px-6 py-4 rounded-lg overflow-x-auto text-sm font-mono block">
          <div className="table min-w-full">
            <ReactCodeBlock.LineContent className="table-row">
              <ReactCodeBlock.LineNumber className="table-cell pr-4 text-zinc-500 select-none text-right align-top" />
              <ReactCodeBlock.Token className="table-cell" />
            </ReactCodeBlock.LineContent>
          </div>
        </ReactCodeBlock.Code>
      </div>
    </ReactCodeBlock>
  );
}
