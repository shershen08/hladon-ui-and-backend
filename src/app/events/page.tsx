import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { baseUrl } from '@/lib/base-url'

type Event = {
  id: string
  title: string
  date: string
  location: string
  description: string
  url: string | null
}

async function getEvents(): Promise<Event[]> {
  const res = await fetch(`${baseUrl()}/api/events`, { cache: 'no-store' })
  return res.json()
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Мероприятия</h1>
      <p className="text-muted-foreground mb-8">Отраслевые события рынка хладагентов.</p>

      <div className="grid gap-4">
        {events.map(e => (
          <Card key={e.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{e.title}</CardTitle>
              <div className="flex gap-2 flex-wrap pt-1">
                <Badge variant="outline">{new Date(e.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</Badge>
                <Badge variant="secondary">{e.location}</Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{e.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
