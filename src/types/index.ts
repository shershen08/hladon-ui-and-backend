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
