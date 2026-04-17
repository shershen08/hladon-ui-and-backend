import type { Buyer, BuyerThread, ThreadMessage } from '@/types'

async function buyersFromMocks(): Promise<Buyer[]> {
  const { default: data } = await import('@/mocks/buyers.json')
  return data as Buyer[]
}

async function buyersFromDB(): Promise<Buyer[]> {
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

async function threadsFromMocks(): Promise<BuyerThread[]> {
  const { default: data } = await import('@/mocks/buyer-threads.json')
  return data as BuyerThread[]
}

async function threadsFromDB(): Promise<BuyerThread[]> {
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

export async function getBuyers(): Promise<Buyer[]> {
  return process.env.USE_MOCKS === 'true' ? buyersFromMocks() : buyersFromDB()
}

export async function getBuyer(id: string): Promise<Buyer | null> {
  const buyers = await getBuyers()
  return buyers.find(b => b.id === id) ?? null
}

export async function getAllThreads(): Promise<BuyerThread[]> {
  return process.env.USE_MOCKS === 'true'
    ? threadsFromMocks()
    : threadsFromDB()
}

export async function getThreadsByBuyer(buyerId: string): Promise<BuyerThread[]> {
  const threads = await getAllThreads()
  return threads.filter(t => t.buyerId === buyerId)
}

export async function getThread(threadId: string): Promise<BuyerThread | null> {
  const threads = await getAllThreads()
  return threads.find(t => t.id === threadId) ?? null
}

export async function getBuyersByCompany(companyId: string): Promise<Buyer[]> {
  const buyers = await getBuyers()
  return buyers.filter(b => b.companyId === companyId)
}

export async function createBuyer(buyer: Buyer): Promise<void> {
  if (process.env.USE_MOCKS === 'true') {
    const fs = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'src/mocks/buyers.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    const buyers: Buyer[] = JSON.parse(raw)
    buyers.push(buyer)
    await fs.writeFile(filePath, JSON.stringify(buyers, null, 2) + '\n', 'utf-8')
  } else {
    throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
  }
}

export async function addMessageToThread(threadId: string, message: ThreadMessage): Promise<boolean> {
  if (process.env.USE_MOCKS === 'true') {
    const fs = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'src/mocks/buyer-threads.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    const threads: BuyerThread[] = JSON.parse(raw)
    const thread = threads.find(t => t.id === threadId)
    if (!thread) return false
    thread.messages.push(message)
    thread.updatedAt = message.sentAt
    await fs.writeFile(filePath, JSON.stringify(threads, null, 2) + '\n', 'utf-8')
    return true
  }
  throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
}

export async function createThread(thread: BuyerThread): Promise<void> {
  if (process.env.USE_MOCKS === 'true') {
    const fs = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'src/mocks/buyer-threads.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    const threads: BuyerThread[] = JSON.parse(raw)
    threads.unshift(thread)
    await fs.writeFile(filePath, JSON.stringify(threads, null, 2) + '\n', 'utf-8')
  } else {
    throw new Error('DB not configured. Set USE_MOCKS=true or implement DB connection.')
  }
}
