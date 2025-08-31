// FILE: src/components/ChatArea.tsx
import React, { useEffect, useRef } from 'react';
import { Bot, Settings, HelpCircle, ChevronDown } from 'lucide-react';
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
    <div className="flex-1 flex flex-col h-full bg-gray-900 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="appearance-none bg-gray-800 text-gray-300 text-sm py-1 pl-3 pr-8 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>Chat</option>
              <option>Workspace</option>
              <option>Settings</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">gpt-4-turbo-preview</div>
          <button 
            onClick={() => {}}
            className="text-gray-500 hover:text-gray-300"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {allMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UI</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-100 mb-3">
              Chatbot UI
            </h2>
            <p className="text-gray-500 mb-6">
              How can I help you today?
            </p>
            {!hasApiKey && (
              <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4 text-left">
                <p className="text-sm text-yellow-400">
                  <strong>Setup Required:</strong> Please configure your API keys in Settings to start chatting.
                </p>
              </div>
            )}
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

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSendMessage={onSendMessage} 
            isLoading={isLoading} 
            disabled={!hasApiKey}
          />
        </div>
      </div>

      {/* Help Button */}
      <button className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-300">
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
