import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VaultAuth Demo App',
  description: 'A demo third-party app showing how to integrate VaultAuth as an OAuth 2.0 / OIDC provider.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
