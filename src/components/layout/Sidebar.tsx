'use client';

import React from 'react';
import { Plus, MessageSquare, MoreVertical } from 'lucide-react';
import { chatService } from '@/services/ChatService';
import { ChatSession } from '@/types';

interface SidebarProps {
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  activeSessionId: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onSelectSession, activeSessionId }) => {
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);

  React.useEffect(() => {
    const loadSessions = async () => {
      const all = await chatService.getAllSessions();
      setSessions(all);
    };
    loadSessions();

    // Poll for changes (simple approach for now)
    const interval = setInterval(async () => {
      const all = await chatService.getAllSessions();
      setSessions(all);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">History</h2>
        <button
          onClick={onNewChat}
          className="p-2 hover:bg-foreground/10 rounded-lg transition-colors text-accent"
          title="New Chat"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {sessions.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <MessageSquare size={24} className="mx-auto mb-2 text-foreground/20" />
            <p className="text-xs text-foreground/40">No chats yet</p>
          </div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                activeSessionId === session.id
                  ? 'bg-accent/10 text-accent'
                  : 'hover:bg-foreground/5 text-foreground/70 hover:text-foreground'
              }`}
            >
              <MessageSquare size={16} className={activeSessionId === session.id ? 'text-accent' : 'text-foreground/30'} />
              <span className="flex-1 text-left truncate font-light">
                {session.title}
              </span>
              <MoreVertical size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground/30" />
            </button>
          ))
        )}
      </div>

      {/* Footer / Model Status */}
      <div className="p-4 border-t border-glass-border glass">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/40">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Local Model Active</span>
        </div>
      </div>
    </div>
  );
};
