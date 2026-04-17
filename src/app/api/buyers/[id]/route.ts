import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getBuyer } from '@/lib/data/buyers'

export async function GET(_req: Request, ctx: RouteContext<'/api/buyers/[id]'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const buyer = await getBuyer(id)

  if (!buyer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(buyer)
}
