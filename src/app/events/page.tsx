import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/page-container'
import { getEvents } from '@/lib/data/events'

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <PageContainer>
      <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-8">
      <h1 className="text-3xl font-bold mb-2">Мероприятия</h1>
      <p className="text-muted-foreground mb-8">Отраслевые события рынка хладагентов.</p>

      <div className="grid gap-4">
        {events.map(e => (
          <Card key={e.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{e.title}</CardTitle>
              <div className="flex gap-2 flex-wrap pt-1">
                <Badge variant="outline">
                  {new Date(e.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Badge>
                <Badge variant="secondary">{e.location}</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{e.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
      </div>
    </PageContainer>
  )
}
