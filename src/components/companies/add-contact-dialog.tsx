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

interface AddContactDialogProps {
  companyId: string
}

export function AddContactDialog({ companyId }: AddContactDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get('name') as string,
      role: form.get('role') as string,
      phone: form.get('phone') as string,
      email: form.get('email') as string,
    }

    const res = await fetch(`/api/companies/${companyId}/contacts`, {
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
      <DialogTrigger
        render={<Button variant="outline" size="sm" />}
      >
        <Plus className="size-3.5" />
        Добавить
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новый контакт</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="contact-name">Имя</Label>
            <Input id="contact-name" name="name" placeholder="Иван Иванов" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-role">Должность</Label>
            <Input id="contact-role" name="role" placeholder="Менеджер по закупкам" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-phone">Телефон</Label>
            <Input id="contact-phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" name="email" type="email" placeholder="email@company.ru" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
