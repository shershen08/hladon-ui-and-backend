import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCompany } from '@/lib/data/companies'
import { getSession } from '@/lib/session'

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [company, session] = await Promise.all([getCompany(id), getSession()])

  if (!company) notFound()

  const showContacts = !!session && company.contacts.length > 0

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
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
            <dd>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {company.website}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {showContacts ? (
        <section>
          <h2 className="text-lg font-semibold mb-3">Контакты</h2>
          <div className="space-y-4">
            {company.contacts.map((c, i) => (
              <div key={i} className="rounded-lg border p-4 text-sm space-y-1">
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
        </section>
      ) : !session ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
          <p className="mb-3">
            Контактные данные доступны только для авторизованных пользователей.
          </p>
          <Button nativeButton={false} size="sm" render={<Link href="/login" />}>
            Войти
          </Button>
        </div>
      ) : null}
    </main>
  )
}
