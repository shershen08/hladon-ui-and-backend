'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton({ email }: { email: string }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-muted-foreground">{email}</span>
      <button
        onClick={handleLogout}
        className="font-medium text-primary hover:text-primary/80 transition-colors"
      >
        Выйти
      </button>
    </div>
  )
}
