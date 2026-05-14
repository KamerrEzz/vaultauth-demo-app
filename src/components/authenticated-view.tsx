"use client"

import type { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VaultIcon } from "@/components/vault-icon"

interface AuthenticatedViewProps {
  session: Session
}

export function AuthenticatedView({ session }: AuthenticatedViewProps) {
  const user = session.user
  const name = user?.name ?? user?.email ?? "User"
  const email = user?.email ?? ""

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const expiresAt = session.expires
    ? new Date(session.expires).toLocaleString()
    : null

  return (
    <main className="min-h-screen bg-grid flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, oklch(0.68 0.20 264 / 10%) 0%, transparent 70%)",
        }}
      />

      {/* nav bar */}
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border/40"
        style={{ background: "oklch(0.10 0.005 264 / 90%)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2">
          <VaultIcon size={20} />
          <span className="text-sm font-semibold tracking-tight text-foreground/80">
            VaultAuth Demo
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full pulse-dot"
            style={{ background: "oklch(0.75 0.18 145)" }}
          />
          <span className="text-xs text-muted-foreground">Authenticated</span>
        </div>
      </header>

      {/* profile card */}
      <Card
        className="w-full max-w-md border-border/50 animate-fade-up relative z-0"
        style={{
          background: "oklch(0.12 0.006 264)",
          boxShadow:
            "0 0 0 1px oklch(1 0 0 / 8%), 0 30px 80px oklch(0 0 0 / 60%), 0 0 60px oklch(0.68 0.20 264 / 8%)",
        }}
      >
        <CardHeader className="pb-0 pt-8 px-8">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar
              className="w-14 h-14 text-lg font-bold shrink-0"
              style={{
                background: "oklch(0.68 0.20 264 / 20%)",
                border: "2px solid oklch(0.68 0.20 264 / 40%)",
                boxShadow: "0 0 16px oklch(0.68 0.20 264 / 20%)",
              }}
            >
              <AvatarFallback
                style={{
                  background: "transparent",
                  color: "oklch(0.68 0.20 264)",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name + status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold tracking-tight truncate">
                  {name}
                </h2>
                <Badge
                  className="text-xs px-2 py-0 h-5 font-mono"
                  style={{
                    background: "oklch(0.75 0.18 145 / 15%)",
                    color: "oklch(0.75 0.18 145)",
                    border: "1px solid oklch(0.75 0.18 145 / 30%)",
                  }}
                >
                  verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {email}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-8 px-8 space-y-6">
          <Separator className="opacity-50" />

          {/* Detail rows */}
          <div className="space-y-3">
            <DetailRow label="Provider" value="VaultAuth" accent />
            <DetailRow label="Email" value={email} />
            {user?.id && (
              <DetailRow label="User ID" value={user.id} mono dimmed />
            )}
            {expiresAt && (
              <DetailRow label="Session expires" value={expiresAt} dimmed />
            )}
          </div>

          <Separator className="opacity-50" />

          {/* Session note */}
          <div
            className="rounded-lg p-3 text-xs leading-relaxed font-mono"
            style={{
              background: "oklch(0.15 0.008 264)",
              border: "1px solid oklch(1 0 0 / 6%)",
              color: "oklch(0.50 0.012 264)",
            }}
          >
            <span style={{ color: "oklch(0.68 0.20 264 / 80%)" }}>// </span>
            Session stored in a{" "}
            <span style={{ color: "oklch(0.80 0.15 210)" }}>httpOnly</span>{" "}
            cookie via NextAuth v5.
            <br />
            <span style={{ color: "oklch(0.68 0.20 264 / 80%)" }}>// </span>
            Access token never exposed to the browser.
          </div>

          {/* Sign out */}
          <Button
            variant="outline"
            className="w-full h-10 font-mono text-sm tracking-wide border-border/60 hover:border-border transition-all"
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ background: "transparent" }}
          >
            Sign out
          </Button>
        </CardContent>
      </Card>

      {/* bottom label */}
      <p className="mt-6 text-xs text-muted-foreground animate-fade-up delay-300 relative z-0"
        style={{ color: "oklch(0.35 0.008 264)" }}
      >
        OAuth 2.0 + PKCE + OIDC via VaultAuth
      </p>
    </main>
  )
}

function DetailRow({
  label,
  value,
  accent = false,
  mono = false,
  dimmed = false,
}: {
  label: string
  value: string
  accent?: boolean
  mono?: boolean
  dimmed?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className="text-xs shrink-0"
        style={{ color: "oklch(0.45 0.010 264)" }}
      >
        {label}
      </span>
      <span
        className={`text-sm text-right truncate ${mono ? "font-mono text-xs" : ""}`}
        style={{
          color: accent
            ? "oklch(0.68 0.20 264)"
            : dimmed
            ? "oklch(0.50 0.010 264)"
            : "oklch(0.85 0.005 264)",
        }}
      >
        {value}
      </span>
    </div>
  )
}
