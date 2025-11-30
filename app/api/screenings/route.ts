import { NextResponse } from 'next/server'
import { getScreenings, getScreeningsByCinema } from '@/lib/db'

export const revalidate = 3600; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cinema = searchParams.get('cinema')

  try {
    let data

    if (cinema && cinema !== 'all') {
      data = await getScreeningsByCinema(cinema)
    } else {
      data = await getScreenings()
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Database Error:', error)
    return NextResponse.json({ error: 'Error fetching screenings' }, { status: 500 })
  }
}