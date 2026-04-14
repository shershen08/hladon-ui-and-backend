import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// ---------------------------------------------------------------------------
// Mock users — swap for DB lookup when ready
// ---------------------------------------------------------------------------
const MOCK_USERS = [
  { id: 'u-001', username: 'admin@example.com', password: 'admin', name: 'Admin' },
]

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------
const SESSION_COOKIE = 'session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET env variable is not set')
  return new TextEncoder().encode(secret)
}

export type SessionPayload = {
  userId: string
  username: string
}

async function sign(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret())
}

async function verify(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function createSession(userId: string, username: string): Promise<void> {
  const token = await sign({ userId, username })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verify(token)
}

export function verifyCredentials(username: string, password: string) {
  return MOCK_USERS.find(u => u.username === username && u.password === password) ?? null
}
