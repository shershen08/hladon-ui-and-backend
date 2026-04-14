'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

type NavLink = { href: string; label: string }

export function MobileMenu({
  links,
  email,
}: {
  links: NavLink[]
  email?: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  function close() { setOpen(false) }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    close()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 top-14 bg-black/20 z-40"
            onClick={close}
          />
          {/* drawer */}
          <div className="fixed top-14 left-0 right-0 z-50 bg-background border-b shadow-lg px-6 py-5 flex flex-col gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="py-2.5 text-sm font-medium text-foreground border-b border-border/50 last:border-0"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-1">
              {email ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground truncate">{email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors ml-4 shrink-0"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={close}
                  className="text-sm font-medium text-primary"
                >
                  Войти
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
