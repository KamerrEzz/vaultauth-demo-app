import { LoginCard } from "@/components/login-card"

export const metadata = {
  title: "Sign In — VaultAuth Demo",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-grid flex items-center justify-center p-6 relative overflow-hidden">
      {/* ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.68 0.20 264 / 12%) 0%, transparent 70%)",
        }}
      />

      <LoginCard />
    </main>
  )
}
