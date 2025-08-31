import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
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
    <div className="flex-1 flex flex-col h-full bg-[var(--color-bg)]">
      {allMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-[var(--color-card)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3">
              How can I help you today?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              I'm your AI tutor, ready to help you learn and answer any questions you might have.
            </p>
            {!hasApiKey && (
              <div className="bg-yellow-900/30 border border-yellow-900/50 rounded-lg p-4 text-left">
                <p className="text-sm text-yellow-300">
                  <strong>Setup Required:</strong> Please configure your API keys in Settings to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4">
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
      <div className="border-t border-[var(--color-border)]">
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
