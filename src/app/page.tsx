import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-12 sm:pt-24 sm:pb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-medium text-primary mb-6 sm:mb-8">
          B2B платформа · Россия
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-4 sm:mb-5 max-w-2xl">
          Рынок хладагентов{' '}
          <span className="text-primary">в одном месте</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-xl leading-relaxed">
          Каталог производителей и дистрибьютеров, регуляторные документы
          и отраслевые мероприятия для B2B-участников рынка.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link href="/companies" />}>
            Смотреть компании
          </Button>
          <Button nativeButton={false} variant="outline" render={<Link href="/login" />}>
            Войти в кабинет
          </Button>
        </div>
      </section>

      {/* Nav cards */}
      <section className="max-w-5xl mx-auto px-6 pb-14 sm:pb-20 grid sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { href: '/companies', label: 'Компании', desc: 'Производители и дистрибьютеры хладонов' },
          { href: '/events', label: 'Мероприятия', desc: 'Конференции и выставки отрасли' },
          { href: '/documents', label: 'Документы', desc: 'Регламенты, ГОСТы и приказы' },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <p className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
