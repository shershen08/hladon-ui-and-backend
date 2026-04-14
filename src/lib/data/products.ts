import type { Product } from '@/types'

async function fromMocks(): Promise<Product[]> {
  const { default: data } = await import('@/mocks/products.json')
  return data as Product[]
}

async function fromDB(): Promise<Product[]> {
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

export async function getProducts(): Promise<Product[]> {
  return process.env.USE_MOCKS === 'true' ? fromMocks() : fromDB()
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find(p => p.id === id) ?? null
}
