import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getBuyers, createBuyer } from '@/lib/data/buyers'
import type { Buyer } from '@/types'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const buyers = await getBuyers()
  return NextResponse.json(buyers)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, companyId, email } = body

  if (!name || !companyId) {
    return NextResponse.json({ error: 'Name and companyId are required' }, { status: 400 })
  }

  const initials = name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const buyer: Buyer = {
    id: `buyer-${Date.now()}`,
    name,
    companyId,
    email: email || '',
    phone: null,
    initials,
    lastActivity: new Date().toISOString(),
  }

  await createBuyer(buyer)

  return NextResponse.json({ ok: true, buyer })
}
