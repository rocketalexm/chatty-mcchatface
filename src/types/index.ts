export type Role = 'system' | 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface LLMResponse {
  content: string;
  model: string;
}

export interface LLMAdapter {
  sendMessage(messages: Message[]): Promise<AsyncIterable<string>>;
  getModelName(): Promise<string>;
}
