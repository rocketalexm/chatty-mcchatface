import { LLMAdapter, Message } from '@/types';

export class LMStudioAdapter implements LLMAdapter {
  private readonly url = process.env.NEXT_PUBLIC_LOCAL_SERVER_URL || 'http://localhost:1234/v1';
  private readonly model = process.env.NEXT_PUBLIC_MODEL_NAME || 'local-model';

  async getModelName(): Promise<string> {
    try {
      const response = await fetch(`${this.url}/models`);
      const data = await response.json();
      return data.data?.[0]?.id || this.model;
    } catch (error) {
      console.error('Error fetching model name:', error);
      return this.model;
    }
  }

  async sendMessage(messages: Message[]): Promise<AsyncIterable<string>> {
    const response = await fetch(`${this.url}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (async function* () {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body reader available');

      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // The last element might be a partial line, so keep it in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmed.substring(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) yield content;
            } catch (e) {
              console.warn('Error parsing SSE chunk:', e, 'Line content:', trimmed);
            }
          }
        }
      }

      // Process any remaining content in the buffer after loop ends
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
          try {
            const json = JSON.parse(trimmed.substring(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {
            console.warn('Error parsing final SSE chunk:', e, 'Line content:', trimmed);
          }
        }
      }
    })();
  }
}
