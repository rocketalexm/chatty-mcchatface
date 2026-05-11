import { ChatSession, Message } from '@/types';
import { LLMAdapter } from '@/types';
import { LMStudioAdapter } from './adapters/LMStudioAdapter';
import { generateChatTitle } from './titleGenerator';

class ChatService {
  private adapter: LLMAdapter;
  private sessions: Map<string, ChatSession> = new Map();
  private currentSessionId: string | null = null;

  constructor() {
    // Default to LMStudioAdapter for v1
    this.adapter = new LMStudioAdapter();
  }

  private loadSessions() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('chatty_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.sessions = new Map(Object.entries(parsed));
      } catch (e) {
        console.error('Failed to load sessions from localStorage', e);
      }
    }

    const currentId = localStorage.getItem('chatty_current_id');
    if (currentId) this.currentSessionId = currentId;
  }

  private saveSessions() {
    if (typeof window === 'undefined') return;
    const sessionsObj = Object.fromEntries(this.sessions);
    localStorage.setItem('chatty_sessions', JSON.stringify(sessionsObj));
    if (this.currentSessionId) {
      localStorage.setItem('chatty_current_id', this.currentSessionId);
    }
  }

  async getCurrentSession(): Promise<ChatSession | null> {
    if (typeof window === 'undefined') return null;
    this.loadSessions();
    if (!this.currentSessionId) return null;
    return this.sessions.get(this.currentSessionId) || null;
  }

  async getAllSessions(): Promise<ChatSession[]> {
    if (typeof window === 'undefined') return [];
    this.loadSessions();
    return Array.from(this.sessions.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async getSession(id: string): Promise<ChatSession | null> {
    if (typeof window === 'undefined') return null;
    this.loadSessions();
    return this.sessions.get(id) || null;
  }

  private generateUUID(): string {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback for non-secure contexts (HTTP)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async createSession(): Promise<ChatSession> {
    if (typeof window === 'undefined') throw new Error('Must be in browser');
    this.loadSessions();
    const id = this.generateUUID();
    const session: ChatSession = {
      id,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.sessions.set(id, session);
    this.currentSessionId = id;
    this.saveSessions();
    return session;
  }

  async sendMessage(text: string): Promise<{ stream: AsyncIterable<string>, session: ChatSession }> {
    let session = await this.getCurrentSession();
    if (!session) {
      session = await this.createSession();
    }

    const userMsg: Message = {
      id: this.generateUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    session.messages.push(userMsg);
    session.updatedAt = Date.now();

    const assistantMsg: Message = {
      id: this.generateUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    session.messages.push(assistantMsg);

    const stream = await this.adapter.sendMessage(session.messages);

    // Trigger auto-naming in the background
    this.autoNameSession(session.id, text);

    this.saveSessions();
    return { stream, session };
  }

  private async autoNameSession(sessionId: string, firstMessage: string) {
    try {
      const newTitle = await generateChatTitle(firstMessage);
      const session = this.sessions.get(sessionId);
      if (session) {
        session.title = newTitle;
        session.updatedAt = Date.now();
        this.saveSessions();
      }
    } catch (e) {
      console.error('Failed to auto-name session:', e);
    }
  }

  async updateMessageContent(messageId: string, content: string) {
    if (typeof window === 'undefined') return;
    const session = await this.getCurrentSession();
    if (!session) return;

    const msg = session.messages.find(m => m.id === messageId);
    if (msg) {
      msg.content = content;
      session.updatedAt = Date.now();
      this.saveSessions();
    }
  }

  async getActiveModelName(): Promise<string> {
    return this.adapter.getModelName();
  }
}

export const chatService = new ChatService();
