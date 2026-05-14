import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VaultIcon } from "@/components/vault-icon"

export function LandingView() {
  return (
    <div className="min-h-screen bg-grid relative overflow-x-hidden">
      {/* ── ambient glow ──────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 10%, oklch(0.68 0.20 264 / 12%) 0%, transparent 60%)",
        }}
      />

      {/* ── nav ───────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-border/40"
        style={{
          background: "oklch(0.10 0.005 264 / 85%)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <VaultIcon size={22} />
          <span className="font-semibold text-sm tracking-tight">
            VaultAuth
            <span style={{ color: "oklch(0.68 0.20 264)" }}> Demo</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className="font-mono text-xs px-2.5 hidden sm:flex"
            style={{
              background: "oklch(0.68 0.20 264 / 10%)",
              color: "oklch(0.68 0.20 264)",
              border: "1px solid oklch(0.68 0.20 264 / 25%)",
            }}
          >
            OAuth 2.0 + PKCE
          </Badge>
          <Link href="/login">
            <Button
              size="sm"
              className="font-mono text-xs h-8 px-4"
              style={{
                background: "oklch(0.68 0.20 264)",
                color: "oklch(0.10 0.005 264)",
                boxShadow: "0 0 16px oklch(0.68 0.20 264 / 25%)",
              }}
            >
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── hero ──────────────────────────────────────────── */}
      <section className="relative px-6 pt-24 pb-20 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* badge */}
        <div className="animate-fade-up mb-8">
          <Badge
            className="font-mono text-xs px-4 py-1.5 gap-2"
            style={{
              background: "oklch(0.68 0.20 264 / 10%)",
              color: "oklch(0.68 0.20 264)",
              border: "1px solid oklch(0.68 0.20 264 / 25%)",
              boxShadow: "0 0 20px oklch(0.68 0.20 264 / 10%)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ background: "oklch(0.68 0.20 264)" }}
            />
            openid profile email · Authorization Code + PKCE
          </Badge>
        </div>

        {/* icon */}
        <div className="animate-fade-up delay-100 mb-8 relative">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.68 0.20 264 / 25%) 0%, transparent 65%)",
              transform: "scale(3)",
            }}
          />
          <div
            className="relative flex items-center justify-center w-24 h-24 rounded-3xl mx-auto"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.14 0.010 264), oklch(0.18 0.014 264))",
              border: "1px solid oklch(0.68 0.20 264 / 35%)",
              boxShadow:
                "0 0 0 1px oklch(0.68 0.20 264 / 10%), 0 0 40px oklch(0.68 0.20 264 / 20%)",
            }}
          >
            <VaultIcon size={52} />
          </div>
        </div>

        {/* headline */}
        <h1
          className="animate-fade-up delay-200 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-4"
        >
          Authenticate with{" "}
          <span className="shimmer">VaultAuth</span>
        </h1>

        {/* subheadline */}
        <p
          className="animate-fade-up delay-300 text-base sm:text-lg max-w-xl leading-relaxed mb-10"
          style={{ color: "oklch(0.55 0.012 264)" }}
        >
          VaultAuth is a custom OAuth 2.0 / OIDC identity provider. This demo
          shows how any third-party app can use it as its auth layer — the same
          way you&apos;d use &ldquo;Login with Google.&rdquo;
        </p>

        {/* CTA */}
        <div className="animate-fade-up delay-400 flex flex-col sm:flex-row gap-3 items-center">
          <Link href="/login">
            <Button
              size="lg"
              className="h-12 px-8 gap-3 font-mono text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "oklch(0.68 0.20 264)",
                color: "oklch(0.10 0.005 264)",
                boxShadow:
                  "0 0 0 1px oklch(0.68 0.20 264 / 30%), 0 0 30px oklch(0.68 0.20 264 / 30%), 0 4px 20px oklch(0 0 0 / 40%)",
              }}
            >
              <VaultIcon size={20} />
              Login with VaultAuth
            </Button>
          </Link>
          <span
            className="text-xs font-mono"
            style={{ color: "oklch(0.38 0.010 264)" }}
          >
            Redirect → Consent → Access
          </span>
        </div>
      </section>

      {/* ── 3-step flow diagram ───────────────────────────── */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="animate-fade-up delay-500 text-center mb-12">
          <h2
            className="text-xs font-mono tracking-[0.2em] uppercase mb-3"
            style={{ color: "oklch(0.45 0.012 264)" }}
          >
            The OAuth flow
          </h2>
          <p className="text-2xl font-bold tracking-tight">
            Three steps to authenticated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up delay-600">
          <FlowCard
            step="01"
            title="Redirect"
            description="Your app sends the user to VaultAuth's authorization endpoint with a PKCE code challenge, state, and requested scopes."
            code={`GET /oauth/authorize\n  ?response_type=code\n  &client_id=<id>\n  &code_challenge=<S256>\n  &scope=openid profile email`}
            accent="blue"
          />
          <FlowCard
            step="02"
            title="Consent"
            description="VaultAuth authenticates the user and issues a one-time authorization code. The user is redirected back to your callback URL."
            code={`GET /api/auth/callback\n  ?code=<one-time-code>\n  &state=<verified-state>`}
            accent="cyan"
          />
          <FlowCard
            step="03"
            title="Access"
            description="Your server exchanges the code + code verifier for tokens, then calls /oauth/userinfo. Session is established server-side."
            code={`POST /oauth/token\n→ access_token (JWT)\n→ id_token (OIDC)\n\nGET /oauth/userinfo\n→ { sub, name, email }`}
            accent="green"
          />
        </div>
      </section>

      {/* ── Endpoint reference ────────────────────────────── */}
      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-xs font-mono tracking-[0.2em] uppercase mb-3"
            style={{ color: "oklch(0.45 0.012 264)" }}
          >
            Endpoints
          </h2>
          <p className="text-xl font-bold tracking-tight">
            VaultAuth API surface
          </p>
        </div>

        <Card
          className="border-border/50"
          style={{
            background: "oklch(0.12 0.006 264)",
            boxShadow: "0 0 0 1px oklch(1 0 0 / 6%), 0 20px 60px oklch(0 0 0 / 50%)",
          }}
        >
          <CardContent className="pt-6 pb-6 divide-y divide-border/40">
            <EndpointRow method="GET" path="/oauth/authorize" label="Authorization" />
            <EndpointRow method="POST" path="/oauth/token" label="Token exchange" />
            <EndpointRow method="GET" path="/oauth/userinfo" label="User claims" />
            <EndpointRow method="GET" path="/.well-known/openid-configuration" label="OIDC Discovery" />
          </CardContent>
        </Card>
      </section>

      {/* ── footer ───────────────────────────────────────── */}
      <footer
        className="border-t border-border/40 px-6 py-8 text-center"
        style={{ color: "oklch(0.35 0.008 264)" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <VaultIcon size={16} />
          <span className="text-xs font-mono">VaultAuth Demo App</span>
        </div>
        <p className="text-xs font-mono">
          NextAuth v5 · Next.js · React 19 · shadcn/ui · Tailwind v4
        </p>
      </footer>
    </div>
  )
}

/* ── FlowCard ──────────────────────────────────────────────── */

const accentColors = {
  blue: {
    text: "oklch(0.68 0.20 264)",
    bg: "oklch(0.68 0.20 264 / 8%)",
    border: "oklch(0.68 0.20 264 / 25%)",
  },
  cyan: {
    text: "oklch(0.80 0.15 210)",
    bg: "oklch(0.80 0.15 210 / 8%)",
    border: "oklch(0.80 0.15 210 / 25%)",
  },
  green: {
    text: "oklch(0.75 0.18 145)",
    bg: "oklch(0.75 0.18 145 / 8%)",
    border: "oklch(0.75 0.18 145 / 25%)",
  },
}

function FlowCard({
  step,
  title,
  description,
  code,
  accent,
}: {
  step: string
  title: string
  description: string
  code: string
  accent: keyof typeof accentColors
}) {
  const c = accentColors[accent]
  return (
    <Card
      className="border-border/50 flex flex-col"
      style={{
        background: "oklch(0.12 0.006 264)",
        boxShadow: "0 0 0 1px oklch(1 0 0 / 6%), 0 10px 40px oklch(0 0 0 / 40%)",
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono font-bold px-2 py-1 rounded"
            style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
          >
            {step}
          </span>
        </div>
        <CardTitle className="text-base font-semibold tracking-tight" style={{ color: c.text }}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <p className="text-sm leading-relaxed" style={{ color: "oklch(0.55 0.012 264)" }}>
          {description}
        </p>
        <pre
          className="text-xs font-mono rounded-lg p-3 leading-relaxed overflow-x-auto mt-auto"
          style={{
            background: "oklch(0.09 0.005 264)",
            border: "1px solid oklch(1 0 0 / 6%)",
            color: c.text,
          }}
        >
          {code}
        </pre>
      </CardContent>
    </Card>
  )
}

/* ── EndpointRow ───────────────────────────────────────────── */

function EndpointRow({
  method,
  path,
  label,
}: {
  method: string
  path: string
  label: string
}) {
  const methodColor =
    method === "GET" ? "oklch(0.80 0.15 210)" : "oklch(0.80 0.18 70)"

  return (
    <div className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
      <span
        className="text-xs font-mono font-bold w-12 shrink-0"
        style={{ color: methodColor }}
      >
        {method}
      </span>
      <code
        className="text-sm font-mono flex-1 truncate"
        style={{ color: "oklch(0.80 0.008 264)" }}
      >
        {path}
      </code>
      <span
        className="text-xs font-mono shrink-0 hidden sm:block"
        style={{ color: "oklch(0.45 0.010 264)" }}
      >
        {label}
      </span>
    </div>
  )
}
