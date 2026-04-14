import { NextResponse } from 'next/server'
import { getPackage } from '@/lib/data/packages'

export async function GET(_req: Request, ctx: RouteContext<'/api/packages/[id]'>) {
  const { id } = await ctx.params
  const pkg = await getPackage(id)
  if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(pkg)
}
