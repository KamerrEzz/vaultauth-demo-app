import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { encodeSession, SESSION_COOKIE_NAME } from '@/lib/session'

export const runtime = 'nodejs'

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  id_token?: string
  scope?: string
}

interface UserInfo {
  sub: string
  email: string
  name?: string
  picture?: string
  email_verified?: boolean
}

interface CallbackPageProps {
  searchParams: Promise<{ code?: string; state?: string; error?: string; error_description?: string }>
}

export default async function CallbackPage({ searchParams }: CallbackPageProps) {
  const params = await searchParams
  const cookieStore = await cookies()

  // Handle OAuth errors from the provider
  if (params.error) {
    return <ErrorPage error={params.error} description={params.error_description} />
  }

  const { code, state } = params

  if (!code || !state) {
    return <ErrorPage error="invalid_request" description="Missing code or state parameter." />
  }

  // Validate state to prevent CSRF
  const storedState = cookieStore.get('oauth_state')?.value
  if (!storedState || storedState !== state) {
    return <ErrorPage error="state_mismatch" description="OAuth state mismatch. Possible CSRF attack." />
  }

  const verifier = cookieStore.get('oauth_verifier')?.value
  if (!verifier) {
    return <ErrorPage error="missing_verifier" description="PKCE code verifier not found. Please try logging in again." />
  }

  const vaultAuthUrl = process.env.VAULTAUTH_URL
  const clientId = process.env.VAULTAUTH_CLIENT_ID
  const clientSecret = process.env.VAULTAUTH_CLIENT_SECRET
  const redirectUri = process.env.VAULTAUTH_REDIRECT_URI

  if (!vaultAuthUrl || !clientId || !redirectUri) {
    return <ErrorPage error="config_error" description="Server is misconfigured. Missing environment variables." />
  }

  // Exchange authorization code for tokens (server-side, never exposed to browser)
  let tokenData: TokenResponse
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
    })

    if (clientSecret) {
      body.set('client_secret', clientSecret)
    }

    const tokenRes = await fetch(`${vaultAuthUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      return <ErrorPage error="token_exchange_failed" description={`Token endpoint returned ${tokenRes.status}: ${err}`} />
    }

    tokenData = (await tokenRes.json()) as TokenResponse
  } catch (err) {
    return (
      <ErrorPage
        error="network_error"
        description={`Could not reach VaultAuth token endpoint. Is it running at ${vaultAuthUrl}? ${err instanceof Error ? err.message : ''}`}
      />
    )
  }

  // Fetch user info with the access token (server-side)
  let userInfo: UserInfo
  try {
    const userRes = await fetch(`${vaultAuthUrl}/oauth/userinfo`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    if (!userRes.ok) {
      const err = await userRes.text()
      return <ErrorPage error="userinfo_failed" description={`Userinfo endpoint returned ${userRes.status}: ${err}`} />
    }

    userInfo = (await userRes.json()) as UserInfo
  } catch (err) {
    return (
      <ErrorPage
        error="userinfo_network_error"
        description={`Could not reach VaultAuth userinfo endpoint. ${err instanceof Error ? err.message : ''}`}
      />
    )
  }

  // Build session response — redirect to home with session cookie set
  // We use a Response + headers trick: since we're in a Server Component,
  // we need to set cookies via the cookies() API before redirect.
  // Next.js 15 allows setting cookies in Server Components via cookies().set()
  const cookieStoreForWrite = await cookies()

  cookieStoreForWrite.set(SESSION_COOKIE_NAME, encodeSession(userInfo), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  // Clean up PKCE / state cookies
  cookieStoreForWrite.delete('oauth_state')
  cookieStoreForWrite.delete('oauth_verifier')

  redirect('/')
}

function ErrorPage({ error, description }: { error: string; description?: string }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0f', fontFamily: 'system-ui, sans-serif', color: '#e2e8f0' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            style={{
              background: '#13131a',
              border: '1px solid #3d1515',
              borderRadius: '12px',
              padding: '2.5rem',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ margin: '0 0 0.5rem', color: '#fc8181', fontSize: '1.25rem' }}>Authentication Failed</h1>
            <p style={{ color: '#718096', fontFamily: 'monospace', fontSize: '0.875rem', margin: '0 0 1rem' }}>
              {error}
            </p>
            {description && (
              <p style={{ color: '#a0aec0', fontSize: '0.875rem', margin: '0 0 1.5rem', lineHeight: '1.6' }}>
                {description}
              </p>
            )}
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.625rem 1.5rem',
                background: '#1a1a2e',
                color: '#818cf8',
                border: '1px solid #3730a3',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
