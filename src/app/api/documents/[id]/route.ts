import { NextResponse } from 'next/server'
import { getDocument } from '@/lib/data/documents'

export async function GET(_req: Request, ctx: RouteContext<'/api/documents/[id]'>) {
  const { id } = await ctx.params
  const doc = await getDocument(id)
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(doc)
}
