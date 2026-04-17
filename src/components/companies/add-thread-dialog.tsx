'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

interface BuyerOption {
  id: string
  name: string
}

interface ProductOption {
  code: string
  name: string
}

interface AddThreadDialogProps {
  companyId: string
  buyers: BuyerOption[]
  products: ProductOption[]
}

export function AddThreadDialog({ companyId, buyers, products }: AddThreadDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedBuyerId, setSelectedBuyerId] = useState(buyers[0]?.id ?? '__new__')

  const isNewBuyer = selectedBuyerId === '__new__'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const form = new FormData(e.currentTarget)
    let buyerId = selectedBuyerId

    if (isNewBuyer) {
      const buyerName = form.get('buyerName') as string
      const buyerEmail = form.get('buyerEmail') as string
      if (!buyerName?.trim()) { setIsSubmitting(false); return }

      const res = await fetch('/api/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: buyerName, companyId, email: buyerEmail }),
      })
      if (!res.ok) { setIsSubmitting(false); return }
      const { buyer } = await res.json()
      buyerId = buyer.id
    }

    const data = {
      subject: form.get('subject') as string,
      productCode: form.get('productCode') as string,
      quantity: form.get('quantity') as string,
      message: form.get('message') as string,
    }

    const res = await fetch(`/api/buyers/${buyerId}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setIsSubmitting(false)

    if (res.ok) {
      setIsOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" size="icon-xs" />}>
        <Plus className="size-3" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новая переписка</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="thread-buyer">Покупатель</Label>
            <select
              id="thread-buyer"
              value={selectedBuyerId}
              onChange={e => setSelectedBuyerId(e.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {buyers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
              <option value="__new__">+ Новый покупатель</option>
            </select>
          </div>

          {isNewBuyer && (
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-dashed border-border/60 p-3">
              <div className="space-y-1.5">
                <Label htmlFor="buyer-name">Имя</Label>
                <Input id="buyer-name" name="buyerName" required placeholder="Иван Иванов" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="buyer-email">Email</Label>
                <Input id="buyer-email" name="buyerEmail" type="email" placeholder="email@company.ru" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="thread-subject">Тема</Label>
            <Input id="thread-subject" name="subject" required placeholder="Закупка R-410A, 50 баллонов" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="thread-product">Продукт</Label>
              <select
                id="thread-product"
                name="productCode"
                defaultValue=""
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="" disabled>Выберите…</option>
                {products.map(p => (
                  <option key={p.code} value={p.code}>{p.code} — {p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="thread-qty">Количество</Label>
              <Input id="thread-qty" name="quantity" placeholder="50 баллонов" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="thread-message">Сообщение</Label>
            <textarea
              id="thread-message"
              name="message"
              required
              rows={3}
              placeholder="Текст первого сообщения от покупателя…"
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none resize-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Создание…' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
