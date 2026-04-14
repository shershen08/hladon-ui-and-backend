import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageContainer } from '@/components/layout/page-container'
import { getProduct } from '@/lib/data/products'

const GWP_META: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; note: string }> = {
  low:    { label: 'Низкий ПГП',   variant: 'secondary',    note: 'Менее 150 — наименьшее воздействие на климат' },
  medium: { label: 'Средний ПГП',  variant: 'outline',      note: 'От 150 до 2 000 — умеренное воздействие' },
  high:   { label: 'Высокий ПГП',  variant: 'destructive',  note: 'Свыше 2 000 — под регуляторным давлением' },
}

function gwpMeta(gwp: number) {
  if (gwp <= 150) return GWP_META.low
  if (gwp <= 2000) return GWP_META.medium
  return GWP_META.high
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const meta = gwpMeta(product.gwp)

  return (
    <PageContainer>
      <div className="grid grid-cols-12 gap-x-12 gap-y-8">

        {/* Main column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div>
            <Link
              href="/catalog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-6"
            >
              ← Каталог
            </Link>

            <div className="flex items-start gap-4 flex-wrap">
              <h1 className="text-3xl font-bold font-mono">{product.code}</h1>
              {product.altCode && (
                <Badge variant="outline" className="text-sm mt-1">{product.altCode}</Badge>
              )}
              <Badge variant="secondary" className="mt-1">{product.group}</Badge>
            </div>

            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {product.composition && (
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
                Состав
              </h2>
              <div className="rounded-lg bg-muted/50 border px-4 py-3 font-mono text-sm">
                {product.composition}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Применение
            </h2>
            <ul className="space-y-2">
              {product.applications.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-primary font-bold mt-0.5 shrink-0">·</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Фасовка
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.packaging.map((pkg, i) => (
                <Badge key={i} variant="secondary" className="text-sm font-normal px-3 py-1">
                  {pkg}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="rounded-xl border bg-card p-6 space-y-5 sticky top-20">
            <h2 className="font-semibold text-sm">Характеристики</h2>
            <Separator />

            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Код</dt>
                <dd className="font-mono font-medium">{product.code}</dd>
              </div>

              {product.altCode && (
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Альтернативное обозначение
                  </dt>
                  <dd className="font-mono">{product.altCode}</dd>
                </div>
              )}

              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Группа</dt>
                <dd>{product.group}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  ПГП (GWP, 100 лет)
                </dt>
                <dd className="flex items-center gap-2">
                  <span className="text-xl font-bold tabular-nums">
                    {product.gwp.toLocaleString('ru-RU')}
                  </span>
                  <Badge variant={meta.variant} className="text-xs">{meta.label}</Badge>
                </dd>
                <p className="text-xs text-muted-foreground mt-1">{meta.note}</p>
              </div>
            </dl>
          </div>
        </aside>

      </div>
    </PageContainer>
  )
}
