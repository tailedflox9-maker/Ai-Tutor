import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Plus, HelpCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="p-4">
      <div className="flex items-end gap-2">
        <button className="p-2 hover:bg-[var(--color-card)] rounded-lg">
          <Plus className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Please configure API keys in Settings first..." : "Ask anything..."}
            disabled={disabled || isLoading}
            className="w-full min-h-[52px] max-h-[120px] p-3 pr-12 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl resize-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-[var(--color-card)] shadow-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:text-[var(--color-text-secondary)] disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        <button className="p-2 hover:bg-[var(--color-card)] rounded-lg">
          <HelpCircle className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
      </div>
    </div>
  );
}
