import { NextResponse } from 'next/server'
import { getDocuments } from '@/lib/data/documents'

export async function GET() {
  const documents = await getDocuments()
  return NextResponse.json(documents)
}
