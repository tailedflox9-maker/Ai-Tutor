import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/SettingsModal';
import { Conversation, Message, APISettings } from './types';
import { aiService } from './services/aiService';
import { storageUtils } from './utils/storage';
import { generateId, generateConversationTitle } from './utils/helpers';

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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConversations = storageUtils.getConversations();
    const savedSettings = storageUtils.getSettings();
    setConversations(savedConversations);
    setSettings(savedSettings);
    
    if (savedConversations.length > 0) {
      setCurrentConversationId(savedConversations[0].id);
    }
    
    // Update AI service with saved settings
    aiService.updateSettings(savedSettings);
  }, []);

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
    // Create new conversation if none exists
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

    // Update conversation with user message
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

      // Add final assistant message to conversation
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
    <div className="h-screen flex bg-gray-900 text-white">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <ChatArea
        messages={currentConversation?.messages || []}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        streamingMessage={streamingMessage}
        hasApiKey={hasApiKey}
      />
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
