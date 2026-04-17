import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import { getCompany } from '@/lib/data/companies'
import { getBuyersByCompany, getThreadsByBuyer } from '@/lib/data/buyers'
import { getProducts } from '@/lib/data/products'
import { getSession } from '@/lib/session'
import { AddContactDialog } from '@/components/companies/add-contact-dialog'
import { EditContactDialog } from '@/components/companies/edit-contact-dialog'
import { AddThreadDialog } from '@/components/companies/add-thread-dialog'
import { MessageSquare } from 'lucide-react'
import type { BuyerThread } from '@/types'

const STATUS_LABEL: Record<BuyerThread['status'], string> = {
  awaiting_response: 'Ожидается ответ',
  deal_agreed: 'Сделка согласована',
  follow_up: 'Напомнить о себе',
  archive: 'Архив',
}

const STATUS_VARIANT: Record<BuyerThread['status'], 'default' | 'secondary' | 'outline'> = {
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

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [company, session] = await Promise.all([getCompany(id), getSession()])

  if (!company) notFound()

  const [buyers, products] = await Promise.all([
    session ? getBuyersByCompany(id) : Promise.resolve([]),
    session ? getProducts() : Promise.resolve([]),
  ])
  const buyersWithThreads = await Promise.all(
    buyers.map(async (buyer) => ({
      buyer,
      threads: await getThreadsByBuyer(buyer.id),
    }))
  )
  const hasConversations = buyersWithThreads.some(b => b.threads.length > 0)
  const productOptions = products.map(p => ({ code: p.code, name: p.name }))

  return (
    <PageContainer>
      <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 md:col-span-7 lg:col-span-7">
      <Link
        href="/companies"
        className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
      >
        ← Все компании
      </Link>

      <h1 className="text-2xl font-bold mt-2 mb-1">{company.name}</h1>
      <Badge variant="secondary" className="mb-6">{company.categoryLabel}</Badge>

      <dl className="space-y-3 text-sm mb-8">
        {company.inn && (
          <div className="flex gap-4">
            <dt className="text-muted-foreground w-24 shrink-0">ИНН</dt>
            <dd>{company.inn}</dd>
          </div>
        )}
        {company.city && (
          <div className="flex gap-4">
            <dt className="text-muted-foreground w-24 shrink-0">Город</dt>
            <dd>{company.city}</dd>
          </div>
        )}
        {company.address && (
          <div className="flex gap-4">
            <dt className="text-muted-foreground w-24 shrink-0">Адрес</dt>
            <dd>{company.address}</dd>
          </div>
        )}
        {company.website && (
          <div className="flex gap-4">
            <dt className="text-muted-foreground w-24 shrink-0">Сайт</dt>
            <dd className="min-w-0">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline break-all"
              >
                {company.website}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {session ? (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Контакты</h2>
            <AddContactDialog companyId={id} />
          </div>
          {company.contacts.length > 0 ? (
            <div className="space-y-4">
              {company.contacts.map((c, i) => (
                <div key={i} className="group relative rounded-lg border p-4 text-sm space-y-1">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <EditContactDialog companyId={id} index={i} contact={c} />
                  </div>
                  {c.name && <p className="font-medium">{c.name}</p>}
                  {c.role && <p className="text-muted-foreground">{c.role}</p>}
                  {c.phone && <p>Тел.: {c.phone}</p>}
                  {c.mobile && <p>Моб.: {c.mobile}</p>}
                  {c.phoneOffice && <p>Офис: {c.phoneOffice}</p>}
                  {c.email && (
                    <p>
                      <a href={`mailto:${c.email}`} className="hover:underline">
                        {c.email}
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              Контактов пока нет
            </p>
          )}
        </section>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
          <p className="mb-3">
            Контактные данные доступны только для авторизованных пользователей.
          </p>
          <Button nativeButton={false} size="sm" render={<Link href="/login" />}>
            Войти
          </Button>
        </div>
      )}
      </div>

      {/* Right side: conversations linked to this company */}
      {session && (
        <div className="col-span-12 md:col-span-5 lg:col-span-5">
          <div className="md:sticky md:top-20">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="size-4 text-muted-foreground" />
                Переписки
              </h2>
              <AddThreadDialog companyId={id} buyers={buyers.map(b => ({ id: b.id, name: b.name }))} products={productOptions} />
            </div>

            {!hasConversations ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                Нет переписок с этой компанией
              </p>
            ) : (
              <div className="space-y-4">
                {buyersWithThreads.filter(b => b.threads.length > 0).map(({ buyer, threads }) => (
                  <div key={buyer.id}>
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        {buyer.initials}
                      </span>
                      {buyer.name}
                    </Link>

                    <div className="space-y-1.5 pl-8">
                      {threads.map(thread => (
                        <Link
                          key={thread.id}
                          href={`/buyers/${buyer.id}`}
                          className="group flex items-start gap-2 rounded-md border border-border/50 px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/30"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {thread.subject}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2">
                              <Badge variant={STATUS_VARIANT[thread.status]}>
                                {STATUS_LABEL[thread.status]}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(thread.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </PageContainer>
  )
}
