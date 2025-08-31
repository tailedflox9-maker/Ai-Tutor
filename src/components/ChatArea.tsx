import React, { useEffect, useRef } from 'react';
import { Bot, User, Folder, Info, Share2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Message } from '../types';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  streamingMessage?: Message | null;
  hasApiKey: boolean;
}

export function ChatArea({ messages, onSendMessage, isLoading, streamingMessage, hasApiKey }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);
  const allMessages = streamingMessage ? [...messages, streamingMessage] : messages;

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--color-chat-bg)]">
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
        <h1 className="text-lg font-medium">Hi</h1>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-[var(--color-card)] rounded-md">
            <Info className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
          <button className="p-1 hover:bg-[var(--color-card)] rounded-md">
            <Share2 className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
        </div>
      </div>
      {allMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">
              How can I help you today?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              I'm your AI tutor, ready to help you learn and answer any questions you might have.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {allMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={streamingMessage?.id === message.id}
              />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      )}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="max-w-3xl mx-auto px-4">
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            disabled={!hasApiKey}
          />
        </div>
      </div>
    </div>
  );
}
