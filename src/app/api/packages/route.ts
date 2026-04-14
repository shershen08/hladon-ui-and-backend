import { NextResponse } from 'next/server'
import { getPackages } from '@/lib/data/packages'

export async function GET() {
  const packages = await getPackages()
  return NextResponse.json(packages)
}
