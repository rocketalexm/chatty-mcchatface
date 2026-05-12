Here is the final, absolute design specification for **Chatty McChatface v1**.

### 🛠 Final Visual Detail: The "Minimal" Toggle
*   **Icon:** Two horizontal, equal-length bars ($\text{=}$). 
*   **Style:** Thin to medium stroke weight, matching the line weight of the `+` icon.
*   **Interaction:** A simple tap/click that triggers the sidebar transition.

---

### 🏁 The Definitive v1 Design Blueprint

#### I. Visual & UX Identity
*   **Aesthetic:** Ultra-Minimalism (San Francisco type, Glassmorphism).
*   **Color Palette:** 
    *   **Light Mode:** White background, `#F5F5F7` user bubbles, `#007AFF` accents.
    *   **Dark Mode:** Pure black background, deep charcoal bubbles.
*   **Empty State:** Centered, muted text: *"What can I help you with?"* $\to$ Fades on first input.

#### II. The Adaptive UI Map
| Component | Compact (Mobile Portrait) | Expanded (Desktop/Tablet/Landscape) | Interaction |
| :--- | :--- | :--- | :--- |
| **Sidebar** | Hidden Slide-over Drawer. | Fixed Left Column. | Stores History + Active Model info. |
| **Header** | $\text{=}$ (Left) $\mid$ $+$ (Right). | [Void] $\mid$ $+$ (Right). | $\text{=}$ toggles menu; $+$ creates new chat. |
| **Main View** | Full width. | Centered max-width container. | Streaming markdown-formatted text bubbles (No borders). Supports rich text (bold, italics, lists) and syntax-highlighted code blocks with monospaced fonts. |
| **Input Pill**| Floating, bottom-center. | Floating, bottom-center. | Text-only $\to$ Send button ($\uparrow$). |

#### III. The Sidebar Architecture (The Only "Control Center")
The sidebar is the only place where technical information exists, keeping the main chat a "Zen" void.
1.  **Top Section (Status):** 
    *   Small, all-caps label: `ACTIVE MODEL`.
    *   Read-only value: `Llama-3-8B` (with a small green connectivity dot $\bullet$).
2.  **Bottom Section (Library):** 
    *   Small, all-caps label: `CHATS`.
    *   Date-grouped list of conversations $\mid$ Active chat highlighted in blue $\mid$ Swipe-to-delete.

#### IV. Content Rendering & Typography
*   **Markdown Engine:** Full support for rich text (bold, italics, lists) to ensure high readability of technical content.
*   **Code Blocks:** 
    *   **Style:** Subtle, low-contrast background containers to distinguish code from chat bubbles while maintaining the "Zen" aesthetic.
    *   **Font:** Monospaced (e.g., SF Mono) for all technical snippets.
    *   **Syntax Highlighting:** Minimalist color palette that complements both Light and Dark modes.
*   **Streaming Transitions:** Smooth fade-in animations for formatted elements to prevent visual jitter during token streaming.

#### V. Core Logic & Technicals
*   **v1:** Responsive Web MVP $\mid$ LM Studio connectivity $\mid$ Adaptive Sidebar ($\text{=}$) $\mid$ Chat History.
*   **v2:** iOS Native (SwiftUI) $\mid$ mDNS Network Discovery $\mid$ Haptics.
*   **v3:** Multimodal (File/Image uploads) $\mid$ User-editable System Prompts $\mid$ In-app Model Selection.

**Design phase complete.** This is a cohesive, high-end specification that balances technical simplicity with a premium user experience.
