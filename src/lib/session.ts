import { cookies } from 'next/headers'

export interface UserSession {
  sub: string
  email: string
  name?: string
  picture?: string
  email_verified?: boolean
}

const SESSION_COOKIE = 'vaultauth_session'

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value
  if (!raw) return null

  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as UserSession
  } catch {
    return null
  }
}

export function encodeSession(user: UserSession): string {
  return Buffer.from(JSON.stringify(user)).toString('base64')
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE
