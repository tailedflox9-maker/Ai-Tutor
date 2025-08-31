// FILE: src/components/Sidebar.tsx
import React from 'react';
import { Plus, Search, MessageSquare, Settings, Trash2, Bot, Lock, User } from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onOpenSettings,
}: SidebarProps) {
  return (
    <div className="flex h-full">
      {/* Vertical Icon Strip */}
      <div className="w-12 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
        <div className="text-gray-500 hover:text-gray-300 cursor-pointer">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-gray-500 hover:text-gray-300 cursor-pointer">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-gray-500 hover:text-gray-300 cursor-pointer">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-gray-500 hover:text-gray-300 cursor-pointer">
          <Lock className="w-5 h-5" />
        </div>
        <div className="flex-1"></div>
        <div className="text-gray-500 hover:text-gray-300 cursor-pointer">
          <User className="w-5 h-5" />
        </div>
      </div>
      
      {/* Main Sidebar Content */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-sm font-semibold text-gray-300">Home Workspace</h1>
            <button 
              onClick={onOpenSettings}
              className="text-gray-500 hover:text-gray-300"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onNewConversation}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 mt-8 px-4">
                <p className="text-sm">No chats.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      currentConversationId === conversation.id
                        ? 'bg-gray-800'
                        : 'hover:bg-gray-800'
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    <span className="flex-1 text-sm text-gray-300 truncate">
                      {conversation.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
