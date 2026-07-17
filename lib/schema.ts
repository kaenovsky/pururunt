import { pgTable, serial, text, varchar, integer, decimal, date, time, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const cinemas = pgTable('cinemas', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  address: text('address'),
  phone: varchar('phone'),
  websiteUrl: varchar('website_url'),
  active: boolean('active').default(true),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  cinemaId: integer('cinema_id').references(() => cinemas.id),
  number: varchar('number').notNull(),
  capacity: integer('capacity'),
  format: varchar('format'),
  features: text('features').array(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  originalTitle: text('original_title'),
  durationMinutes: integer('duration_minutes'),
  rating: text('rating'),
  genres: text('genres').array(),
  synopsis: text('synopsis'),
  posterUrl: text('poster_url'),
  trailerUrl: text('trailer_url'),
  active: boolean('active').default(true),
  tmdbId: integer('tmdb_id'),
  voteAverage: decimal('vote_average'),
  director: text('director'),
  country: text('country'),
  manualEdit: boolean('manual_edit').default(false),
  isFeatured: boolean('is_featured'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export const screenings = pgTable('screenings', {
  id: serial('id').primaryKey(),
  movieId: integer('movie_id').references(() => movies.id).notNull(),
  roomId: integer('room_id').references(() => rooms.id),
  date: date('date').notNull(), // YYYY-MM-DD string
  time: time('time').notNull(), // HH:MM:SS string
  projectionFormat: varchar('projection_format'),
  language: varchar('language'),
  price: decimal('price'),
  availableSeats: integer('available_seats'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

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