import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

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
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please configure API keys in Settings first..." : "Send a message..."}
          disabled={disabled || isLoading}
          className="w-full min-h-[52px] max-h-[200px] p-4 pr-12 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl resize-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent disabled:bg-gray-800 disabled:text-[var(--color-text-secondary)] shadow-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
          rows={1}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 disabled:text-[var(--color-text-secondary)] disabled:cursor-not-allowed transition-colors rounded-lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      {disabled && (
        <p className="text-xs text-[var(--color-text-secondary)] mt-2 text-center">
          Configure your API keys in Settings to start chatting
        </p>
      )}
    </div>
  );
}
