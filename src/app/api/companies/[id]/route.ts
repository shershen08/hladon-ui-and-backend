import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getCompany } from '@/lib/data/companies'
import type { Company } from '@/types'

function toPublic(c: Company) {
  return {
    id: c.id,
    name: c.name,
    category: c.category,
    categoryLabel: c.categoryLabel,
    inn: c.inn,
    website: c.website,
    city: c.city,
  }
}

export async function GET(_req: Request, ctx: RouteContext<'/api/companies/[id]'>) {
  const { id } = await ctx.params
  const company = await getCompany(id)

  if (!company) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const session = await getSession()

  if (session) {
    const { internalNotes: _, ...rest } = company
    void _
    return NextResponse.json(rest)
  }

  return NextResponse.json(toPublic(company))
}
