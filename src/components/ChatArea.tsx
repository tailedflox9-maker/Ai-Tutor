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
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {allMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">AI Tutor</h2>
            <p className="text-gray-400 mb-6">Your intelligent learning companion</p>
            {!hasApiKey && (
              <div className="bg-yellow-800 border border-yellow-700 rounded-lg p-4 text-left">
                <p className="text-sm text-yellow-200">
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
      
      <div className="border-t border-gray-700">
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
