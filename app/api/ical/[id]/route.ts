import { NextRequest } from 'next/server'
import { getScreeningById } from '@/lib/db'
import type { Screening } from '@/lib/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const screening = await getScreeningById(Number(id))

    if (!screening) {
      return new Response('Not found', { status: 404 })
    }

    const filename = screening.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

    return new Response(generateICalContent(screening), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.ics"`,
      },
    })
  } catch (error) {
    console.error('ical generation error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

function generateICalContent(screening: Screening): string {
  // Argentina is UTC-3 (no DST); force absolute time for calendar apps
  const startTime = new Date(`${screening.date}T${screening.time}:00-03:00`)
  const durationMinutes = screening.duration || 120
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000)

  const fmt = (date: Date) =>
    isNaN(date.getTime())
      ? new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      : date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//foquito.ar//Cine Calendar//ES',
    'BEGIN:VEVENT',
    `UID:foquito-${screening.id}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(startTime)}`,
    `DTEND:${fmt(endTime)}`,
    `SUMMARY:${screening.title} en ${screening.cinema}`,
    `DESCRIPTION:${screening.overview ? screening.overview.replace(/\n/g, '\\n') : 'Función de cine'}\\n\\nSala: ${screening.room || 'General'}\\nRating: ${screening.rating || 'N/A'}\\nFormato: ${screening.format || '2D'}`,
    `LOCATION:${screening.cinema}`,
    'URL:https://foquito.ar',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
