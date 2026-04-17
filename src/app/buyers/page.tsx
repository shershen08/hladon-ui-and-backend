import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getBuyers, getAllThreads } from '@/lib/data/buyers'
import { getCompanies } from '@/lib/data/companies'
import { PageContainer } from '@/components/layout/page-container'
import { Badge } from '@/components/ui/badge'
import { StatusFilter } from '@/components/buyers/status-filter'
import type { BuyerThread } from '@/types'

const THREAD_STATUS_LABEL: Record<BuyerThread['status'], string> = {
  awaiting_response: 'Ожидается ответ',
  deal_agreed: 'Сделка согласована',
  follow_up: 'Напомнить о себе',
  archive: 'Архив',
}

const THREAD_STATUS_VARIANT: Record<BuyerThread['status'], 'default' | 'secondary' | 'outline'> = {
  awaiting_response: 'default',
  deal_agreed: 'secondary',
  follow_up: 'outline',
  archive: 'outline',
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/login?next=/buyers')

  const { status: filterStatus } = await searchParams

  const [buyers, allThreads, companies] = await Promise.all([
    getBuyers(),
    getAllThreads(),
    getCompanies(),
  ])

  const companyMap = new Map(companies.map(c => [c.id, c]))

  const statusCounts: Record<string, number> = {
    awaiting_response: 0,
    deal_agreed: 0,
    follow_up: 0,
    archive: 0,
  }
  for (const t of allThreads) statusCounts[t.status]++

  const filteredThreads = filterStatus
    ? allThreads.filter(t => t.status === filterStatus)
    : allThreads

  const buyerIds = new Set(filteredThreads.map(t => t.buyerId))
  const filteredBuyers = filterStatus
    ? buyers.filter(b => buyerIds.has(b.id))
    : buyers

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Покупатели</h1>
        <p className="text-muted-foreground mt-1">
          Переписка с покупателями по закупкам хладагентов
        </p>
      </div>

      <StatusFilter
        current={filterStatus ?? null}
        counts={statusCounts}
      />

      <div className="mt-5 grid gap-2">
        {filteredBuyers.map(buyer => {
          const company = companyMap.get(buyer.companyId)
          const buyerThreads = filteredThreads.filter(t => t.buyerId === buyer.id)
          const latestThread = buyerThreads[0]

          return (
            <Link
              key={buyer.id}
              href={`/buyers/${buyer.id}`}
              className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card px-4 py-3 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {buyer.initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {buyer.name}
                  </span>
                  {company && (
                    <span className="text-sm text-muted-foreground">
                      · {company.name}
                    </span>
                  )}
                </div>

                {latestThread && (
                  <p className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={THREAD_STATUS_VARIANT[latestThread.status]} className="shrink-0">
                      {THREAD_STATUS_LABEL[latestThread.status]}
                    </Badge>
                    <span className="truncate">{latestThread.subject}</span>
                  </p>
                )}
              </div>

              <span className="shrink-0 text-xs text-muted-foreground/60">
                {formatDate(buyer.lastActivity)}
              </span>
            </Link>
          )
        })}

        {filteredBuyers.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">
            Нет покупателей с таким статусом
          </p>
        )}
      </div>
    </PageContainer>
  )
}
