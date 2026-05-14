"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VaultIcon } from "@/components/vault-icon"

export function LoginCard() {
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    await signIn("vaultauth", { callbackUrl: "/" })
  }

  return (
    <Card
      className="w-full max-w-sm border-border/50 animate-fade-up"
      style={{
        background: "oklch(0.12 0.006 264)",
        boxShadow:
          "0 0 0 1px oklch(1 0 0 / 8%), 0 20px 60px oklch(0 0 0 / 60%), 0 0 40px oklch(0.68 0.20 264 / 10%)",
      }}
    >
      <CardHeader className="items-center gap-4 pb-2 pt-8">
        {/* Shield with glow ring */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.68 0.20 264 / 20%) 0%, transparent 70%)",
              transform: "scale(2)",
            }}
          />
          <div
            className="relative flex items-center justify-center w-16 h-16 rounded-2xl"
            style={{
              background: "oklch(0.15 0.010 264)",
              border: "1px solid oklch(0.68 0.20 264 / 30%)",
              boxShadow: "0 0 20px oklch(0.68 0.20 264 / 15%)",
            }}
          >
            <VaultIcon size={36} />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Sign in to continue
          </h1>
          <p className="text-sm text-muted-foreground">
            Authenticate via{" "}
            <span style={{ color: "oklch(0.68 0.20 264)" }}>VaultAuth</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-8 px-6 space-y-4">
        <Button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full h-11 gap-3 font-mono text-sm font-semibold tracking-wide transition-all duration-200"
          style={{
            background: loading
              ? "oklch(0.68 0.20 264 / 60%)"
              : "oklch(0.68 0.20 264)",
            color: "oklch(0.10 0.005 264)",
            boxShadow: loading
              ? "none"
              : "0 0 20px oklch(0.68 0.20 264 / 30%)",
          }}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Redirecting…
            </>
          ) : (
            <>
              <VaultIcon size={18} />
              Sign in with VaultAuth
            </>
          )}
        </Button>

        <div
          className="text-center text-xs text-muted-foreground px-4 leading-relaxed"
          style={{ color: "oklch(0.40 0.008 264)" }}
        >
          You will be redirected to VaultAuth to authenticate.
          <br />
          Authorization Code + PKCE flow.
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <path
        d="M8 2a6 6 0 016 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
