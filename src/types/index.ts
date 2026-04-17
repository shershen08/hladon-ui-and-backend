export type Contact = {
  name?: string | null
  role?: string | null
  phone?: string | null
  mobile?: string | null
  phoneOffice?: string | null
  email?: string | null
}

export type Company = {
  id: string
  name: string
  category: string
  categoryLabel: string
  inn: string | null
  website: string | null
  city: string | null
  address: string | null
  contacts: Contact[]
  internalNotes: string | null
}

export type Event = {
  id: string
  title: string
  date: string
  location: string
  description: string
  url: string | null
}

export type Document = {
  id: string
  title: string
  description: string
  category: string
  issuedBy: string
  issuedAt: string
  url: string | null
}

export type Package = {
  id: string
  name: string
  description: string
  price: number | null
  currency: string
  period: string
  requirements: string[]
  features: string[]
}

export type Product = {
  id: string
  code: string
  altCode: string | null
  group: 'R-series' | 'ГФУ'
  name: string
  description: string
  gwp: number
  composition: string | null
  applications: string[]
  packaging: string[]
}

export type Buyer = {
  id: string
  name: string
  companyId: string
  email: string
  phone: string | null
  initials: string
  lastActivity: string
}

export type ThreadAttachment = {
  name: string
  size: number
  url: string
}

export type ThreadMessage = {
  id: string
  threadId: string
  senderType: 'buyer' | 'seller'
  senderName: string
  body: string
  sentAt: string
  attachments?: ThreadAttachment[]
}

export type BuyerThread = {
  id: string
  buyerId: string
  subject: string
  productCode: string
  quantity: string
  status: 'awaiting_response' | 'deal_agreed' | 'follow_up' | 'archive'
  createdAt: string
  updatedAt: string
  messages: ThreadMessage[]
}
