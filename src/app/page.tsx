'use client';

import React, { useState, useEffect } from 'react';
import { AdaptiveLayout } from '@/components/layout/AdaptiveLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { chatService } from '@/services/ChatService';

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const session = await chatService.getCurrentSession();
      if (session) setActiveSessionId(session.id);
    };
    init();
  }, []);

  const handleNewChat = async () => {
    const newSession = await chatService.createSession();
    setActiveSessionId(newSession.id);
  };

  const handleSelectSession = async (id: string) => {
    await chatService.getSession(id);
    setActiveSessionId(id);
  };

  const sidebarContent = (
    <Sidebar
      onNewChat={handleNewChat}
      onSelectSession={handleSelectSession}
      activeSessionId={activeSessionId}
    />
  );

  return (
    <AdaptiveLayout sidebar={sidebarContent} onNewChat={handleNewChat}>
      <ChatWindow activeSessionId={activeSessionId} />
    </AdaptiveLayout>
  );
}
