# Chatty McChatface

An ultra-minimalist, Apple-inspired web interface for interacting with Large Language Models (LLMs) hosted on your local network.

Chatty McChatface decouples the user interface from the model hosting, allowing you to run LLMs on a local computer while interacting with them via a lightweight, responsive web client. The focus is on "Zen" productivity—removing all cognitive friction and technical noise from the chat experience.

## 🚀 Features (MVP)

- **Minimalist UI:** High whitespace, glassmorphism effects, and a "Zen" empty state.
- **Multi-thread History:** Manage multiple conversations stored locally in your browser.
- **Auto-Naming:** Conversations are automatically titled based on their content.
- **Streaming Responses:** Real-time token streaming for a smooth, natural chat experience.
- **Local Connectivity:** Designed to connect to local LLM servers like [LM Studio](https://lmstudio.ai/) or MLX via your local network.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Optimized for [Vercel](https://vercel.com/)

## 📋 Prerequisites

Before running the project, ensure you have:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or `yarn`
- A local LLM server running (e.g., **LM Studio** in "Local Server" mode) on your network.

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rocketalexm/chatty-mcchatface.git
   cd chatty-mcchatface
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your local server's IP address or hostname:
   ```env
   NEXT_PUBLIC_LLM_SERVER_URL=http://<YOUR_LOCAL_IP_OR_HOSTNAME>:1234/v1
   ```
   *Note: Replace `<YOUR_LOCAL_IP_OR_HOSTNAME>` with the actual IP address or hostname (e.g., `machine-name.local`) of the machine running LM Studio.*

4. **Build and Start the application:**
   ```bash
   npm run build
   npm run start
   ```

## 🌐 Connecting to LM Studio

To use the MVP with LM Studio:
1. Open **LM Studio**.
2. Go to the **Local Server** tab.
3. Select a model and click **Start Server**.
4. In Server Settings, turn on "Serve on Local Network" and "Enable CORS" to allow connections from other devices on your network.
5. Verify the port (default is `1234`) matches your `.env.local` configuration.

## 🚀 Accessing the App

Navigate to [http://<YOUR_IP_OR_HOSTNAME>:3000](http://<YOUR_IP_OR_HOSTNAME>:3000) in your browser.

## 🗺️ Roadmap

- [ ] **v1.5:** Support for MLX Server and a backend toggle.
- [ ] **v2:** Native iOS application with automatic network discovery (Bonjour/mDNS).
- [ ] **v3:** Multimodal inputs (images/files) and user-configurable system prompts.

## 📄 License

This project is intended for personal use and educational purposes.
