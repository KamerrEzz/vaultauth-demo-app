# VaultAuth Demo App

A developer demo showing how any third-party application can integrate **VaultAuth** as its OAuth 2.0 / OIDC identity provider — the same pattern you'd use for "Login with Google" or "Login with GitHub."

Built with **Next.js 15**, **React 19**, **NextAuth v5 (Auth.js)**, **shadcn/ui**, and **Tailwind CSS v4**.

---

## What this demonstrates

- Full Authorization Code flow with **PKCE** (S256) via NextAuth v5
- Custom OAuth provider pointing to VaultAuth (self-hosted)
- **`client_secret_basic`** authentication at the token endpoint (HTTP Basic auth header — NextAuth default)
- Server-side session via Auth.js — access token never touches the browser
- OIDC userinfo claim fetching (`openid profile email`) — no `id_token` parsing needed
- Dark, developer-focused UI with shadcn/ui components

---

## Prerequisites

| Service | Port | Repo |
|---|---|---|
| VaultAuth Backend (NestJS) | 3000 | [nest-auth-hybrid](https://github.com/KamerrEzz/nest-auth-hybrid) |
| VaultAuth Frontend (Next.js) | 3001 | [next-auth-hybrid](https://github.com/KamerrEzz/next-auth-hybrid) |
| This demo app | 3002 | — |

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/KamerrEzz/vaultauth-demo-app
cd vaultauth-demo-app
npm install
```

### 2. Start VaultAuth

```bash
# Backend (Docker)
cd ../nest-auth-hybrid
docker compose up --build -d

# Frontend
cd ../next-auth-hybrid
npm run dev
```

### 3. Register your app in VaultAuth

1. Open the developer portal: **http://localhost:3001/developer**
2. Click **"Nueva aplicación"**
3. Set **Redirect URI** to exactly:
   ```
   http://localhost:3002/api/auth/callback/vaultauth
   ```
4. Select scopes: `openid`, `profile`, `email`
5. Copy the **Client ID** and **Client Secret** (shown only once)

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# VaultAuth OAuth Provider (NestJS backend)
VAULTAUTH_URL=http://localhost:3000
VAULTAUTH_CLIENT_ID=<your-client-id>
VAULTAUTH_CLIENT_SECRET=<your-client-secret>

# This demo app's public URL
NEXT_PUBLIC_APP_URL=http://localhost:3002

# NextAuth v5 required vars
AUTH_URL=http://localhost:3002
# Generate with: openssl rand -base64 32
AUTH_SECRET=<random-secret>

# Must match exactly what you registered in VaultAuth developer portal
VAULTAUTH_REDIRECT_URI=http://localhost:3002/callback
```

### 5. Run the demo

```bash
npm run dev
```

Open **http://localhost:3002** in your browser.

---

## How the flow works

```
Browser                  Demo App (port 3002)         VaultAuth (port 3000)
   │                            │                              │
   │── click "Sign in" ────────►│                              │
   │◄── redirect ───────────────│  NextAuth generates PKCE     │
   │                                                           │
   │── GET /oauth/authorize ─────────────────────────────────►│
   │      ?client_id=...&code_challenge=...                    │
   │                                                           │
   │  [VaultAuth checks session; redirects to /login if needed]│
   │  [user sees consent screen, approves]                     │
   │                                                           │
   │◄── redirect /api/auth/callback/vaultauth?code=... ───────│
   │                                                           │
   │── GET /api/auth/callback ──►│                             │
   │                             │── POST /oauth/token ──────►│
   │                             │   Authorization: Basic ...  │
   │                             │◄── { access_token } ───────│
   │                             │── GET /oauth/userinfo ─────►│
   │                             │◄── { sub, email, name } ───│
   │                             │   set httpOnly session      │
   │◄── redirect / ─────────────│                             │
```

---

## VaultAuth OAuth Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/oauth/authorize` | GET | Authorization endpoint — starts the flow |
| `/oauth/token` | POST | Token exchange — code → access_token |
| `/oauth/userinfo` | GET | User claims (Bearer token required) |
| `/oauth/revoke` | POST | Revoke access or refresh token (RFC 7009) |
| `/oauth/introspect` | POST | Token introspection (RFC 7662) |
| `/.well-known/openid-configuration` | GET | OIDC Discovery document |
| `/.well-known/jwks.json` | GET | Public key set (JWKS) |

Issuer: `http://localhost:3000`  
Scopes: `openid`, `profile`, `email`, `notes`  
Token auth methods: `client_secret_basic`, `client_secret_post`, `none` (PKCE)

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
│   ├── page.tsx                 # / — landing or authenticated profile view
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

---

## Troubleshooting

**`client_id must be a string` error from VaultAuth backend**  
Make sure your VaultAuth backend is on v0.2.1+. Earlier versions required credentials in the request body; the current version accepts `Authorization: Basic` (NextAuth default).

**`unexpected JWT 'alg' header parameter` (HS256 vs RS256)**  
Make sure your VaultAuth backend is on v0.2.1+. Earlier versions returned an `id_token` signed with HS256 in the token response. The current version omits `id_token` and lets NextAuth fetch user claims from `/oauth/userinfo` instead.

**Redirect back to login after first sign-in attempt**  
Make sure your VaultAuth frontend is on v0.3.1+. Earlier versions had the `useMe` hook always redirecting to `/login` on 401 responses, which interfered with the OAuth consent page load.

**Credentials stopped working after restarting VaultAuth**  
If you ran `docker compose down` and re-seeded the database, the `client_id` and `client_secret` change. Re-register your app in the developer portal and update `.env.local`.
