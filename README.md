# VaultAuth Demo App

A developer demo showing how any third-party application can integrate **VaultAuth** as its OAuth 2.0 / OIDC identity provider — the same pattern you'd use for "Login with Google" or "Login with GitHub."

Built with **Next.js 15**, **React 19**, **NextAuth v5 (Auth.js)**, **shadcn/ui**, and **Tailwind CSS v4**.

---

## What this demonstrates

- Full Authorization Code flow with **PKCE** (S256) via NextAuth v5
- Custom OAuth provider configuration pointing to VaultAuth
- Server-side session via Auth.js (access token never touches the browser)
- OIDC userinfo claim fetching (`openid profile email`)
- Dark, developer-focused UI with shadcn/ui components

---

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
3. Set the **Redirect URI** to exactly:
   ```
   http://localhost:3002/api/auth/callback/vaultauth
   ```
4. Copy the **Client ID** and **Client Secret**

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VAULTAUTH_URL=http://localhost:3000
VAULTAUTH_CLIENT_ID=<your-client-id>
VAULTAUTH_CLIENT_SECRET=<your-client-secret>

# Generate with: openssl rand -base64 32
AUTH_SECRET=<random-secret>
AUTH_URL=http://localhost:3002

NEXT_PUBLIC_APP_URL=http://localhost:3002
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

---

## VaultAuth OAuth Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/oauth/authorize` | GET | Authorization endpoint (starts the flow) |
| `/oauth/token` | POST | Token exchange (code → access_token) |
| `/oauth/userinfo` | GET | User claims (Bearer token required) |
| `/.well-known/openid-configuration` | GET | OIDC Discovery document |

Issuer: `http://localhost:3000`  
Scopes: `openid profile email`  
Token signing: HS256 JWT (access tokens), opaque (refresh tokens)

---

## Architecture

```
Browser                  Demo App (port 3002)         VaultAuth (port 3000)
   │                            │                              │
   │── click "Login" ─────────► │                              │
   │◄── redirect ───────────────│ (NextAuth generates PKCE)    │
   │                                                           │
   │── GET /oauth/authorize ─────────────────────────────────► │
   │◄── redirect /api/auth/callback/vaultauth?code=... ──────  │
   │                                                           │
   │── GET /api/auth/callback ──► │                            │
   │                              │── POST /oauth/token ─────► │
   │                              │◄── { access_token } ─────  │
   │                              │── GET /oauth/userinfo ────► │
   │                              │◄── { sub, email, name } ── │
   │                              │ set httpOnly session cookie │
   │◄── redirect / ──────────────│                             │
```

---

## File Structure

```
auth.ts                          # NextAuth v5 config (custom VaultAuth provider)
src/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts             # NextAuth catch-all route
│   ├── login/
│   │   └── page.tsx             # /login — centered sign-in card
│   ├── layout.tsx               # Root layout with Providers
│   ├── page.tsx                 # / — landing (unauthenticated) or profile (authenticated)
│   ├── providers.tsx            # SessionProvider wrapper
│   └── globals.css              # Tailwind v4 + custom dark theme
└── components/
    ├── vault-icon.tsx           # VaultAuth shield SVG
    ├── login-card.tsx           # Sign-in card (client component)
    ├── landing-view.tsx         # Hero + flow diagram + endpoint reference
    └── authenticated-view.tsx  # User profile card
```

---

## Scripts

```bash
npm run dev    # Start dev server on port 3002
npm run build  # Build for production
npm start      # Start production server on port 3002
```
