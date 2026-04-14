import { NextResponse } from 'next/server'
import { verifyCredentials, createSession } from '@/lib/session'

export async function POST(req: Request) {
  if (!process.env.SESSION_SECRET) {
    console.error('SESSION_SECRET env variable is not set')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  }

  const user = verifyCredentials(username, password)

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  await createSession(user.id, user.username)

  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username, name: user.name } })
}
