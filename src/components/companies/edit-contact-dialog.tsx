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
import { Pencil } from 'lucide-react'
import type { Contact } from '@/types'

interface EditContactDialogProps {
  companyId: string
  index: number
  contact: Contact
}

export function EditContactDialog({ companyId, index, contact }: EditContactDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const form = new FormData(e.currentTarget)
    const data = {
      index,
      name: form.get('name') as string,
      role: form.get('role') as string,
      phone: form.get('phone') as string,
      email: form.get('email') as string,
    }

    const res = await fetch(`/api/companies/${companyId}/contacts`, {
      method: 'PUT',
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
      <DialogTrigger render={<Button variant="ghost" size="icon-xs" />}>
        <Pencil className="size-3" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать контакт</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`edit-name-${index}`}>Имя</Label>
            <Input id={`edit-name-${index}`} name="name" defaultValue={contact.name ?? ''} placeholder="Иван Иванов" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edit-role-${index}`}>Должность</Label>
            <Input id={`edit-role-${index}`} name="role" defaultValue={contact.role ?? ''} placeholder="Менеджер по закупкам" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edit-phone-${index}`}>Телефон</Label>
            <Input id={`edit-phone-${index}`} name="phone" type="tel" defaultValue={contact.phone ?? ''} placeholder="+7 (999) 123-45-67" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`edit-email-${index}`}>Email</Label>
            <Input id={`edit-email-${index}`} name="email" type="email" defaultValue={contact.email ?? ''} placeholder="email@company.ru" />
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
