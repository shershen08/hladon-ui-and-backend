import type { Company, Contact } from '@/types'

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

async function addContactToMock(companyId: string, contact: Contact): Promise<boolean> {
  const fs = await import('fs/promises')
  const path = await import('path')
  const filePath = path.join(process.cwd(), 'src/mocks/companies.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  const companies: Company[] = JSON.parse(raw)
  const company = companies.find(c => c.id === companyId)
  if (!company) return false
  company.contacts.push(contact)
  await fs.writeFile(filePath, JSON.stringify(companies, null, 2) + '\n', 'utf-8')
  return true
}

async function addContactToDB(_companyId: string, _contact: Contact): Promise<boolean> {
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

export async function addContactToCompany(companyId: string, contact: Contact): Promise<boolean> {
  return process.env.USE_MOCKS === 'true'
    ? addContactToMock(companyId, contact)
    : addContactToDB(companyId, contact)
}

export async function updateContactInCompany(
  companyId: string,
  contactIndex: number,
  contact: Contact,
): Promise<boolean> {
  if (process.env.USE_MOCKS === 'true') {
    const fs = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'src/mocks/companies.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    const companies: Company[] = JSON.parse(raw)
    const company = companies.find(c => c.id === companyId)
    if (!company || contactIndex < 0 || contactIndex >= company.contacts.length) return false
    company.contacts[contactIndex] = contact
    await fs.writeFile(filePath, JSON.stringify(companies, null, 2) + '\n', 'utf-8')
    return true
  }
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}
