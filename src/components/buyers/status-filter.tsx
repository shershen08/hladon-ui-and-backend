'use client'

import { useRouter, usePathname } from 'next/navigation'

const STATUSES = [
  { key: 'awaiting_response', label: 'Ожидается ответ' },
  { key: 'deal_agreed', label: 'Сделка согласована' },
  { key: 'follow_up', label: 'Напомнить о себе' },
  { key: 'archive', label: 'Архив' },
] as const

interface StatusFilterProps {
  current: string | null
  counts: Record<string, number>
}

export function StatusFilter({ current, counts }: StatusFilterProps) {
  const router = useRouter()
  const pathname = usePathname()

  function select(key: string | null) {
    if (key) {
      router.replace(`${pathname}?status=${key}`)
    } else {
      router.replace(pathname)
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select(null)}
        className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
          !current
            ? 'border-primary/40 bg-primary/10 font-medium text-primary'
            : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
        }`}
      >
        Все ({total})
      </button>
      {STATUSES.map(s => (
        <button
          key={s.key}
          onClick={() => select(s.key)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
            current === s.key
              ? 'border-primary/40 bg-primary/10 font-medium text-primary'
              : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
          }`}
        >
          {s.label} ({counts[s.key] ?? 0})
        </button>
      ))}
    </div>
  )
}
