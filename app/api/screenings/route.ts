import { NextResponse } from 'next/server'
import { getScreenings, Screening } from '../../../lib/db'

export async function GET() {
  try {
    const screenings: Screening[] = await getScreenings()
    
    // Agrupar por fecha para el frontend
    const groupedByDate = screenings.reduce((acc: Record<string, Screening[]>, screening: Screening) => {
      const date = screening.date
      if (!acc[date]) acc[date] = []
      acc[date].push(screening)
      return acc
    }, {})

    return NextResponse.json({
      screenings,
      groupedByDate,
      total: screenings.length
    })
  } catch (error) {
    console.error('Error fetching screenings:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}