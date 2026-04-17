import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getThreadsByBuyer, getBuyer, createThread } from '@/lib/data/buyers'
import type { BuyerThread } from '@/types'

export async function GET(_req: Request, ctx: RouteContext<'/api/buyers/[id]/threads'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const threads = await getThreadsByBuyer(id)

  return NextResponse.json(threads)
}

export async function POST(req: Request, ctx: RouteContext<'/api/buyers/[id]/threads'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: buyerId } = await ctx.params
  const buyer = await getBuyer(buyerId)
  if (!buyer) return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })

  const body = await req.json()
  const { subject, productCode, quantity, message } = body

  if (!subject || !message) {
    return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const threadId = `thread-${Date.now()}`

  const thread: BuyerThread = {
    id: threadId,
    buyerId,
    subject,
    productCode: productCode || '',
    quantity: quantity || '',
    status: 'awaiting_response',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `msg-${Date.now()}`,
        threadId,
        senderType: 'buyer',
        senderName: buyer.name,
        body: message,
        sentAt: now,
      },
    ],
  }

  await createThread(thread)

  return NextResponse.json({ ok: true, thread })
}
