---
name: enhance-text-input-visibility
description: Improve the visibility of the chat input field, especially on mobile/iOS.
type: project
---

# Context
The chat input field is currently difficult to see on mobile devices (specifically iOS) because users often tap the Safari address bar instead of the input box. We need to enhance its visibility with a border that aligns with our existing "glass" and "accent" design language.

# Goals
- Add a visible border to the text input field.
- Ensure the design remains consistent with the "Zen" minimalist aesthetic (using `glass` or `accent` colors).
- Improve tap target/visual prominence for mobile users.

# Files to Modify
- `src/components/chat/ChatWindow.tsx` (likely where the input is defined)
- `src/app/globals.css` (if new utility classes or variables are needed)
