import { NextResponse } from 'next/server'
import { getArchivedMovies } from '@/lib/db'

export const revalidate = 3600

const DEFAULT_LIMIT = 24
const MAX_LIMIT = 48

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(searchParams.get('limit')) || DEFAULT_LIMIT))
  const offset = Math.max(0, Number(searchParams.get('offset')) || 0)

  try {
    const rows = await getArchivedMovies({ limit: limit + 1, offset })
    const hasMore = rows.length > limit

    return NextResponse.json({
      films: rows.slice(0, limit),
      hasMore,
    })
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching film archive' }, { status: 500 })
  }
}
