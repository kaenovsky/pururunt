import 'server-only'
import type { ScrapedMovie } from './types'

const HTML_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú',
  '&ntilde;': 'ñ', '&aacute;': 'á', '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í',
  '&Oacute;': 'Ó', '&Uacute;': 'Ú', '&Ntilde;': 'Ñ', '&ndash;': '-', '&quot;': '"',
  '&rsquo;': "'", '&Acirc;': 'Â', '&acirc;': 'â', '&circ;': 'ˆ',
}

function stripTags(str: string | null | undefined): string {
  if (!str) return ''
  let text = str.replace(/<br\s*\/?>/gi, ' ')
  text = text.replace(/<[^>]+>/g, ' ')
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    text = text.replace(new RegExp(entity, 'gi'), char)
  }
  return text.replace(/\s+/g, ' ').trim()
}

const MONTHS_MAP: Record<string, number> = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
}

interface FlatScreening {
  movieTitle: string
  rating: string
  synopsis: string
  poster: string
  date: string
  time: string
}

// Ported from the n8n "getNewsletterDataCaco" code node. `periodText` replaces the
// original Gmail subject line (e.g. "del 26 de Febrero al 4 de Marzo"), which the
// admin now pastes manually alongside the newsletter body.
export function parseCacodelphiaNewsletter(html: string, periodText: string): ScrapedMovie[] {
  const currentYear = new Date().getFullYear()
  const matchSubject = periodText.match(/del\s+(\d+)\s+al\s+(\d+)\s+de\s+([A-Za-zñÑ]+)/i)
  let cycleMonthIndex = new Date().getMonth()
  if (matchSubject) cycleMonthIndex = MONTHS_MAP[matchSubject[3].toLowerCase()] ?? cycleMonthIndex

  const flat: FlatScreening[] = []
  const blocks = html.split(/Comprar Entradas/i)

  for (const block of blocks) {
    if (!block.includes('Horarios:')) continue

    const imgMatch = block.match(/src="([^"]+)"/i)
    const posterUrl = imgMatch ? imgMatch[1] : ''

    const preHorarios = block.split('Horarios:')[0]
    const lines = preHorarios.split(/<\/p>|<br\s*\/?>/i)
    let title = ''

    for (const line of lines) {
      const clean = stripTags(line).replace(/\[.*?\]/g, '').replace(/ESTRENO|EXCLUSIVA/gi, '').trim()
      if (
        clean.length > 2 &&
        !clean.includes('CINEARTE') &&
        !clean.includes('Programación') &&
        !clean.startsWith('C:') &&
        !clean.includes('@') &&
        !clean.includes('http')
      ) {
        title = clean
      }
    }

    if (!title) continue

    const cleanBlock = stripTags(block)
    const rating = (cleanBlock.match(/C:\s*([^\s]+)/i) || [])[1] || 'ATP'
    const synopsis = (cleanBlock.match(/Sinopsis:\s*(.*?)(?:$)/i) || [])[1] || ''

    const horarioPart = cleanBlock.match(/Horarios:\s*(.*?)\s*Sinopsis:/i)
    if (!horarioPart) continue

    const timeLines = horarioPart[1].split(/(?=[A-Z][a-z]{2,}\s\d+)/)

    for (const line of timeLines) {
      const timeMatches = line.match(/(\d{1,2}:\d{2})/g)
      if (!timeMatches) continue

      const days: number[] = []
      const nums = line.match(/\d+/g) || []
      if (line.toLowerCase().includes(' a ') && nums.length >= 2) {
        for (let d = parseInt(nums[0]!, 10); d <= parseInt(nums[1]!, 10); d++) days.push(d)
      } else {
        for (const n of nums) {
          const d = parseInt(n, 10)
          if (d <= 31 && !line.includes(n + ':')) days.push(d)
        }
      }

      for (const day of new Set(days)) {
        for (const timeStr of timeMatches) {
          const dateObj = new Date(currentYear, cycleMonthIndex, day)
          if (isNaN(dateObj.getTime())) continue

          flat.push({
            movieTitle: title.toUpperCase(),
            rating,
            synopsis: synopsis.trim(),
            poster: posterUrl,
            date: dateObj.toISOString().split('T')[0],
            time: timeStr.length === 4 ? `0${timeStr}:00` : `${timeStr}:00`,
          })
        }
      }
    }
  }

  const moviesByTitle = new Map<string, ScrapedMovie>()
  for (const s of flat) {
    if (!moviesByTitle.has(s.movieTitle)) {
      moviesByTitle.set(s.movieTitle, {
        title: s.movieTitle,
        rating: s.rating,
        duration: null,
        synopsis: s.synopsis || null,
        poster: s.poster || null,
        screenings: [],
      })
    }
    moviesByTitle.get(s.movieTitle)!.screenings.push({
      date: s.date,
      time: s.time,
      room: '1',
      format: null,
    })
  }

  return Array.from(moviesByTitle.values())
}
