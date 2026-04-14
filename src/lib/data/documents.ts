import type { Document } from '@/types'

async function fromMocks(): Promise<Document[]> {
  const { default: data } = await import('@/mocks/documents.json')
  return data as Document[]
}

async function fromDB(): Promise<Document[]> {
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

export async function getDocuments(): Promise<Document[]> {
  return process.env.USE_MOCKS === 'true' ? fromMocks() : fromDB()
}

export async function getDocument(id: string): Promise<Document | null> {
  const documents = await getDocuments()
  return documents.find(d => d.id === id) ?? null
}
