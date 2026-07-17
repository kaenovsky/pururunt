import 'server-only'
import type { ScrapedMovie, EnrichedMovie } from './types'

interface TmdbSearchResult {
  id: number
  original_title?: string
  overview?: string
  poster_path?: string | null
  vote_average?: number
  origin_country?: string[]
}

interface TmdbSearchResponse {
  results?: TmdbSearchResult[]
}

// Ported from the n8n mergeTMDBcaco / mergeTMDBlorca / mergeTMDBcosmos nodes,
// which were near-identical copies of the same enrichment logic.
export async function searchAndEnrich(scraped: ScrapedMovie): Promise<EnrichedMovie> {
  const base: EnrichedMovie = {
    title: scraped.title,
    rating: scraped.rating ?? null,
    duration: scraped.duration ?? null,
    synopsis: scraped.synopsis ?? null,
    posterUrl: scraped.poster ?? null,
    tmdbId: null,
    voteAverage: null,
    originalTitle: null,
    director: null,
    country: null,
  }

  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) return base

  try {
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('query', scraped.title)
    url.searchParams.set('language', 'es-AR')

    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return base

    const data = (await res.json()) as TmdbSearchResponse
    const match = data.results?.[0]
    if (!match) return base

    return {
      ...base,
      tmdbId: match.id,
      voteAverage: match.vote_average != null ? String(match.vote_average) : null,
      originalTitle: match.original_title ?? null,
      synopsis: match.overview || base.synopsis,
      posterUrl: match.poster_path ? `https://image.tmdb.org/t/p/w500${match.poster_path}` : base.posterUrl,
      country: match.origin_country?.[0] ?? null,
    }
  } catch {
    return base
  }
}
