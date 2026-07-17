import 'server-only'
import { db } from './db'
import { movies, screenings, cinemas, rooms } from './schema'
import { eq, and, inArray } from 'drizzle-orm'

// --- FILMS ---

export interface CreateMovieInput {
  title: string
  posterUrl?: string | null
  synopsis?: string | null
  rating?: string | null
  durationMinutes?: number | null
  voteAverage?: string | null
  tmdbId?: number | null
  director?: string | null
  country?: string | null
  isFeatured?: boolean
  manualEdit?: boolean
}

export async function createMovie(data: CreateMovieInput) {
  const result = await db.insert(movies).values(data).returning()
  return result[0]
}

export async function updateMovie(id: number, data: Partial<CreateMovieInput>) {
  const result = await db.update(movies).set(data).where(eq(movies.id, id)).returning()
  return result[0] ?? null
}

export async function deleteMovie(id: number) {
  await db.delete(movies).where(eq(movies.id, id))
}

// --- CINEMAS ---

export interface CreateCinemaInput {
  name: string
  address?: string | null
  active?: boolean
}

export async function createCinema(data: CreateCinemaInput) {
  const result = await db.insert(cinemas).values(data).returning()
  return result[0]
}

export async function updateCinema(id: number, data: Partial<CreateCinemaInput>) {
  const result = await db.update(cinemas).set(data).where(eq(cinemas.id, id)).returning()
  return result[0] ?? null
}

export async function deleteCinema(id: number) {
  await db.delete(cinemas).where(eq(cinemas.id, id))
}

// --- ROOMS ---

export interface CreateRoomInput {
  cinemaId: number
  number: string
}

export async function createRoom(data: CreateRoomInput) {
  const result = await db.insert(rooms).values(data).returning()
  return result[0]
}

export async function updateRoom(id: number, data: Partial<CreateRoomInput>) {
  const result = await db.update(rooms).set(data).where(eq(rooms.id, id)).returning()
  return result[0] ?? null
}

export async function deleteRoom(id: number) {
  await db.delete(rooms).where(eq(rooms.id, id))
}

// --- SCREENINGS ---

export interface CreateScreeningInput {
  movieId: number
  roomId: number
  date: string
  time: string
  projectionFormat?: string | null
}

export async function createScreening(data: CreateScreeningInput) {
  const result = await db.insert(screenings).values(data).returning()
  return result[0]
}

export async function updateScreening(id: number, data: Partial<CreateScreeningInput>) {
  const result = await db.update(screenings).set(data).where(eq(screenings.id, id)).returning()
  return result[0] ?? null
}

export async function deleteScreening(id: number) {
  await db.delete(screenings).where(eq(screenings.id, id))
}

export async function deleteScreeningsByIds(ids: number[]) {
  if (ids.length === 0) return
  await db.delete(screenings).where(inArray(screenings.id, ids))
}

// Bulk-reassigns every screening of `fromMovieId` at `cinemaId` to `toMovieId`.
// Used to merge scraper-created duplicates and to fix title drift across re-scrapes.
export async function reassignScreeningsMovie(cinemaId: number, fromMovieId: number, toMovieId: number) {
  const cinemaRooms = await db.select({ id: rooms.id }).from(rooms).where(eq(rooms.cinemaId, cinemaId))
  const roomIds = cinemaRooms.map((r) => r.id)
  if (roomIds.length === 0) return 0

  const result = await db.update(screenings)
    .set({ movieId: toMovieId })
    .where(and(eq(screenings.movieId, fromMovieId), inArray(screenings.roomId, roomIds)))
    .returning({ id: screenings.id })

  return result.length
}
