import { NextRequest } from 'next/server'
import { getScreeningById } from '../../../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params
    const { id } = await params
    
    const screening = await getScreeningById(id)

    if (!screening) {
      return new Response('Screening no encontrado', { status: 404 })
    }

    // Generar contenido iCal
    const icalContent = generateICalContent(screening)

    // Devolver como archivo .ics descargable
    return new Response(icalContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${screening.film.replace(/\s+/g, '_')}.ics"`,
      },
    })
  } catch (error) {
    console.error('Error generando iCal:', error)
    return new Response('Error interno del servidor', { status: 500 })
  }
}

function generateICalContent(screening: any): string {
  const startTime = new Date(screening.timestamp)
  const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)) // +2 horas por defecto

  // Formatear fechas para iCal (YYYYMMDDTHHmmssZ)
  const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//cineee.ar//Cine Calendar//ES',
    'BEGIN:VEVENT',
    `UID:${screening.id}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startTime)}`,
    `DTEND:${formatDate(endTime)}`,
    `SUMMARY:${screening.film} - ${screening.cinema}`,
    `DESCRIPTION:${screening.info ? screening.info.replace(/\n/g, '\\n') : 'Función de cine'}\\n\\nClasificación: ${screening.rate || 'N/A'}\\nFormato: ${screening.format || '2D'}`,
    `LOCATION:${screening.cinema}`,
    `URL:${screening.og_link}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}