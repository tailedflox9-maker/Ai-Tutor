import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group py-6 ${isUser ? '' : 'bg-[var(--color-bg)]'}`}>
      <div className="flex gap-4 max-w-full">
        <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mt-1">
          {isUser ? (
            <User className="w-5 h-5 text-[var(--color-text-primary)]" />
          ) : (
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--color-accent)] text-white">
              <Bot className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {isUser ? 'You' : 'Gemini 1.5 Flash'}
            </span>
          </div>
          <div className="prose prose-sm max-w-none">
            <div className={`p-3 rounded-lg ${isUser ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-card)] text-[var(--color-text-primary)]'}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md !mt-2 !mb-2"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-3 last:mb-0 pl-4">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-3 last:mb-0 pl-4">{children}</ol>,
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-[var(--color-accent)] animate-pulse ml-1"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
