# Architecture Specification - Chatty McChatface

## System Overview
Chatty McChatface is a decoupled client-server architecture designed for local LLM interaction. The system separates the presentation layer from the model hosting environment to allow lightweight clients (Web/iOS) to interact with heavyweight local servers.

## High-Level Architecture
The application follows a layered architecture to maintain backend agnosticism:

`UI Layer (React/Next.js)` $\to$ `ChatService` $\to$ `LLM Adapter Layer` $\to$ `Local LLM Server (LM Studio/MLX)`

### 1. UI Layer
- **Adaptive Layout:** Implements a responsive design that switches between a fixed sidebar (Desktop/Landscape) and a slide-over drawer (Mobile Portrait).
- **Zen Interface:** High whitespace, glassmorphism, and an empty state that fades upon first interaction.
- **Streaming UI:** Real-time rendering of tokens via Server-Sent Events (SSE).
- **Markdown Integration:** Use `react-markdown` to transform LLM string outputs into structured HTML, ensuring a seamless transition from raw stream to formatted text. (Added in v1.5)

### 2. Chat Service
- Acts as the orchestrator between the UI and the adapters.
- Handles session management (UUID generation for chat threads).
- Manages the "Auto-Naming" logic: triggering background calls to summarize chats into 3-5 word titles.

### 3. LLM Adapter Layer (The Adapter Pattern)
To support multiple local backends without modifying UI logic, the system uses adapters:
- **LMStudioAdapter:** Implements OpenAI-compatible `/v1/chat/completions`.
- **MLXAdapter:** Implements specific schema handlers for MLX servers.
- All adapters expose a unified interface to the `ChatService`.

### 4. Data Persistence
- **Client-Side Storage:** Uses `localStorage` to store chat history and session IDs.
- **Schema:** 
  ```json
  {
    "chats": {
      "[UUID]": {
        "title": "Chat Title",
        "timestamp": 123456789,
        "messages": [
          { "role": "user", "content": "..." },
          { "role": "assistant", "content": "..." }
        ]
      }
    },
    "activeChatId": "[UUID]"
  }
  ```

## Network & Connectivity
- **Transport:** Standard HTTP/JSON for requests; SSE for streaming responses.
- **Configuration:** Local IP and Port are defined in environment variables (`.env`) to avoid user-facing config screens in v1.
- **Constraint:** Operates strictly on the local subnet; requires CORS configuration on the server side to allow the client origin.

## Roadmap Evolution
- **v1 (Web MVP):** React/Next.js $\to$ LM Studio.
- **v1.5 (Web Evolution):** Added MLX support and backend switching.
- **v2 (iOS Native):** SwiftUI rebuild $\to$ mDNS/Bonjour for automatic server discovery.
- **v3 (Power Update):** Multimodal support and editable system prompts.
