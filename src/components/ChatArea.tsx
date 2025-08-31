import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react'; // Keep Bot icon for the initial placeholder
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
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900"> {/* Dark mode for chat area */}
      {allMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center max-w-lg px-4">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome to AI Tutor
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start a new conversation by typing your message below or creating a new chat from the sidebar.
            </p>
            {!hasApiKey && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-left text-yellow-300">
                <p className="text-sm">
                  <strong>Setup Required:</strong> Please configure your API keys in Settings to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4"> {/* Added padding */}
          <div className="max-w-3xl mx-auto w-full"> {/* Centered content */}
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

      <div className="border-t border-gray-200 dark:border-gray-700"> {/* Dark mode border */}
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
