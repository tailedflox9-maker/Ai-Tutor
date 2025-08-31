import React from 'react';
import { Plus, MessageSquare, Settings, Trash2, Bot, Search, Folder } from 'lucide-react';
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
    <div className="w-64 bg-[var(--color-sidebar)] flex flex-col h-full border-r border-[var(--color-border)]">
      <div className="p-4 border-b border-[var(--color-border)]">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2 bg-[var(--color-card)] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-[var(--color-text-primary)] border border-[var(--color-border)]"
        >
          <Plus className="w-4 h-4" />
          New chat
        </button>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent text-sm"
          />
        </div>
      </div>
      <div className="p-2 text-xs text-[var(--color-text-secondary)]">Today</div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center text-[var(--color-text-secondary)] mt-8 px-4">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    currentConversationId === conversation.id
                      ? 'bg-[var(--color-card)]'
                      : 'hover:bg-[var(--color-card)]'
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-[var(--color-accent)] text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-sm truncate">
                    {conversation.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-[var(--color-border)]">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-3 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-card)] rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
