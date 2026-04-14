import { NextResponse } from 'next/server'
import { getEvent } from '@/lib/data/events'

export async function GET(_req: Request, ctx: RouteContext<'/api/events/[id]'>) {
  const { id } = await ctx.params
  const event = await getEvent(id)
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(event)
}
