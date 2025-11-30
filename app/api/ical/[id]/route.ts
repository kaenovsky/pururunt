import { NextRequest } from 'next/server'
import { getScreeningById } from '../../../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 espera Promise en params
) {
  try {
    const { id } = await params
    
    // Convertimos a number porque la nueva DB usa IDs numéricos
    // Si tu DB usa UUIDs, quita el parseInt.
    const screeningId = parseInt(id); 
    
    const screening = await getScreeningById(screeningId)

    if (!screening) {
      return new Response('Screening no encontrado', { status: 404 })
    }

    // Generar contenido iCal
    const icalContent = generateICalContent(screening)

    // Limpiar el título para el nombre del archivo (quitar caracteres raros)
    const filename = screening.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

    return new Response(icalContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}.ics"`,
      },
    })
  } catch (error) {
    console.error('Error generando iCal:', error)
    return new Response('Error interno del servidor', { status: 500 })
  }
}

function generateICalContent(screening: any): string {
  // 1. CONSTRUCCIÓN DE FECHA
  // La DB nos da: date "2025-11-27" y time "22:30"
  // Forzamos la zona horaria de Argentina (-03:00) para que sea absoluto.
  const startString = `${screening.date}T${screening.time}:00-03:00`;
  const startTime = new Date(startString);

  // 2. CÁLCULO DE DURACIÓN
  // Usamos la duración real de la DB (en minutos) o 120 min por defecto
  const durationMinutes = screening.duration || 120; 
  const endTime = new Date(startTime.getTime() + (durationMinutes * 60 * 1000));

  // Helper para formato iCal UTC (Z)
  const formatDate = (date: Date) => {
    if (isNaN(date.getTime())) {
      // Fallback de seguridad por si falla el parseo
      return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  // 3. MAPEO DE CAMPOS NUEVOS (Title, Overview, Cinema, etc)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//cineee.ar//Cine Calendar//ES',
    'BEGIN:VEVENT',
    `UID:cineee-${screening.id}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startTime)}`,
    `DTEND:${formatDate(endTime)}`,
    `SUMMARY:${screening.title} en ${screening.cinema}`,
    `DESCRIPTION:${screening.overview ? screening.overview.replace(/\n/g, '\\n') : 'Función de cine'}\\n\\nSala: ${screening.room || 'General'}\\nRating: ${screening.rating || 'N/A'}\\nFormato: ${screening.format || '2D'}`,
    `LOCATION:${screening.cinema}`,
    // URL ahora apunta a tu web app o al poster si no hay link externo
    `URL:https://cineee.ar`, 
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}