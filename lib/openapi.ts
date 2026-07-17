// --- REUSABLE SCHEMAS ---

const screeningSchema = {
  type: 'object',
  properties: {
    id:           { type: 'integer',              description: 'Screening ID' },
    movie_id:     { type: 'integer',              description: 'Movie ID' },
    title:        { type: 'string',               description: 'Movie title' },
    poster:       { type: 'string',  nullable: true, description: 'Poster image URL (TMDB)' },
    overview:     { type: 'string',  nullable: true, description: 'Movie synopsis' },
    rating:       { type: 'string',  nullable: true, description: 'Age rating (e.g. ATP, +13)' },
    duration:     { type: 'integer', nullable: true, description: 'Duration in minutes' },
    vote_average: { type: 'string',  nullable: true, description: 'TMDB vote average (0–10)' },
    tmdb_id:      { type: 'integer', nullable: true, description: 'TMDB movie ID' },
    cinema:       { type: 'string',               description: 'Cinema name' },
    room:         { type: 'string',  nullable: true, description: 'Room/screen number' },
    date:         { type: 'string',  format: 'date', description: 'Screening date (YYYY-MM-DD)' },
    time:         { type: 'string',               description: 'Screening time (HH:MM)' },
    format:       { type: 'string',  nullable: true, description: 'Projection format (2D, 4K, 35mm…)' },
    director:     { type: 'string',  nullable: true, description: 'Film director' },
    country:      { type: 'string',  nullable: true, description: 'Country of origin' },
  },
  required: ['id', 'movie_id', 'title', 'cinema', 'date', 'time'],
};

const movieSchema = {
  type: 'object',
  properties: {
    id:           { type: 'integer',              description: 'Movie ID' },
    title:        { type: 'string',               description: 'Movie title' },
    poster:       { type: 'string',  nullable: true, description: 'Poster image URL (TMDB)' },
    overview:     { type: 'string',  nullable: true, description: 'Movie synopsis' },
    rating:       { type: 'string',  nullable: true, description: 'Age rating' },
    duration:     { type: 'integer', nullable: true, description: 'Duration in minutes' },
    vote_average: { type: 'string',  nullable: true, description: 'TMDB vote average (0–10)' },
    tmdb_id:      { type: 'integer', nullable: true, description: 'TMDB movie ID' },
    director:     { type: 'string',  nullable: true, description: 'Film director' },
    country:      { type: 'string',  nullable: true, description: 'Country of origin' },
    isFeatured:   { type: 'boolean', nullable: true, description: 'Shown in the hero section' },
  },
  required: ['id', 'title'],
};

const archivedFilmSchema = {
  allOf: [
    { $ref: '#/components/schemas/Film' },
    {
      type: 'object',
      properties: {
        firstScreeningDate: { type: 'string', format: 'date', description: 'Date of the earliest recorded screening for this film' },
        cinemas:            { type: 'array', items: { type: 'string' }, description: 'Cinemas where this film has screened' },
      },
      required: ['firstScreeningDate', 'cinemas'],
    },
  ],
};

const archivedFilmsPageSchema = {
  type: 'object',
  properties: {
    films:   { type: 'array', items: { $ref: '#/components/schemas/ArchivedFilm' } },
    hasMore: { type: 'boolean', description: 'Whether more films are available at the next offset' },
  },
  required: ['films', 'hasMore'],
};

const roomSchema = {
  type: 'object',
  properties: {
    id:       { type: 'integer',            description: 'Room ID' },
    cinemaId: { type: 'integer', nullable: true, description: 'Parent cinema ID' },
    name:     { type: 'string',  nullable: true, description: 'Room name' },
    number:   { type: 'string',  nullable: true, description: 'Room number' },
  },
  required: ['id'],
};

const cinemaSchema = {
  type: 'object',
  properties: {
    id:      { type: 'integer',            description: 'Cinema ID' },
    name:    { type: 'string',             description: 'Cinema name' },
    address: { type: 'string', nullable: true, description: 'Street address' },
    active:  { type: 'boolean', nullable: true, description: 'Whether the cinema is active' },
  },
  required: ['id', 'name'],
};

const cinemaWithRoomsSchema = {
  allOf: [
    { $ref: '#/components/schemas/Cinema' },
    {
      type: 'object',
      properties: {
        rooms: { type: 'array', items: { $ref: '#/components/schemas/Room' } },
      },
      required: ['rooms'],
    },
  ],
};

const errorSchema = {
  type: 'object',
  properties: { error: { type: 'string' } },
  required: ['error'],
};

// --- REUSABLE PARAMETERS ---

const idPathParam = (entity: string) => ({
  name: 'id',
  in: 'path',
  required: true,
  description: `${entity} ID`,
  schema: { type: 'integer', example: 1 },
});

// --- REUSABLE RESPONSES ---

const errorResponses = {
  '400': { description: 'Bad request / invalid parameters', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
  '404': { description: 'Resource not found',               content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
  '500': { description: 'Internal server error',            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
};

// --- SPEC ---

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'foquito.ar API',
    version: '1.0.0',
    description:
      'REST API for the unified alternative cinema listings of Buenos Aires (CABA). ' +
      'Data is scraped from independent cinemas and updated periodically.',
    contact: { url: 'https://foquito.ar' },
  },
  servers: [
    { url: 'https://foquito.ar',      description: 'Production' },
    { url: 'http://localhost:3000',   description: 'Local development' },
  ],
  tags: [
    { name: 'Screenings', description: 'Upcoming film screenings' },
    { name: 'Films',      description: 'Movie catalog' },
    { name: 'Cinemas',    description: 'Cinema venues and rooms' },
    { name: 'Calendar',   description: 'Calendar export utilities' },
  ],
  paths: {

    // ── SCREENINGS ──────────────────────────────────────────────────────────
    '/api/screenings': {
      get: {
        tags: ['Screenings'],
        summary: 'List upcoming screenings',
        description:
          'Returns upcoming screenings (≥ today) joined with movie and cinema data. ' +
          'All query params are optional and combinable.',
        parameters: [
          {
            name: 'cinema', in: 'query', required: false,
            description: 'Filter by cinema name (partial, case-insensitive). Pass "all" or omit for all cinemas.',
            schema: { type: 'string', example: 'Gaumont' },
          },
          {
            name: 'movie_id', in: 'query', required: false,
            description: 'Filter by movie ID (exact).',
            schema: { type: 'integer', example: 42 },
          },
          {
            name: 'date', in: 'query', required: false,
            description: 'Filter to a specific date (YYYY-MM-DD). Overrides the "upcoming only" default.',
            schema: { type: 'string', format: 'date', example: '2026-06-15' },
          },
        ],
        responses: {
          '200': {
            description: 'Array of screenings',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Screening' } } } },
          },
          ...errorResponses,
        },
      },
    },

    '/api/screenings/{id}': {
      get: {
        tags: ['Screenings'],
        summary: 'Get a screening by ID',
        parameters: [idPathParam('Screening')],
        responses: {
          '200': {
            description: 'A single screening',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Screening' } } },
          },
          ...errorResponses,
        },
      },
    },

    // ── FILMS ────────────────────────────────────────────────────────────────
    '/api/films': {
      get: {
        tags: ['Films'],
        summary: 'List films',
        description: 'Returns all films in the database. Optionally filter by featured status or search by title.',
        parameters: [
          {
            name: 'featured', in: 'query', required: false,
            description: 'If "true", return only films marked as featured.',
            schema: { type: 'boolean', example: true },
          },
          {
            name: 'search', in: 'query', required: false,
            description: 'Case-insensitive partial match on film title.',
            schema: { type: 'string', example: 'parasite' },
          },
        ],
        responses: {
          '200': {
            description: 'Array of films',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Film' } } } },
          },
          ...errorResponses,
        },
      },
    },

    '/api/films/archive': {
      get: {
        tags: ['Films'],
        summary: 'List every film that has ever screened (paginated)',
        description:
          'Historical archive used by the /films page: every film with a poster that has had at least ' +
          'one screening (past or future), ordered by the date of its earliest screening (most recent first).',
        parameters: [
          {
            name: 'limit', in: 'query', required: false,
            description: 'Page size (max 48, default 24).',
            schema: { type: 'integer', example: 24 },
          },
          {
            name: 'offset', in: 'query', required: false,
            description: 'Number of films to skip.',
            schema: { type: 'integer', example: 0 },
          },
        ],
        responses: {
          '200': {
            description: 'A page of the film archive',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ArchivedFilmsPage' } } },
          },
          ...errorResponses,
        },
      },
    },

    '/api/films/{id}': {
      get: {
        tags: ['Films'],
        summary: 'Get a film by ID',
        parameters: [idPathParam('Film')],
        responses: {
          '200': {
            description: 'A single film',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Film' } } },
          },
          ...errorResponses,
        },
      },
    },

    '/api/films/{id}/screenings': {
      get: {
        tags: ['Films', 'Screenings'],
        summary: 'List upcoming screenings for a film',
        parameters: [idPathParam('Film')],
        responses: {
          '200': {
            description: 'Array of upcoming screenings for the given film',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Screening' } } } },
          },
          ...errorResponses,
        },
      },
    },

    // ── CINEMAS ──────────────────────────────────────────────────────────────
    '/api/cinemas': {
      get: {
        tags: ['Cinemas'],
        summary: 'List active cinemas',
        description: 'Returns all cinemas where active = true, ordered alphabetically.',
        responses: {
          '200': {
            description: 'Array of cinemas',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Cinema' } } } },
          },
          ...errorResponses,
        },
      },
    },

    '/api/cinemas/{id}': {
      get: {
        tags: ['Cinemas'],
        summary: 'Get a cinema by ID (includes rooms)',
        parameters: [idPathParam('Cinema')],
        responses: {
          '200': {
            description: 'Cinema with its rooms',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CinemaWithRooms' } } },
          },
          ...errorResponses,
        },
      },
    },

    '/api/cinemas/{id}/screenings': {
      get: {
        tags: ['Cinemas', 'Screenings'],
        summary: 'List upcoming screenings at a cinema',
        parameters: [idPathParam('Cinema')],
        responses: {
          '200': {
            description: 'Array of upcoming screenings at the given cinema',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Screening' } } } },
          },
          ...errorResponses,
        },
      },
    },

    // ── CALENDAR ─────────────────────────────────────────────────────────────
    '/api/ical/{id}': {
      get: {
        tags: ['Calendar'],
        summary: 'Download iCal file for a screening',
        description:
          'Returns an iCalendar (.ics) file for the given screening. ' +
          'Timezone is set to Argentina (UTC−3). Duration defaults to 120 min if not set in the DB.',
        parameters: [idPathParam('Screening')],
        responses: {
          '200': {
            description: 'iCalendar file download',
            headers: {
              'Content-Disposition': {
                description: 'Suggested filename',
                schema: { type: 'string', example: 'attachment; filename="el_arbol.ics"' },
              },
            },
            content: { 'text/calendar': { schema: { type: 'string' } } },
          },
          ...errorResponses,
        },
      },
    },
  },

  components: {
    schemas: {
      Screening:         screeningSchema,
      Film:              movieSchema,
      ArchivedFilm:      archivedFilmSchema,
      ArchivedFilmsPage: archivedFilmsPageSchema,
      Cinema:            cinemaSchema,
      Room:              roomSchema,
      CinemaWithRooms:   cinemaWithRoomsSchema,
      Error:             errorSchema,
    },
  },
};
