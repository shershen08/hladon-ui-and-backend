import Link from 'next/link'
import { getSession } from '@/lib/session'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-1">Добро пожаловать</h1>
      <p className="text-muted-foreground mb-8">{session.username}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Покупатели</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">Переписка с покупателями по закупкам.</p>
            <Button nativeButton={false} size="sm" render={<Link href="/buyers" />}>Перейти</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Компании</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">Полный каталог с контактными данными.</p>
            <Button nativeButton={false} size="sm" render={<Link href="/companies" />}>Перейти</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Пакеты</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">Условия участия и тарифы.</p>
            <Button nativeButton={false} size="sm" render={<Link href="/packages" />}>Выбрать пакет</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
