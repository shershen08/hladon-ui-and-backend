import { NextResponse } from 'next/server'
import { getEvents } from '@/lib/data/events'

export async function GET() {
  const events = await getEvents()
  return NextResponse.json(events)
}
