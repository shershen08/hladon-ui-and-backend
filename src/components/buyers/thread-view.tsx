'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Send, Paperclip, X } from 'lucide-react'
import type { BuyerThread, ThreadMessage } from '@/types'

const STATUS_LABEL: Record<BuyerThread['status'], string> = {
  awaiting_response: 'Ожидается ответ',
  deal_agreed: 'Сделка согласована',
  follow_up: 'Напомнить о себе',
  archive: 'Архив',
}

const STATUS_VARIANT: Record<BuyerThread['status'], 'default' | 'secondary' | 'outline'> = {
  awaiting_response: 'default',
  deal_agreed: 'secondary',
  follow_up: 'outline',
  archive: 'outline',
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function Message({ message }: { message: ThreadMessage }) {
  const isSeller = message.senderType === 'seller'

  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <div className={`mt-0.5 size-2 shrink-0 rounded-full ${isSeller ? 'bg-primary/60' : 'bg-muted-foreground/30'}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{message.senderName}</span>
          <span className="text-xs text-muted-foreground/60">{formatDate(message.sentAt)}</span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {message.body}
        </p>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((att, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
              >
                <Paperclip className="size-3" />
                {att.name}
                <span className="text-muted-foreground/50">{formatFileSize(att.size)}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReplyForm({ threadId, buyerName }: { threadId: string; buyerName: string }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [body, setBody] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [senderType, setSenderType] = useState<'seller' | 'buyer'>('seller')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() && files.length === 0) return
    setIsSubmitting(true)

    const formData = new FormData()
    formData.set('body', body)
    formData.set('senderType', senderType)
    formData.set('senderName', senderType === 'seller' ? 'Менеджер' : buyerName)
    for (const file of files) {
      formData.append('files', file)
    }

    const res = await fetch(`/api/threads/${threadId}/messages`, {
      method: 'POST',
      body: formData,
    })

    setIsSubmitting(false)

    if (res.ok) {
      setBody('')
      setFiles([])
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border/40 px-4 py-3">
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {files.map((file, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
            >
              <Paperclip className="size-3" />
              {file.name}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-0.5 rounded-sm hover:text-foreground transition-colors"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="mb-2 flex items-center gap-2">
        <select
          value={senderType}
          onChange={e => setSenderType(e.target.value as 'seller' | 'buyer')}
          className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="seller">От: Менеджер</option>
          <option value="buyer">От: {buyerName}</option>
        </select>
      </div>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Написать сообщение…"
        rows={4}
        className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="mt-2 flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="size-4" />
        </Button>
        <span className="flex-1" />
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || (!body.trim() && files.length === 0)}
        >
          <Send className="size-3.5" />
          {isSubmitting ? 'Отправка…' : 'Отправить'}
        </Button>
      </div>
    </form>
  )
}

function ThreadSection({ thread, buyerName, defaultExpanded }: {
  thread: BuyerThread
  buyerName: string
  defaultExpanded: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="rounded-lg border border-border/60">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{thread.subject}</span>
            <Badge variant={STATUS_VARIANT[thread.status]}>{STATUS_LABEL[thread.status]}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {thread.quantity} · {thread.messages.length} сообщ. · {formatDate(thread.updatedAt)}
          </p>
        </div>
        {isExpanded
          ? <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        }
      </button>

      {isExpanded && (
        <>
          <div className="border-t border-border/40 px-4 py-3 divide-y divide-border/30">
            {thread.messages.map(msg => (
              <Message key={msg.id} message={msg} />
            ))}
          </div>
          <ReplyForm threadId={thread.id} buyerName={buyerName} />
        </>
      )}
    </div>
  )
}

export function ThreadView({ threads, buyerName }: { threads: BuyerThread[]; buyerName: string }) {
  return (
    <div className="space-y-3">
      {threads.map((thread, i) => (
        <ThreadSection
          key={thread.id}
          thread={thread}
          buyerName={buyerName}
          defaultExpanded={i === 0}
        />
      ))}
    </div>
  )
}
