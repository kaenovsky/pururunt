import { pgTable, serial, text, integer, decimal, timestamp, date, time, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- TABLAS ---

export const cinemas = pgTable('cinemas', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  active: boolean('active').default(true),
});

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  cinemaId: integer('cinema_id').references(() => cinemas.id),
  name: text('name'),
  number: text('number'),
});

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  posterUrl: text('poster_url'),
  synopsis: text('synopsis'),
  rating: text('rating'),
  durationMinutes: integer('duration_minutes'),
  voteAverage: decimal('vote_average'),
  tmdbId: integer('tmdb_id'),
  director: text('director'),
  country: text('country'),
  isFeatured: boolean('is_featured'),
});

export const screenings = pgTable('screenings', {
  id: serial('id').primaryKey(),
  movieId: integer('movie_id').references(() => movies.id).notNull(),
  roomId: integer('room_id').references(() => rooms.id),
  date: date('date').notNull(), // YYYY-MM-DD string
  time: time('time').notNull(), // HH:MM:SS string
  projectionFormat: text('projection_format'),
});

// --- RELACIONES ---

export const screeningsRelations = relations(screenings, ({ one }) => ({
  movie: one(movies, {
    fields: [screenings.movieId],
    references: [movies.id],
  }),
  room: one(rooms, {
    fields: [screenings.roomId],
    references: [rooms.id],
  }),
}));

export const roomsRelations = relations(rooms, ({ one }) => ({
  cinema: one(cinemas, {
    fields: [rooms.cinemaId],
    references: [cinemas.id],
  }),
}));