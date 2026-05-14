import { NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/session'

export const runtime = 'nodejs'

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002')
  )

  response.cookies.delete(SESSION_COOKIE_NAME)

  return response
}
