import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/SettingsModal';
import { Conversation, Message, APISettings } from './types';
import { aiService } from './services/aiService';
import { storageUtils } from './utils/storage';
import { generateId, generateConversationTitle } from './utils/helpers';
import { Moon, Sun } from 'lucide-react';

const defaultSettings: APISettings = {
  googleApiKey: '',
  zhipuApiKey: '',
  selectedModel: 'google',
};

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<APISettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load theme, conversations, and settings on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    const savedConversations = storageUtils.getConversations();
    const savedSettings = storageUtils.getSettings();

    setConversations(savedConversations);
    setSettings(savedSettings);

    if (savedConversations.length > 0) {
      setCurrentConversationId(savedConversations[0].id);
    }

    aiService.updateSettings(savedSettings);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Save conversations to localStorage when they change
  useEffect(() => {
    storageUtils.saveConversations(conversations);
  }, [conversations]);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const hasApiKey = settings.googleApiKey || settings.zhipuApiKey;

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSaveSettings = (newSettings: APISettings) => {
    setSettings(newSettings);
    storageUtils.saveSettings(newSettings);
    aiService.updateSettings(newSettings);
  };

  const handleSendMessage = async (content: string) => {
    if (!hasApiKey) {
      setIsSettingsOpen(true);
      return;
    }

    let targetConversationId = currentConversationId;

    if (!targetConversationId) {
      const newConversation: Conversation = {
        id: generateId(),
        title: generateConversationTitle(content),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations(prev => [newConversation, ...prev]);
      targetConversationId = newConversation.id;
      setCurrentConversationId(targetConversationId);
    }

    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === targetConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        const updatedTitle = conv.messages.length === 0 ? generateConversationTitle(content) : conv.title;
        return {
          ...conv,
          title: updatedTitle,
          messages: updatedMessages,
          updatedAt: new Date(),
        };
      }
      return conv;
    }));

    setIsLoading(true);

    try {
      const assistantMessage: Message = {
        id: generateId(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
      };

      setStreamingMessage(assistantMessage);

      const conversationHistory = currentConversation
        ? [...currentConversation.messages, userMessage]
        : [userMessage];

      const messages = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      let fullResponse = '';

      for await (const chunk of aiService.generateStreamingResponse(messages)) {
        fullResponse += chunk;
        setStreamingMessage(prev => prev ? { ...prev, content: fullResponse } : null);
      }

      const finalAssistantMessage: Message = {
        ...assistantMessage,
        content: fullResponse,
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === targetConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, finalAssistantMessage],
            updatedAt: new Date(),
          };
        }
        return conv;
      }));

      setStreamingMessage(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setStreamingMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[var(--color-bg)]">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-[var(--color-card)] rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        <ChatArea
          messages={currentConversation?.messages || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          streamingMessage={streamingMessage}
          hasApiKey={hasApiKey}
        />
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}

export default App;
