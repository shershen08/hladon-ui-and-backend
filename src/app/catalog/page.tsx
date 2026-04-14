import Link from 'next/link'
import { Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { getProducts } from '@/lib/data/products'
import type { Product } from '@/types'

const GWP_LABEL: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  low:    { label: 'Низкий ПГП',    variant: 'secondary' },
  medium: { label: 'Средний ПГП',   variant: 'outline' },
  high:   { label: 'Высокий ПГП',   variant: 'destructive' },
}

function gwpTier(gwp: number) {
  if (gwp <= 150) return GWP_LABEL.low
  if (gwp <= 2000) return GWP_LABEL.medium
  return GWP_LABEL.high
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>
}) {
  const { group } = await searchParams
  const allProducts = await getProducts()

  const filtered = group
    ? allProducts.filter(p => p.group === group)
    : allProducts

  const rSeries = filtered.filter(p => p.group === 'R-series')
  const hfc     = filtered.filter(p => p.group === 'ГФУ')

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Каталог хладагентов</h1>
        <p className="text-muted-foreground">
          Основной ассортимент хладагентов, представленных на рынке России.
        </p>
      </div>

      {/* Group filter tabs */}
      <Suspense>
        <GroupFilter active={group} />
      </Suspense>

      <div className="mt-8 space-y-12">
        {(!group || group === 'R-series') && rSeries.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-semibold">Смесевые хладагенты (R-серия)</h2>
              <Badge variant="outline">{rSeries.length} позиции</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rSeries.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {(!group || group === 'ГФУ') && hfc.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-semibold">Гидрофторуглероды (ГФУ)</h2>
              <Badge variant="outline">{hfc.length} позиций</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hfc.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm">Нет позиций в выбранной группе.</p>
        )}
      </div>
    </PageContainer>
  )
}

function GroupFilter({ active }: { active?: string }) {
  const tabs = [
    { label: 'Все', value: undefined },
    { label: 'R-серия', value: 'R-series' },
    { label: 'ГФУ', value: 'ГФУ' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map(tab => {
        const href = tab.value ? `/catalog?group=${encodeURIComponent(tab.value)}` : '/catalog'
        const isActive = active === tab.value || (!active && !tab.value)
        return (
          <a
            key={tab.label}
            href={href}
            className={[
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
              isActive
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40',
            ].join(' ')}
          >
            {tab.label}
          </a>
        )
      })}
    </div>
  )
}

function ProductCard({ product: p }: { product: Product }) {
  const tier = gwpTier(p.gwp)

  return (
    <Link href={`/catalog/${p.id}`} className="group block">
      <Card className="flex flex-col h-full transition-shadow group-hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-mono group-hover:text-primary transition-colors">
                {p.code}
              </CardTitle>
              {p.altCode && (
                <p className="text-xs text-muted-foreground mt-0.5">{p.altCode}</p>
              )}
            </div>
            <Badge variant={tier.variant} className="shrink-0 text-xs">
              {tier.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-snug mt-1 line-clamp-2">
            {p.description}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 flex-1">
          {p.composition && (
            <div className="rounded-md bg-muted/50 px-3 py-2 text-xs font-mono text-muted-foreground">
              {p.composition}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>ПГП (GWP)</span>
            <span className="font-semibold tabular-nums">{p.gwp.toLocaleString('ru-RU')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
