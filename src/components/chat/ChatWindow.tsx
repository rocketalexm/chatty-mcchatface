import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatService } from '@/services/ChatService';
import { Message, ChatSession } from '@/types';
import { ZenEmptyState } from './ZenEmptyState';

export const ChatWindow: React.FC<{ activeSessionId: string | null }> = ({ activeSessionId }) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSession = async () => {
      if (activeSessionId) {
        const current = await chatService.getSession(activeSessionId);
        setSession(current);
      } else {
        const current = await chatService.getCurrentSession();
        if (current) {
          setSession(current);
        } else {
          const newSession = await chatService.createSession();
          setSession(newSession);
        }
      }
    };
    initSession();
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !session || isThinking) return;

    const textToSend = input.trim();
    setInput('');
    setIsThinking(true);

    try {
      const { stream, session: updatedSession } = await chatService.sendMessage(textToSend);
      setSession(updatedSession);

      const assistantMsg = updatedSession.messages[updatedSession.messages.length - 1];
      let accumulatedContent = '';

      for await (const chunk of stream) {
        accumulatedContent += chunk;
        await chatService.updateMessageContent(assistantMsg.id, accumulatedContent);

        setSession(prev => {
          if (!prev) return null;
          const newMessages = prev.messages.map(m =>
            m.id === assistantMsg.id ? { ...m, content: accumulatedContent } : m
          );
          return { ...prev, messages: newMessages };
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsThinking(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex flex-col flex-1 w-full min-h-0">
      {error && (
        <div className="bg-destructive/20 border border-destructive text-destructive px-4 py-2 text-xs text-center animate-in fade-in slide-in-from-top duration-300">
          Error: {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {session.messages.length === 0 ? (
          <ZenEmptyState />
        ) : (
          session.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} zen-fade-in`}
            >
                <div
                className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-500 ${
                  msg.role === 'user'
                    ? 'bg-accent text-white rounded-tr-none shadow-lg shadow-accent/20'
                    : 'glass rounded-tl-none text-foreground shadow-sm'
                }`}
              >
                {msg.content ? (
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (isThinking && msg.role === 'assistant' ? (
                  <span className="flex items-center gap-1 opacity-50">
                    Thinking<span className="animate-pulse">...</span>
                  </span>
                ) : null)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-8 flex-shrink-0 transition-all duration-700 ease-in-out ${
        session.messages.length === 0
          ? '-translate-y-[42dvh] border-none bg-transparent'
          : 'glass translate-y-0'
      }`}>
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-background/50 border border-foreground/20 focus:border-accent/40 rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-4 focus:ring-accent/10 shadow-md transition-all text-sm placeholder:text-foreground/30"
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent disabled:text-foreground/30 transition-all hover:scale-110 active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};