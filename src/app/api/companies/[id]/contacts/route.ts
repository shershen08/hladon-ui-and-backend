import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { addContactToCompany, updateContactInCompany } from '@/lib/data/companies'

export async function POST(req: Request, ctx: RouteContext<'/api/companies/[id]/contacts'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await req.json()

  const contact = {
    name: body.name || null,
    role: body.role || null,
    phone: body.phone || null,
    email: body.email || null,
  }

  if (!contact.name && !contact.phone && !contact.email) {
    return NextResponse.json({ error: 'At least name, phone, or email is required' }, { status: 400 })
  }

  const ok = await addContactToCompany(id, contact)
  if (!ok) return NextResponse.json({ error: 'Company not found' }, { status: 404 })

  return NextResponse.json({ ok: true, contact })
}

export async function PUT(req: Request, ctx: RouteContext<'/api/companies/[id]/contacts'>) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const body = await req.json()
  const { index, ...fields } = body

  if (typeof index !== 'number') {
    return NextResponse.json({ error: 'Contact index is required' }, { status: 400 })
  }

  const contact = {
    name: fields.name || null,
    role: fields.role || null,
    phone: fields.phone || null,
    mobile: fields.mobile || null,
    phoneOffice: fields.phoneOffice || null,
    email: fields.email || null,
  }

  const ok = await updateContactInCompany(id, index, contact)
  if (!ok) return NextResponse.json({ error: 'Company or contact not found' }, { status: 404 })

  return NextResponse.json({ ok: true, contact })
}
