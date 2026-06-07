import { NextResponse } from 'next/server'
import { getCinemaById, getRoomsByCinema } from '@/lib/db'

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
    const [cinema, rooms] = await Promise.all([
      getCinemaById(numId),
      getRoomsByCinema(numId),
    ])

    if (!cinema) {
      return NextResponse.json({ error: 'Cinema not found' }, { status: 404 })
    }

    return NextResponse.json({ ...cinema, rooms })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching cinema' }, { status: 500 })
  }
}
