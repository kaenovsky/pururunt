import 'server-only'
import { eq, inArray } from 'drizzle-orm'
import { db, getCinemaById, getRoomsByCinema, getScreenings, getMovies } from '@/lib/db'
import { movies, screenings } from '@/lib/schema'
import { searchAndEnrich } from './tmdb'
import type { ScrapedMovie } from './types'

export interface ImportPlanMovie {
  key: string
  title: string
  rating: string | null
  duration: number | null
  synopsis: string | null
  posterUrl: string | null
  tmdbId: number | null
  voteAverage: string | null
  originalTitle: string | null
  director: string | null
  country: string | null
  status: 'new' | 'existing' | 'possible_duplicate'
  matchedMovieId: number | null
  matchedMovieManualEdit: boolean
  duplicateSuggestionId: number | null
  duplicateSuggestionTitle: string | null
}

export interface ImportPlanScreening {
  movieKey: string
  date: string
  time: string
  roomNumber: string
  roomId: number
  format: string | null
  status: 'new' | 'unchanged' | 'movie_changed'
  existingScreeningId: number | null
  previousMovieTitle: string | null
}

export interface ImportPlanOrphan {
  screeningId: number
  movieTitle: string
  date: string
  time: string
  roomNumber: string
}

export interface ImportPlan {
  cinemaId: number
  cinemaName: string
  movies: ImportPlanMovie[]
  screenings: ImportPlanScreening[]
  orphanScreenings: ImportPlanOrphan[]
  unresolvedRooms: string[]
}

export interface ImportDecisions {
  mergeDuplicates: Record<string, number>
  deleteOrphanIds: number[]
}

export interface ImportResult {
  moviesCreated: number
  moviesUpdated: number
  screeningsCreated: number
  screeningsReassigned: number
  screeningsDeleted: number
}

function normalize(title: string): string {
  return title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp[a.length][b.length]
}

function findClosestMatch(normalizedKey: string, candidates: { id: number; title: string }[]) {
  const threshold = Math.max(2, Math.floor(normalizedKey.length * 0.15))
  let best: { id: number; title: string; distance: number } | null = null
  for (const c of candidates) {
    const distance = levenshtein(normalizedKey, normalize(c.title))
    if (distance <= threshold && (!best || distance < best.distance)) {
      best = { id: c.id, title: c.title, distance }
    }
  }
  return best
}

export async function buildImportPlan(cinemaId: number, scrapedMovies: ScrapedMovie[]): Promise<ImportPlan> {
  const cinema = await getCinemaById(cinemaId)
  if (!cinema) throw new Error(`Cinema ${cinemaId} not found`)

  const [rooms, allMovies, existingScreenings] = await Promise.all([
    getRoomsByCinema(cinemaId),
    getMovies(),
    getScreenings({ cinemaId, includePast: false }),
  ])

  const roomByNumber = new Map(rooms.map((r) => [r.number, r]))
  const unresolvedRooms = new Set<string>()

  const existingByKey = new Map<string, { id: number; movieTitle: string; roomNumber: string; date: string; time: string }>()
  for (const s of existingScreenings) {
    if (s.room_id == null) continue
    existingByKey.set(`${s.room_id}|${s.date}|${s.time}`, {
      id: s.id,
      movieTitle: s.title,
      roomNumber: s.room ?? '',
      date: s.date,
      time: s.time,
    })
  }
  const usedKeys = new Set<string>()

  const planMovies: ImportPlanMovie[] = []
  const planScreenings: ImportPlanScreening[] = []

  for (const scraped of scrapedMovies) {
    const enriched = await searchAndEnrich(scraped)
    const key = normalize(enriched.title)

    const exact = allMovies.find((m) => normalize(m.title) === key)
    let status: ImportPlanMovie['status'] = 'new'
    let matchedMovieId: number | null = null
    let matchedMovieManualEdit = false
    let duplicateSuggestionId: number | null = null
    let duplicateSuggestionTitle: string | null = null

    if (exact) {
      status = 'existing'
      matchedMovieId = exact.id
      matchedMovieManualEdit = !!exact.manualEdit
    } else {
      const suggestion = findClosestMatch(key, allMovies)
      if (suggestion) {
        status = 'possible_duplicate'
        duplicateSuggestionId = suggestion.id
        duplicateSuggestionTitle = suggestion.title
      }
    }

    planMovies.push({
      key,
      title: enriched.title,
      rating: enriched.rating,
      duration: enriched.duration,
      synopsis: enriched.synopsis,
      posterUrl: enriched.posterUrl,
      tmdbId: enriched.tmdbId,
      voteAverage: enriched.voteAverage,
      originalTitle: enriched.originalTitle,
      director: enriched.director,
      country: enriched.country,
      status,
      matchedMovieId,
      matchedMovieManualEdit,
      duplicateSuggestionId,
      duplicateSuggestionTitle,
    })

    for (const sc of scraped.screenings) {
      const room = roomByNumber.get(sc.room)
      if (!room) {
        unresolvedRooms.add(sc.room)
        continue
      }

      const time = sc.time.length === 5 ? `${sc.time}:00` : sc.time
      const timeHHMM = sc.time.slice(0, 5)
      const dbKey = `${room.id}|${sc.date}|${timeHHMM}`
      const existing = existingByKey.get(dbKey)

      if (existing) {
        usedKeys.add(dbKey)
        const sameMovie = normalize(existing.movieTitle) === key
        planScreenings.push({
          movieKey: key,
          date: sc.date,
          time,
          roomNumber: sc.room,
          roomId: room.id,
          format: sc.format ?? null,
          status: sameMovie ? 'unchanged' : 'movie_changed',
          existingScreeningId: existing.id,
          previousMovieTitle: sameMovie ? null : existing.movieTitle,
        })
      } else {
        planScreenings.push({
          movieKey: key,
          date: sc.date,
          time,
          roomNumber: sc.room,
          roomId: room.id,
          format: sc.format ?? null,
          status: 'new',
          existingScreeningId: null,
          previousMovieTitle: null,
        })
      }
    }
  }

  const orphanScreenings: ImportPlanOrphan[] = []
  for (const [key, s] of existingByKey) {
    if (!usedKeys.has(key)) {
      orphanScreenings.push({
        screeningId: s.id,
        movieTitle: s.movieTitle,
        date: s.date,
        time: s.time,
        roomNumber: s.roomNumber,
      })
    }
  }

  return {
    cinemaId,
    cinemaName: cinema.name,
    movies: planMovies,
    screenings: planScreenings,
    orphanScreenings,
    unresolvedRooms: Array.from(unresolvedRooms),
  }
}

export async function commitImportPlan(plan: ImportPlan, decisions: ImportDecisions): Promise<ImportResult> {
  const result: ImportResult = {
    moviesCreated: 0, moviesUpdated: 0, screeningsCreated: 0, screeningsReassigned: 0, screeningsDeleted: 0,
  }

  await db.transaction(async (tx) => {
    const movieIdByKey = new Map<string, number>()

    for (const m of plan.movies) {
      if (m.status === 'existing') {
        movieIdByKey.set(m.key, m.matchedMovieId!)

        if (!m.matchedMovieManualEdit) {
          const patch: Record<string, unknown> = {}
          if (m.rating != null) patch.rating = m.rating
          if (m.duration != null) patch.durationMinutes = m.duration
          if (m.synopsis != null) patch.synopsis = m.synopsis
          if (m.posterUrl != null) patch.posterUrl = m.posterUrl
          if (m.tmdbId != null) patch.tmdbId = m.tmdbId
          if (m.voteAverage != null) patch.voteAverage = m.voteAverage
          if (m.originalTitle != null) patch.originalTitle = m.originalTitle
          if (m.director != null) patch.director = m.director
          if (m.country != null) patch.country = m.country

          if (Object.keys(patch).length > 0) {
            patch.updatedAt = new Date()
            await tx.update(movies).set(patch).where(eq(movies.id, m.matchedMovieId!))
            result.moviesUpdated++
          }
        }
        continue
      }

      const mergeTargetId = decisions.mergeDuplicates[m.key]
      if (m.status === 'possible_duplicate' && mergeTargetId) {
        movieIdByKey.set(m.key, mergeTargetId)
        continue
      }

      const [created] = await tx.insert(movies).values({
        title: m.title,
        rating: m.rating,
        durationMinutes: m.duration,
        synopsis: m.synopsis,
        posterUrl: m.posterUrl,
        tmdbId: m.tmdbId,
        voteAverage: m.voteAverage,
        originalTitle: m.originalTitle,
        director: m.director,
        country: m.country,
        manualEdit: false,
      }).returning({ id: movies.id })
      movieIdByKey.set(m.key, created.id)
      result.moviesCreated++
    }

    for (const sc of plan.screenings) {
      const movieId = movieIdByKey.get(sc.movieKey)
      if (!movieId) continue

      if (sc.status === 'new') {
        await tx.insert(screenings).values({
          movieId,
          roomId: sc.roomId,
          date: sc.date,
          time: sc.time,
          projectionFormat: sc.format,
        }).onConflictDoNothing()
        result.screeningsCreated++
      } else if (sc.status === 'movie_changed' && sc.existingScreeningId) {
        await tx.update(screenings)
          .set({ movieId, updatedAt: new Date() })
          .where(eq(screenings.id, sc.existingScreeningId))
        result.screeningsReassigned++
      }
    }

    if (decisions.deleteOrphanIds.length > 0) {
      await tx.delete(screenings).where(inArray(screenings.id, decisions.deleteOrphanIds))
      result.screeningsDeleted = decisions.deleteOrphanIds.length
    }
  })

  return result
}
