import { NextResponse } from 'next/server'
import { getScreenings } from '@/lib/db'

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)

  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid cinema ID' }, { status: 400 })
  }

  try {
    const data = await getScreenings({ cinemaId: numId })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching screenings' }, { status: 500 })
  }
}
