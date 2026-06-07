import { NextResponse } from 'next/server'
import { getScreenings } from '@/lib/db'

export const revalidate = 3600;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cinema  = searchParams.get('cinema')
  const movieId = searchParams.get('movie_id')
  const date    = searchParams.get('date')

  if (date && !DATE_RE.test(date)) {
    return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 })
  }

  try {
    const data = await getScreenings({
      cinema:  cinema && cinema !== 'all' ? cinema : undefined,
      movieId: movieId ? Number(movieId) : undefined,
      date:    date ?? undefined,
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching screenings' }, { status: 500 })
  }
}
