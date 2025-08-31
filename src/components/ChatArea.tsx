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

export function ChatArea({
  messages,
  onSendMessage,
  isLoading,
  streamingMessage,
  hasApiKey,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const allMessages = streamingMessage ? [...messages, streamingMessage] : messages;

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {allMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-3">How can I help you today?</h2>
            <p className="text-gray-400 mb-6">I'm your AI tutor, ready to help you learn and answer any questions you might have.</p>
            {!hasApiKey && (
              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 text-left">
                <p className="text-sm text-yellow-200">
                  <strong>Setup Required:</strong> Please configure your API keys in Settings to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {allMessages.map((message) => (
              <MessageBubble key={message.id} message={message} isStreaming={streamingMessage?.id === message.id} />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      )}
      <div className="border-t border-gray-700">
        <div className="max-w-3xl mx-auto p-4">
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} disabled={!hasApiKey} />
        </div>
      </div>
    </div>
  );
}
