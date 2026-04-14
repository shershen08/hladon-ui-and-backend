import { NextResponse } from 'next/server'
import { getCompanies } from '@/lib/data/companies'
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

export async function GET() {
  const companies = await getCompanies()
  return NextResponse.json(companies.map(toPublic))
}
