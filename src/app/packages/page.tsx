import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getSession } from '@/lib/session'
import { getPackages } from '@/lib/data/packages'

export default async function PackagesPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const packages = await getPackages()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Пакеты участия</h1>
      <p className="text-muted-foreground mb-10">Выберите уровень участия на платформе.</p>

      <div className="grid sm:grid-cols-3 gap-6 items-start">
        {packages.map((pkg, index) => (
          <Card key={pkg.id} className={`flex flex-col ${index === 2 ? 'border-primary/40 shadow-sm' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                {index === 2 && <Badge className="text-xs">Топ</Badge>}
              </div>
              <div className="mt-1">
                {pkg.price === 0 ? (
                  <span className="text-2xl font-bold">Бесплатно</span>
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">По запросу</span>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 gap-4">
              <p className="text-sm text-muted-foreground">{pkg.description}</p>

              {pkg.requirements.length > 0 && (
                <div className="rounded-lg bg-muted/60 px-3 py-2.5 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                    Требования
                  </p>
                  {pkg.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">·</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <ul className="space-y-2 text-sm flex-1">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full mt-2" variant={index === 2 ? 'default' : 'outline'}>
                {pkg.price === 0 ? 'Подключено' : 'Оставить заявку'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
