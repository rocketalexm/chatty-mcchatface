# PRD: Chatty McChatface
**Version:** 1.5 (Final Design Specification)  
**Status:** Final Draft (MVP)  
**Target Platforms:** Web (v1 $\rightarrow$ v1.5), iOS (v2)

---

## 1. Executive Summary
Chatty McChatface is a client-side application providing an ultra-minimalist, Apple-inspired interface for Large Language Models (LLMs) hosted on a local network.

The app decouples the user interface from the model hosting, allowing users to run heavy models on a powerful desktop/server while interacting with them via a lightweight, responsive web or mobile client. The focus is on "Zen" productivity—removing all cognitive friction and technical noise from the chat experience.

### Version Goals:
*   **v1:** A responsive web-based multi-thread chat interface connecting to an LM Studio instance via a hard-coded local IP.
*   **v1.5:** Expansion to support MLX server (Apple Silicon optimized) and a backend toggle.
*   **v2:** A native iOS application for mobility with automatic network discovery.
*   **v3:** "Power Update" introducing multimodal inputs and user-configurable settings.

---

## 2. Technical Constraints & Assumptions
*   **Server Address:** Hard-coded in v1 (via `.env` file). No user-facing settings page for IP/Port.
*   **Backend v1:** LM Studio (running in "Local Server" mode).
*   **Protocol v1:** OpenAI-style JSON API (`/v1/chat/completions`).
*   **Backend v1.5:** MLX Server.
*   **Network:** The client device and the server machine must reside on the same subnet/Wi-Fi.

---

## 3. Functional Requirements

### 3.1 Version 1: Web App (The Minimalist MVP)
The primary goal is a "zero-config" experience with an adaptive, high-end aesthetic.

| ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **F1.1** | Hard-coded Connectivity | App connects to pre-defined server IP via environment variables. | P0 |
| **F1.2** | OpenAI API + Auto-Naming | Implement requests to `/v1/chat/completions`. After the first response of a new chat, trigger a silent background request to generate a 3-5 word title for the session. | P0 |
| **F1.3** | Streaming UI | Real-time token streaming (SSE) with smooth fade-in animations for text. | P0 |
| **F1.4** | Adaptive Minimalist UI | Responsive layout: Fixed sidebar for desktop/landscape; slide-over drawer (via two-bar $\text{=}$ menu) for mobile portrait. | P0 |
| **F1.5** | Multi-thread History | Store multiple conversations in `localStorage` using UUIDs. Implement a `+` button to archive the current chat and start a new one. | P0 |
| **F1.6** | Read-only Model Status | Display the active model name (as reported by the server) as a read-only label in the sidebar with a green connectivity dot. | P1 |
| **F1.7** | Hard-coded System Prompt | A predefined system prompt (stored in `.env` or constants) is invisibly prepended to every new conversation. | P1 |
| **F1.8** | Zen Empty State | Blank canvas with centered, muted text: *"What can I help you with?"* that fades out on first input. | P1 |
| **F1.12** | Markdown Rendering | Support for rich text formatting (bold, italics, lists) and syntax-highlighted code blocks in assistant responses to improve readability of technical content via `react-markdown`. | P1 |

### 3.2 Version 1.5: The "MLX & Control" Update
Expanding backend capabilities while maintaining UI simplicity.

| ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **F1.9** | MLX Server Support | Integration with the MLX server API using an Adapter pattern to handle schema differences. | P0 |
| **F1.10** | Backend Toggle | A simple switch (located in the sidebar) to toggle between "LM Studio Mode" and "MLX Mode." | P1 |
| **F1.11** | Performance Tuning | Adjust streaming buffers specifically for the generation speeds of MLX. | P2 |

### 3.3 Version 2: iOS App
| ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **F2.1** | SwiftUI Implementation | Native rebuild optimized for mobile keyboards and screen sizes. | P0 |
| **F2.2** | Network Discovery | Implementation of mDNS/Bonjour to find the server automatically, removing reliance on hard-coded IPs. | P1 |
| **F2.3** | Native Experience | Integration of haptics and native iOS dark/light mode support. | P1 |

## 3. Functional Requirements

### 3.1 Version 1: Web App (The Minimalist MVP)
...
### 3.4 Version 3: The Power Update (Scope Expansion)
| ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **F3.1** | Multimodal Input | Support for file and image uploads within the chat interface. | P1 |
| **F3.2** | User System Prompts | UI to allow users to edit the system prompt per session or globally. | P1 |
| **F3.3** | In-app Model Selection | Ability to switch between different loaded models via a settings menu. | P1 |
| **F3.4** | Native macOS App | A dedicated desktop application for macOS to provide a seamless, high-performance experience. | P1 |

---

## 4. Technical Architecture

### 4.1 The Adapter Pattern
To ensure the UI remains agnostic of the backend server, a Service Adapter layer will be used:
*   **UI Layer:** Calls `ChatService.sendMessage(text, chatId)`.
*   **Adapter Layer:** 
    *   `LMStudioAdapter`: Formats input for OpenAI-compatible endpoints.
    *   `MLXAdapter`: Formats input for MLX-specific endpoints.
*   **Network Layer:** Handles the fetch call to the local IP.

### 4.2 Data Flow (v1)
`User Input` $\rightarrow$ `ChatService` $\rightarrow$ `Adapter` $\rightarrow$ `LLM API` $\rightarrow$ `Streamed Response` $\rightarrow$ `UI Render` $\rightarrow$ **`Silent Auto-Naming Request (on 1st msg)`** $\rightarrow$ **`Update LocalStorage Title`.**

### 4.3 Persistence Schema
`localStorage` will store a keyed object:
```json
{
  "currentChatId": "uuid-123",
  "chats": {
    "uuid-123": { "title": "Chat Title", "timestamp": 171543200, "messages": [...] }
  }
}
```

---

## 5. Non-Functional Requirements
*   **Design Language:** Apple-style minimalism. High whitespace, San Francisco/Inter typography, and Glassmorphism (blur effects) for headers and sidebars.
*   **CORS:** The LM Studio server must be configured to allow requests from the web app's origin.
*   **Latency:** The UI must trigger a "Thinking..." state (subtle pulse or ellipsis) immediately upon sending.
*   **Privacy:** No data shall be sent to any third-party cloud; all traffic remains within the local network.

---

## 6. Roadmap & Milestones
*   **Phase 1: Web MVP (v1)** $\rightarrow$ Responsive UI, Multi-thread History, Auto-Naming, LM Studio Integration.
*   **Phase 2: Web Evolution (v1.5)** $\rightarrow$ MLX Server Support, Backend Toggle.
*   **Phase 3: Mobile Port (v2)** $\rightarrow$ SwiftUI, Bonjour Network Discovery, Native Haptics.
*   **Phase 4: Power Update (v3)** $\rightarrow$ File Uploads, User-editable Prompts, Model Selection.
