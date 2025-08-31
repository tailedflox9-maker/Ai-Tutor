import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Plus } from 'lucide-react';

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
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            title="Add attachment"
            disabled={isLoading || disabled}
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Please configure API keys in Settings first..." : "Ask anything..."}
            disabled={disabled || isLoading}
            className="flex-1 min-h-[52px] max-h-[200px] p-4 pr-12 border border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:text-gray-500 shadow-sm"
            rows={1}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className="p-2 text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      
      {disabled && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Configure your API keys in Settings to start chatting
        </p>
      )}
    </div>
  );
}
