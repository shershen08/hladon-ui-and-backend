import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDocuments } from '@/lib/data/documents'

const CATEGORY_LABELS: Record<string, string> = {
  regulation: 'Регламент',
  standard: 'Стандарт',
  order: 'Приказ',
}

export default async function DocumentsPage() {
  const documents = await getDocuments()

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Нормативные документы</h1>
      <p className="text-muted-foreground mb-8">Государственные регламенты и стандарты в области хладагентов.</p>

      <div className="grid gap-4">
        {documents.map(d => (
          <Card key={d.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{d.title}</CardTitle>
              <div className="flex gap-2 flex-wrap pt-1">
                <Badge>{CATEGORY_LABELS[d.category] ?? d.category}</Badge>
                <span className="text-xs text-muted-foreground self-center">{d.issuedBy}</span>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{d.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
