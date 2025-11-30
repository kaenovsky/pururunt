import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { movies, screenings, rooms, cinemas } from './schema';
import { eq, and, gte, asc, sql, ilike } from 'drizzle-orm';

// --- CONFIG ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const db = drizzle(pool);

// --- INTERFACES ---

export interface Screening {
  id: number;
  movie_id: number;
  title: string;
  poster: string | null;
  overview: string | null;
  rating: string | null;
  duration: number | null;
  vote_average: string | null;
  tmdb_id: number | null;
  cinema: string;
  room: string | null;
  date: string;
  time: string;
  format: string | null;
  director: string | null;
  country: string | null;
}

export interface Movie {
  id: number;
  title: string;
  poster: string | null;
  overview: string | null;
  rating: string | null;
  duration: number | null;
  vote_average: string | null;
  tmdb_id: number | null;
  director: string | null;
  country: string | null;
}

// --- FUNCIONES ---

export async function getScreenings(): Promise<Screening[]> {
  return await db.select({
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
  })
  .from(screenings)
  .innerJoin(movies, eq(screenings.movieId, movies.id))
  .innerJoin(rooms, eq(screenings.roomId, rooms.id))
  .innerJoin(cinemas, eq(rooms.cinemaId, cinemas.id))
  .where(gte(screenings.date, sql`CURRENT_DATE`))
  .orderBy(asc(screenings.date), asc(screenings.time), asc(cinemas.name));
}

export async function getScreeningsByCinema(cinemaName: string): Promise<Screening[]> {
  return await db.select({
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
  })
  .from(screenings)
  .innerJoin(movies, eq(screenings.movieId, movies.id))
  .innerJoin(rooms, eq(screenings.roomId, rooms.id))
  .innerJoin(cinemas, eq(rooms.cinemaId, cinemas.id))
  .where(
    and(
      gte(screenings.date, sql`CURRENT_DATE`),
      ilike(cinemas.name, `%${cinemaName}%`)
    )
  )
  .orderBy(asc(screenings.date), asc(screenings.time));
}

export async function getMovieById(id: string | number): Promise<Movie | null> {
  const result = await db.select({
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
  })
  .from(movies)
  .where(eq(movies.id, Number(id)))
  .limit(1);

  return result[0] || null;
}

export async function getScreeningsByMovieId(movieId: string | number): Promise<Screening[]> {
  return await db.select({
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
  })
  .from(screenings)
  .innerJoin(movies, eq(screenings.movieId, movies.id))
  .innerJoin(rooms, eq(screenings.roomId, rooms.id))
  .innerJoin(cinemas, eq(rooms.cinemaId, cinemas.id))
  .where(
    and(
      eq(screenings.movieId, Number(movieId)),
      gte(screenings.date, sql`CURRENT_DATE`)
    )
  )
  .orderBy(asc(screenings.date), asc(screenings.time));
}

export async function getScreeningById(id: string | number): Promise<Screening | null> {
  const result = await db.select({
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
  })
  .from(screenings)
  .innerJoin(movies, eq(screenings.movieId, movies.id))
  .innerJoin(rooms, eq(screenings.roomId, rooms.id))
  .innerJoin(cinemas, eq(rooms.cinemaId, cinemas.id))
  .where(eq(screenings.id, Number(id)))
  .limit(1);

  return result[0] || null;
}