import Link from 'next/link'
import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCompanies } from '@/lib/data/companies'
import { SearchBar } from '@/components/companies/search-bar'
import type { Company } from '@/types'

function matches(company: Company, q: string): boolean {
  const term = q.toLowerCase()
  return (
    company.name.toLowerCase().includes(term) ||
    (company.inn ?? '').includes(term) ||
    (company.city ?? '').toLowerCase().includes(term) ||
    company.categoryLabel.toLowerCase().includes(term)
  )
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const allCompanies = await getCompanies()
  const companies = q ? allCompanies.filter(c => matches(c, q)) : allCompanies

  const manufacturers = companies.filter(c => c.category === 'fire_system_manufacturer')
  const distributors = companies.filter(c => c.category === 'distributor')

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Компании</h1>
      <p className="text-muted-foreground mb-6">
        Участники рынка хладагентов в России.{' '}
        <span className="text-sm">Войдите, чтобы увидеть контактные данные.</span>
      </p>

      <Suspense>
        <SearchBar defaultValue={q} />
      </Suspense>

      {q && (
        <p className="mt-3 text-sm text-muted-foreground">
          {companies.length === 0 ? 'Ничего не найдено' : `Найдено: ${companies.length}`}
        </p>
      )}

      {(!q || manufacturers.length > 0) && (
        <section className="mt-8 mb-10">
          <h2 className="text-xl font-semibold mb-4">Производители пожарных систем</h2>
          {manufacturers.length > 0 ? (
            <div className="grid gap-4">
              {manufacturers.map(c => <CompanyCard key={c.id} company={c} />)}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Нет результатов</p>
          )}
        </section>
      )}

      {(!q || distributors.length > 0) && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Дистрибьютеры</h2>
          {distributors.length > 0 ? (
            <div className="grid gap-4">
              {distributors.map(c => <CompanyCard key={c.id} company={c} />)}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Нет результатов</p>
          )}
        </section>
      )}
    </main>
  )
}

function CompanyCard({ company: c }: { company: Company }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <Link href={`/companies/${c.id}`} className="hover:underline">
            {c.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        {c.inn && <span>ИНН: {c.inn}</span>}
        {c.city && <Badge variant="secondary">{c.city}</Badge>}
        {c.website && (
          <a href={c.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {new URL(c.website).hostname}
          </a>
        )}
      </CardContent>
    </Card>
  )
}
