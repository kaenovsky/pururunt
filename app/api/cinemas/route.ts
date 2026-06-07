import { NextResponse } from 'next/server'
import { getCinemas } from '@/lib/db'

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await getCinemas()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching cinemas' }, { status: 500 })
  }
}
