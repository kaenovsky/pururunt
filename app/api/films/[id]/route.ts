import { NextResponse } from 'next/server'
import { getMovieById } from '@/lib/db'

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)

  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid film ID' }, { status: 400 })
  }

  try {
    const film = await getMovieById(numId)
    if (!film) {
      return NextResponse.json({ error: 'Film not found' }, { status: 404 })
    }
    return NextResponse.json(film)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching film' }, { status: 500 })
  }
}
