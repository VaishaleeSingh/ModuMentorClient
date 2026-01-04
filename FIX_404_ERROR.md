# Fix for 404 Errors on Netlify

## Problems

### Issue 1: modumentor-server.netlify.app returns 404
You're getting a 404 error when accessing `https://modumentor-server.netlify.app/` because:

1. **Netlify serves static files only** - It's designed for hosting React apps, not Node.js Express servers
2. **The server needs to run constantly** - Express servers need to stay running 24/7, which Netlify doesn't support for full servers
3. **The client is making API calls to the wrong URL** - It's trying to call APIs on a static site

### Issue 2: modumentor-agent.netlify.app returns 404
Similarly, `https://modumentor-agent.netlify.app/` returns 404 because:

1. **Netlify cannot run Python Flask servers** - The agent is a Flask application that needs to run continuously
2. **Python servers require a runtime** - Netlify is for static sites and serverless functions, not long-running Python processes

## Solutions

### Solution 1: Deploy Both Server AND Agent to Render or Railway

**Netlify can only host the React client (frontend). Both the Node.js server AND Python agent must be deployed to platforms that support long-running processes.**

---

### Step 1: Deploy Python Agent to Render or Railway

The Python agent (`agent/agentic_server.py`) is a Flask application that must run continuously.

**Recommended: Render.com**

1. Go to https://render.com
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository (the one with the `agent` folder)
5. Configure:
   - **Name:** `modumentor-agent`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python agentic_server.py` (or `gunicorn agentic_server:app` if using gunicorn)
   - **Root Directory:** Leave empty or set to `agent`
6. Set Environment Variables (all your API keys):
   ```
   AGENTIC_PORT=5001
   AGENTIC_HOST=0.0.0.0
   GEMINI_API_KEY=your_gemini_key
   SMITHERY_API_TOKEN=your_smithery_token
   OPENWEATHER_API_KEY=your_weather_key
   TAVILY_API_KEY=your_tavily_key
   GMAIL_ADDRESS=your_email
   GMAIL_APP_PASSWORD=your_app_password
   GOOGLE_SHEETS_ID=your_sheets_id
   GOOGLE_SHEETS_API_KEY=your_sheets_api_key
   RESEND_API_KEY=your_resend_key
   ```
7. Deploy and note the URL (e.g., `https://modumentor-agent.onrender.com`)

**Alternative: Railway.app**
- Similar setup, select Python environment
- Set environment variables
- Deploy

---

### Step 2: Deploy Node.js Server to Render or Railway (NOT Netlify)

The Node.js server (`server/index_remote.js`) must be deployed to a platform that supports long-running Node.js applications:

**Recommended: Render.com**
1. Go to https://render.com
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository (the one with the `server` folder)
5. Configure:
   - **Name:** `modumentor-server`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && node index_remote.js`
   - **Root Directory:** Leave empty or set to `server`
6. Set Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   AGENTIC_SERVER_URL=https://modumentor-agent.onrender.com
   AGENTIC_TIMEOUT=30000
   ```
   **Important:** Use the Render/Railway URL for the agent, NOT the Netlify URL!

7. Deploy and note the URL (e.g., `https://modumentor-server.onrender.com`)

---

### Step 3: Update Client Environment Variables

In your **Netlify client site** settings:

1. Go to **Site settings** → **Environment variables**
2. Update/Add:
   ```
   REACT_APP_API_URL=https://modumentor-server.onrender.com
   REACT_APP_SOCKET_URL=https://modumentor-server.onrender.com
   ```
   (Replace with your actual Render/Railway URL)
3. **Trigger a new deployment** (Environment variables require redeploy)

---

### Step 4: Update CORS Settings

In `server/index_remote.js`, update CORS to allow your Netlify client:

```javascript
app.use(cors({
  origin: [
    'https://your-client-site.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Also update Socket.IO CORS:
```javascript
const io = socketIo(server, {
  cors: {
    origin: [
      'https://your-client-site.netlify.app',
      'http://localhost:3000'
    ],
    methods: ["GET", "POST"]
  }
});
```

---

### Step 5: Redeploy All Services

1. Redeploy the agent on Render/Railway (after setting environment variables)
2. Redeploy the server on Render/Railway (after updating AGENTIC_SERVER_URL)
3. Redeploy the client on Netlify (after updating env vars)

## What I Fixed in the Code

✅ **Updated `client/src/App.js`:**
- All API calls now use `REACT_APP_API_URL` environment variable
- Fixed endpoint paths to match server routes:
  - `/api/help` - GET (with query params)
  - `/api/tools` - GET
  - `/api/analyze` - POST
  - All other endpoints updated correctly

✅ **Added `/api/config` endpoint to `server/index_remote.js`:**
- This endpoint was missing but needed by the client

✅ **Added root `/` endpoint to `agent/agentic_server.py`:**
- Provides service information and available endpoints
- Helps with debugging and health checks

## Architecture Overview

```
┌─────────────────────┐
│   Netlify (Client)  │
│   React Frontend    │
│                     │
│  REACT_APP_API_URL  │
│  points to ────────┼──┐
└─────────────────────┘  │
                         │
                         ▼
              ┌──────────────────────┐
              │  Render/Railway      │
              │  Node.js Server      │
              │  (index_remote.js)   │
              │                      │
              │  AGENTIC_SERVER_URL  │
              │  points to ──────────┼──┐
              └──────────────────────┘  │
                                        │
                                        ▼
                           ┌──────────────────────┐
                           │  Render/Railway      │
                           │  Python Agent        │
                           │  (agentic_server.py) │
                           └──────────────────────┘
```

**Important:** 
- ✅ **Netlify:** Only for React client (static site)
- ✅ **Render/Railway:** For both Node.js server AND Python agent
- ❌ **NOT Netlify:** Neither server nor agent should be on Netlify

## Quick Checklist

- [ ] **Agent deployed to Render/Railway**
- [ ] Agent URL obtained (e.g., `https://modumentor-agent.onrender.com`)
- [ ] Agent environment variables set (API keys, etc.)
- [ ] **Server deployed to Render/Railway**
- [ ] Server URL obtained (e.g., `https://modumentor-server.onrender.com`)
- [ ] Server's `AGENTIC_SERVER_URL` points to Render/Railway agent URL (NOT Netlify)
- [ ] Client environment variables updated in Netlify
- [ ] Client's `REACT_APP_API_URL` points to Render/Railway server URL (NOT Netlify)
- [ ] CORS settings updated in server code
- [ ] All three services redeployed
- [ ] Test API calls from client

## Testing

After deployment, test:
1. Visit your Netlify client site
2. Open browser DevTools → Network tab
3. Try sending a message
4. Check that API calls go to your Render/Railway server (not Netlify)
5. Verify no more 404 errors

## Additional Notes

- Netlify Functions could work but require significant refactoring
- Render/Railway is the recommended approach for Node.js Express servers
- The server URL from Render/Railway should be used in all client environment variables
