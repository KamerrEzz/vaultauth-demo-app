# VaultAuth Demo App

A minimal, dependency-free demo showing how any third-party application can integrate **VaultAuth** as its OAuth 2.0 / OIDC provider — the same pattern you'd use for "Login with Google" or "Login with GitHub".

> **No auth libraries.** Just `fetch`, Node's built-in `crypto`, and Next.js cookies.

## What this demonstrates

- Full Authorization Code flow with **PKCE** (S256)
- **State parameter** validation to prevent CSRF
- Server-side **token exchange** (access token never touches the browser)
- **UserInfo** claim fetching
- **httpOnly session cookie** for the authenticated session
- Clean logout

## Architecture

```
Browser                    Demo App (port 3002)          VaultAuth (port 3000)
   │                              │                              │
   │── click "Login" ──────────►  │                              │
   │                              │ generate PKCE + state        │
   │                              │ store in httpOnly cookie     │
   │◄── redirect ─────────────────│                              │
   │                                                             │
   │── GET /oauth/authorize ──────────────────────────────────►  │
   │◄── redirect /callback?code=...&state=... ─────────────────  │
   │                                                             │
   │── GET /callback ──────────►  │                              │
   │                              │ validate state               │
   │                              │── POST /oauth/token ───────► │
   │                              │◄── { access_token } ──────── │
   │                              │── GET /oauth/userinfo ─────► │
   │                              │◄── { sub, email, name } ──── │
   │                              │ set session cookie           │
   │◄── redirect / ───────────────│                              │
```

## Setup

### 1. Clone and install

```bash
git clone https://github.com/KamerrEzz/vaultauth-demo-app
cd vaultauth-demo-app
npm install
```

### 2. Register your app in VaultAuth

1. Open the VaultAuth developer portal: **http://localhost:3001/developer**
2. Click **"New Application"**
3. Fill in:
   - **Name**: `VaultAuth Demo App` (or anything)
   - **Redirect URI**: `http://localhost:3002/callback`
4. Copy the **Client ID** (and optionally the **Client Secret**)

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VAULTAUTH_URL=http://localhost:3000
VAULTAUTH_CLIENT_ID=<paste your client_id here>
VAULTAUTH_CLIENT_SECRET=          # optional if using PKCE only
NEXT_PUBLIC_APP_URL=http://localhost:3002
VAULTAUTH_REDIRECT_URI=http://localhost:3002/callback
```

### 4. Start VaultAuth

Make sure VaultAuth is running:
- Backend (NestJS): **http://localhost:3000**
- Frontend (Next.js): **http://localhost:3001**

### 5. Run the demo app

```bash
npm run dev
```

Open **http://localhost:3002** in your browser.

## OAuth Endpoints Used

| Endpoint | Description |
|---|---|
| `GET /oauth/authorize` | Starts the flow — redirects user to login |
| `POST /oauth/token` | Exchanges authorization code for tokens |
| `GET /oauth/userinfo` | Returns user claims with Bearer token |
| `GET /.well-known/openid-configuration` | OIDC discovery (for reference) |

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── login/route.ts        # Generates PKCE, redirects to VaultAuth
│   │   └── logout/route.ts       # Clears session cookie
│   ├── callback/
│   │   └── page.tsx              # Handles OAuth callback (Server Component)
│   ├── layout.tsx
│   ├── page.tsx                  # Home — landing or logged-in view
│   └── page.module.css
└── lib/
    ├── pkce.ts                   # PKCE + state generation (Node crypto)
    └── session.ts                # Session cookie encode/decode
```

## PKCE Implementation

```ts
import { randomBytes, createHash } from 'crypto'

const verifier = randomBytes(32).toString('base64url')
const challenge = createHash('sha256').update(verifier).digest('base64url')
```

The `verifier` is stored in an `httpOnly` cookie before the redirect. After the callback, it's sent to the token endpoint to prove the flow wasn't hijacked.

## Security Notes

- The `access_token` is **never sent to the browser** — all token handling is server-side.
- The `state` parameter is validated on callback to prevent CSRF attacks.
- Session data is stored in an `httpOnly`, `SameSite=Lax` cookie (base64-encoded JSON).
- In production, set `secure: true` on cookies (handled automatically when `NODE_ENV=production`).

## Scripts

```bash
npm run dev    # Start dev server on port 3002
npm run build  # Build for production
npm start      # Start production server on port 3002
```
