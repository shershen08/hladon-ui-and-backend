import type { Package } from '@/types'

async function fromMocks(): Promise<Package[]> {
  const { default: data } = await import('@/mocks/packages.json')
  return data as Package[]
}

async function fromDB(): Promise<Package[]> {
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

export async function getPackages(): Promise<Package[]> {
  return process.env.USE_MOCKS === 'true' ? fromMocks() : fromDB()
}

export async function getPackage(id: string): Promise<Package | null> {
  const packages = await getPackages()
  return packages.find(p => p.id === id) ?? null
}
