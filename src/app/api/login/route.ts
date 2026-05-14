import { NextResponse } from 'next/server'
import { generatePKCE, generateState } from '@/lib/pkce'

export const runtime = 'nodejs'

export async function GET() {
  const vaultAuthUrl = process.env.VAULTAUTH_URL
  const clientId = process.env.VAULTAUTH_CLIENT_ID
  const redirectUri = process.env.VAULTAUTH_REDIRECT_URI

  if (!vaultAuthUrl || !clientId || !redirectUri) {
    return NextResponse.json(
      {
        error: 'Missing environment variables',
        hint: 'Set VAULTAUTH_URL, VAULTAUTH_CLIENT_ID, and VAULTAUTH_REDIRECT_URI in .env.local',
      },
      { status: 500 }
    )
  }

  const { verifier, challenge } = generatePKCE()
  const state = generateState()

  // Build the authorization URL
  const authorizeUrl = new URL(`${vaultAuthUrl}/oauth/authorize`)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('client_id', clientId)
  authorizeUrl.searchParams.set('redirect_uri', redirectUri)
  authorizeUrl.searchParams.set('scope', 'openid profile email')
  authorizeUrl.searchParams.set('state', state)
  authorizeUrl.searchParams.set('code_challenge', challenge)
  authorizeUrl.searchParams.set('code_challenge_method', 'S256')

  // Store PKCE verifier + state in a short-lived httpOnly cookie
  const response = NextResponse.redirect(authorizeUrl.toString())

  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  response.cookies.set('oauth_verifier', verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  return response
}
