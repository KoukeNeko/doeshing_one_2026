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
      <div className="relative my-6 overflow-x-auto">
        <ReactCodeBlock.Code className="bg-zinc-950 text-zinc-50 px-6 py-4 rounded-lg text-sm font-mono block">
          <div className="flex">
            <ReactCodeBlock.LineNumber className="pr-4 text-zinc-500 select-none text-right shrink-0 min-w-[3ch]" />
            <ReactCodeBlock.LineContent className="flex-1 min-w-0">
              <ReactCodeBlock.Token />
            </ReactCodeBlock.LineContent>
          </div>
        </ReactCodeBlock.Code>
      </div>
    </ReactCodeBlock>
  );
}
