import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { addMessageToThread } from '@/lib/data/buyers'
import type { ThreadMessage, ThreadAttachment } from '@/types'

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: threadId } = await ctx.params

  const formData = await req.formData()
  const body = formData.get('body') as string
  const senderType = (formData.get('senderType') as string) || 'seller'
  const senderName = (formData.get('senderName') as string) || 'Менеджер'

  if (!body?.trim()) {
    return NextResponse.json({ error: 'Message body is required' }, { status: 400 })
  }

  const attachments: ThreadAttachment[] = []
  const files = formData.getAll('files') as File[]
  for (const file of files) {
    if (file.size > 0) {
      attachments.push({
        name: file.name,
        size: file.size,
        url: `/uploads/${Date.now()}-${file.name}`,
      })
    }
  }

  const now = new Date().toISOString()
  const message: ThreadMessage = {
    id: `msg-${Date.now()}`,
    threadId,
    senderType: senderType as 'buyer' | 'seller',
    senderName,
    body: body.trim(),
    sentAt: now,
    ...(attachments.length > 0 ? { attachments } : {}),
  }

  const ok = await addMessageToThread(threadId, message)
  if (!ok) return NextResponse.json({ error: 'Thread not found' }, { status: 404 })

  return NextResponse.json({ ok: true, message })
}
