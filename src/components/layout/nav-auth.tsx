import Link from 'next/link'
import { getSession } from '@/lib/session'
import { LogoutButton } from './logout-button'

export async function NavAuth() {
  const session = await getSession()

  if (session) {
    return <LogoutButton email={session.username} />
  }

  return (
    <Link
      href="/login"
      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
    >
      Войти
    </Link>
  )
}
