import { NextResponse } from 'next/server'
import { getScreeningById } from '@/lib/db'

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)

  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid screening ID' }, { status: 400 })
  }

  try {
    const screening = await getScreeningById(numId)
    if (!screening) {
      return NextResponse.json({ error: 'Screening not found' }, { status: 404 })
    }
    return NextResponse.json(screening)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching screening' }, { status: 500 })
  }
}
