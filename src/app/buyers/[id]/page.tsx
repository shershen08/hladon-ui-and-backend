import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { getBuyer, getThreadsByBuyer } from '@/lib/data/buyers'
import { getCompany } from '@/lib/data/companies'
import { Badge } from '@/components/ui/badge'
import { ThreadView } from '@/components/buyers/thread-view'
import { ArrowLeft, Building2 } from 'lucide-react'

export default async function BuyerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/login?next=/buyers')

  const { id } = await params
  const buyer = await getBuyer(id)
  if (!buyer) notFound()

  const [threads, company] = await Promise.all([
    getThreadsByBuyer(id),
    getCompany(buyer.companyId),
  ])

  return (
    <main className="max-w-4xl mx-auto w-full px-6 py-8">
      <Link
        href="/buyers"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Все покупатели
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {buyer.initials}
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">{buyer.name}</h1>
          {company && (
            <Link
              href={`/companies/${company.id}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Building2 className="size-3.5" />
              {company.name}
            </Link>
          )}
        </div>
      </div>

      {threads.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Нет переписок с этим покупателем
        </p>
      ) : (
        <ThreadView threads={threads} buyerName={buyer.name} />
      )}
    </main>
  )
}
