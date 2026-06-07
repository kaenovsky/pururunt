import { NextResponse } from 'next/server'
import { getMovies } from '@/lib/db'

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get('featured')
  const search   = searchParams.get('search')

  try {
    const data = await getMovies({
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      search:   search ?? undefined,
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching films' }, { status: 500 })
  }
}
