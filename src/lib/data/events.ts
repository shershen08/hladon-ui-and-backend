import type { Event } from '@/types'

async function fromMocks(): Promise<Event[]> {
  const { default: data } = await import('@/mocks/events.json')
  return data as Event[]
}

async function fromDB(): Promise<Event[]> {
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

export async function getEvents(): Promise<Event[]> {
  return process.env.USE_MOCKS === 'true' ? fromMocks() : fromDB()
}

export async function getEvent(id: string): Promise<Event | null> {
  const events = await getEvents()
  return events.find(e => e.id === id) ?? null
}
