import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { movies, screenings, rooms, cinemas } from './schema';
import { eq, and, gte, asc, sql, ilike } from 'drizzle-orm';
import { cache } from 'react';
import type { Screening, Movie, Cinema, Room } from './types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool);

// --- SHARED COLUMN MAPS ---

const screeningColumns = {
  id: screenings.id,
  movie_id: movies.id,
  title: movies.title,
  poster: movies.posterUrl,
  overview: movies.synopsis,
  rating: movies.rating,
  duration: movies.durationMinutes,
  vote_average: movies.voteAverage,
  tmdb_id: movies.tmdbId,
  cinema: cinemas.name,
  room: rooms.number,
  date: screenings.date,
  time: sql<string>`to_char(${screenings.time}, 'HH24:MI')`,
  format: screenings.projectionFormat,
  director: movies.director,
  country: movies.country,
};

const movieColumns = {
  id: movies.id,
  title: movies.title,
  poster: movies.posterUrl,
  overview: movies.synopsis,
  rating: movies.rating,
  duration: movies.durationMinutes,
  vote_average: movies.voteAverage,
  tmdb_id: movies.tmdbId,
  director: movies.director,
  country: movies.country,
  isFeatured: movies.isFeatured,
};

const cinemaColumns = {
  id: cinemas.id,
  name: cinemas.name,
  address: cinemas.address,
  active: cinemas.active,
};

const roomColumns = {
  id: rooms.id,
  cinemaId: rooms.cinemaId,
  name: rooms.name,
  number: rooms.number,
};

// --- SCREENINGS ---

export interface ScreeningFilters {
  cinema?: string;   // partial name match
  cinemaId?: number; // exact ID
  movieId?: number;
  date?: string;     // YYYY-MM-DD; omit to default to upcoming (≥ today)
}

export async function getScreenings(filters?: ScreeningFilters): Promise<Screening[]> {
  const dateCond = filters?.date
    ? eq(screenings.date, filters.date)
    : gte(screenings.date, sql`CURRENT_DATE`);

  return db
    .select(screeningColumns)
    .from(screenings)
    .innerJoin(movies, eq(screenings.movieId, movies.id))
    .innerJoin(rooms, eq(screenings.roomId, rooms.id))
    .innerJoin(cinemas, eq(rooms.cinemaId, cinemas.id))
    .where(and(
      dateCond,
      filters?.cinemaId ? eq(cinemas.id, filters.cinemaId) : undefined,
      filters?.cinema   ? ilike(cinemas.name, `%${filters.cinema}%`) : undefined,
      filters?.movieId  ? eq(screenings.movieId, filters.movieId) : undefined,
    ))
    .orderBy(asc(screenings.date), asc(screenings.time), asc(cinemas.name));
}

export const getScreeningById = cache(async (id: string | number): Promise<Screening | null> => {
  const result = await db
    .select(screeningColumns)
    .from(screenings)
    .innerJoin(movies, eq(screenings.movieId, movies.id))
    .innerJoin(rooms, eq(screenings.roomId, rooms.id))
    .innerJoin(cinemas, eq(rooms.cinemaId, cinemas.id))
    .where(eq(screenings.id, Number(id)))
    .limit(1);
  return result[0] ?? null;
});

// --- MOVIES ---

export interface MovieFilters {
  featured?: boolean;
  search?: string;
}

export async function getMovies(filters?: MovieFilters): Promise<Movie[]> {
  return db
    .select(movieColumns)
    .from(movies)
    .where(and(
      filters?.featured !== undefined ? eq(movies.isFeatured, filters.featured) : undefined,
      filters?.search ? ilike(movies.title, `%${filters.search}%`) : undefined,
    ))
    .orderBy(asc(movies.title));
}

export const getMovieById = cache(async (id: string | number): Promise<Movie | null> => {
  const result = await db
    .select(movieColumns)
    .from(movies)
    .where(eq(movies.id, Number(id)))
    .limit(1);
  return result[0] ?? null;
});

export async function getFeaturedMovies(): Promise<Movie[]> {
  return db
    .select(movieColumns)
    .from(movies)
    .where(eq(movies.isFeatured, true))
    .limit(10);
}

// --- CINEMAS ---

export async function getCinemas(): Promise<Cinema[]> {
  return db
    .select(cinemaColumns)
    .from(cinemas)
    .where(eq(cinemas.active, true))
    .orderBy(asc(cinemas.name));
}

export const getCinemaById = cache(async (id: string | number): Promise<Cinema | null> => {
  const result = await db
    .select(cinemaColumns)
    .from(cinemas)
    .where(eq(cinemas.id, Number(id)))
    .limit(1);
  return result[0] ?? null;
});

// --- ROOMS ---

export async function getRoomsByCinema(cinemaId: string | number): Promise<Room[]> {
  return db
    .select(roomColumns)
    .from(rooms)
    .where(eq(rooms.cinemaId, Number(cinemaId)))
    .orderBy(asc(rooms.number));
}
