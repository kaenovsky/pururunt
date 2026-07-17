import 'server-only'
import * as cheerio from 'cheerio'
import type { ScrapedMovie } from './types'

const DEFAULT_URL = 'https://www.cinecosmos.uba.ar/'

// Days as they appear in Cosmos' "Ju Vi | 20:50 / Ma | 17:00" schedule strings,
// mapped to JS Date#getDay() (0 = Sunday). Ported from the n8n getMoviesCosmos node.
const DAY_MAP: Record<string, number> = {
  do: 0, dom: 0,
  lu: 1, lun: 1,
  ma: 2, mar: 2,
  mi: 3, mie: 3,
  ju: 4, jue: 4,
  vi: 5, vie: 5,
  sa: 6, sab: 6, 'sá': 6,
}

export async function scrapeCosmos(websiteUrl?: string | null): Promise<ScrapedMovie[]> {
  const url = websiteUrl || DEFAULT_URL
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Cosmos: HTTP ${res.status} fetching ${url}`)
  const html = await res.text()

  const $ = cheerio.load(html)
  const titles = $('.card-title').map((_, el) => $(el).text()).get()
  const schedules = $('.textoPeliFooter').map((_, el) => $(el).text()).get()
  const posters = $('.card-img-top').map((_, el) => $(el).attr('src') ?? '').get()
  const metadatas = $('.card-body .lightText').map((_, el) => $(el).text()).get()

  const moviesByTitle = new Map<string, ScrapedMovie>()
  const today = new Date()

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i].trim().toUpperCase()
    if (!title) continue

    let poster: string | null = null
    if (posters[i]) {
      const cleanPath = posters[i].trim().replace(/^\//, '')
      poster = `https://www.cinecosmos.uba.ar/${cleanPath}`
    }

    let duration: number | null = null
    if (metadatas[i]) {
      const durMatch = metadatas[i].match(/(\d+)\s*m/i)
      if (durMatch) duration = parseInt(durMatch[1], 10)
    }

    if (!moviesByTitle.has(title)) {
      moviesByTitle.set(title, { title, duration, poster, screenings: [] })
    }
    const movie = moviesByTitle.get(title)!

    const scheduleSegments = (schedules[i] || '').split('/')

    for (const segment of scheduleSegments) {
      const lowerSeg = segment.toLowerCase()
      const targetDays = new Set<number>()
      for (const key of Object.keys(DAY_MAP)) {
        if (lowerSeg.includes(key)) targetDays.add(DAY_MAP[key])
      }

      const times = segment.match(/(\d{1,2}:\d{1,2})/g) || []

      for (let d = 0; d < 7; d++) {
        const checkDate = new Date(today)
        checkDate.setDate(today.getDate() + d)
        if (!targetDays.has(checkDate.getDay())) continue

        for (const timeStr of times) {
          const [hh, mm] = timeStr.split(':')
          const cleanTime = `${hh.padStart(2, '0')}:${mm.padEnd(2, '0')}:00`
          const yyyy = checkDate.getFullYear()
          const mmStr = String(checkDate.getMonth() + 1).padStart(2, '0')
          const ddStr = String(checkDate.getDate()).padStart(2, '0')

          movie.screenings.push({
            date: `${yyyy}-${mmStr}-${ddStr}`,
            time: cleanTime,
            room: '1',
            format: null,
          })
        }
      }
    }
  }

  return Array.from(moviesByTitle.values())
}
