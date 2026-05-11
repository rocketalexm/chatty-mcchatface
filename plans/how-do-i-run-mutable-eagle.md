# Production Deployment Plan for Beta Testers

## Context
The user wants to transition the application from a development environment to a production-like state for beta testers. A primary requirement is the removal of Next.js development tools (the error overlay and HMR indicators) from the UI to provide a professional experience.

## Recommended Approach
Next.js development tools are only present when running `next dev`. To remove them and optimize the application for performance, the app must be compiled into a production build.

### 1. Remove Dev Tools (The "Production" Way)
To eliminate the dev overlay and optimize assets:
1. **Build**: Run `npm run build`. This creates an optimized `.next` folder containing the production-ready version of the site.
2. **Start**: Run `npm run start`. This starts a production server that serves the optimized build.

### 2. Environment Configuration
Since beta testers will be accessing the app via `claudia.local`, ensure that:
- `.env` contains `NEXT_PUBLIC_LOCAL_SERVER_URL=http://claudia.local:1234/v1` (or the appropriate public URL if testers are not on the same network).
- The LLM server is configured to accept requests from the hostname used by testers.

### 3. Deployment Strategy
Depending on where the beta testers are located:

#### Scenario A: Local Network Beta (Current Setup)
If testers are on the same local network as the server:
1. Run `npm run build`.
2. Use a process manager like **PM2** to keep the app running in the background:
   - Install PM2: `npm install -g pm2`
   - Start the app: `pm2 start npm --name "claudia-app" -- start`
3. Users can now access the app via `http://claudia.local:3000`.

#### Scenario B: Public Web Beta
If testers are accessing via the internet:
1. Deploy to **Vercel** (Recommended) or a VPS.
2. Update `NEXT_PUBLIC_LOCAL_SERVER_URL` to a public domain (e.g., `https://api.claudia.ai`).
3. Configure the LLM server's firewall/CORS to allow requests from the production frontend domain.

## Verification Plan
1. **Verify Dev Tools Removal**: Run `npm run build` followed by `npm run start`. Navigate to the app and confirm that the Next.js overlay/debug tools are no longer visible, even when errors occur.
2. **Verify Connectivity**: Access the app from a separate device on the network via `http://claudia.local:3000` and send a prompt to ensure the connection to the LLM server is functional.
3. **Verify Performance**: Compare the initial load time between `npm run dev` and `npm run start` to confirm optimization.
