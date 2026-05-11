import { chatService } from '@/services/ChatService';

/**
 * Generates a short title for a chat session based on the first message.
 * In a real implementation, this would call the LLM with a specific prompt.
 */
export async function generateChatTitle(firstMessage: string): Promise<string> {
  // For now, we'll simulate a background LLM call by taking the first few words.
  // In Phase 5, we will implement a real call to the adapter.
  const words = firstMessage.trim().split(/\s+/);
  if (words.length <= 4) {
    return firstMessage.trim();
  }
  return words.slice(0, 4).join(' ') + '...';
}
