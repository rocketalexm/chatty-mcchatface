# User Experience and Performance Improvements (v1.5)

## Context
Based on beta tester feedback, the application requires several improvements to its usability, performance, and visual identity. This version incorporates specific requirements for the "Stop" button behavior and refined UI/UX patterns to ensure a professional, responsive experience.

## Recommended Approach

### 1. Interruptible Streams
Introduce `AbortController` to allow the client to cancel network requests:
- **Adapter (`src/services/adapters/LMStudioAdapter.ts`)**: Update `sendMessage` to accept an optional `AbortSignal` and pass it to the `fetch` call.
- **Service (`src/services/ChatService.ts`)**: Pass the `AbortSignal` from the UI layer through to the adapter.
- **UI (`src/components/chat/ChatWindow.tsx`)**: 
  - Use a `useRef` to track the current `AbortController`.
  - Implement a `handleStop` function that triggers `controller.abort()`, resets the `isThinking` state, and ensures the user immediately regains control of the input field.
  - **Button Toggle**: The "Stop" button must completely replace the "Send" button immediately after a request is sent. Once the stream finishes or is stopped, it must toggle back to the "Send" button.

### 2. Performance Optimizations
Reduce the cost of updating state and persisting data during streaming:
- **Persistence (`src/services/ChatService.ts`)**: Implement a debounced version of `saveSessions` (e.g., 500ms) to batch `localStorage` writes instead of writing on every single token.
- **Rendering (`src/components/chat/ChatWindow.tsx`)**: 
  - Introduce a local `streamingContent` state to hold the current response.
  - Update this local state frequently for a smooth UI, but throttle calls to `chatService.updateMessageContent` and the main session state update to reduce expensive object clones and re-renders.

### 3. UI/UX Redesign
Make the input area distinct from browser chrome:
- **Styling (`src/components/chat/ChatWindow.tsx`)**: 
  - Change `rounded-full` to `rounded-2xl`.
  - Update background from `bg-background/50` to a more solid, contrasting shade (e.g., `bg-background`).
  - Strengthen the border contrast to make it feel like an app element rather than a system overlay.
- **Accessibility**: Add `aria-label` to the input and submit button.

### 4. Stream Persistence & Recovery
Provide transparency for interrupted responses:
- **Types (`src/types/index.ts`)**: Add `SessionStatus` type (`'idle'`, `'streaming'`, `'interrupted'`, `'completed'`) to the `ChatSession` interface.
- **Lifecycle (`src/services/ChatService.ts`)**: 
  - Set status to `'streaming'` at the start of `sendMessage`.
  - Add a `completeSession(id)` method to set status to `'completed'`.
  - In `loadSessions()`, any session still in `'streaming'` state should be automatically marked as `'interrupted'`.

## Verification Plan
1. **Stop Button**: Start a response and click "Stop". Verify that the stream terminates immediately and no further tokens are received.
2. **Performance**: Use Chrome DevTools Performance tab to compare the "Scripting" and "Rendering" time before and after optimizations during a long response.
3. **Visual Identity**: Test on iOS Safari to ensure the input field no longer mimics the address bar's appearance.
4. **Recovery**: Start a response, refresh the page (or close/reopen), and verify that the session is correctly identified as `'interrupted'`.
