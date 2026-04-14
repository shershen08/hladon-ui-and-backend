import type { Company } from '@/types'

async function fromMocks(): Promise<Company[]> {
  const { default: data } = await import('@/mocks/companies.json')
  return data as Company[]
}

async function fromDB(): Promise<Company[]> {
  // TODO: replace with real DB query
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

export async function getCompanies(): Promise<Company[]> {
  return process.env.USE_MOCKS === 'true' ? fromMocks() : fromDB()
}

export async function getCompany(id: string): Promise<Company | null> {
  const companies = await getCompanies()
  return companies.find(c => c.id === id) ?? null
}
