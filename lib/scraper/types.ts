export interface ScrapedScreening {
  date: string;   // YYYY-MM-DD
  time: string;    // HH:MM or HH:MM:SS
  room: string;    // room number as it appears at the source (e.g. "1", "2")
  format?: string | null;
}

export interface ScrapedMovie {
  title: string;
  rating?: string | null;
  duration?: number | null;
  synopsis?: string | null;
  poster?: string | null;
  screenings: ScrapedScreening[];
}

export interface EnrichedMovie {
  title: string;
  rating: string | null;
  duration: number | null;
  synopsis: string | null;
  posterUrl: string | null;
  tmdbId: number | null;
  voteAverage: string | null;
  originalTitle: string | null;
  director: string | null;
  country: string | null;
}
