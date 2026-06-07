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
  cinema_id: number;
  room: string | null;
  room_id: number | null;
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
  isFeatured: boolean | null;
}

export interface Cinema {
  id: number;
  name: string;
  address: string | null;
  active: boolean | null;
}

export interface Room {
  id: number;
  cinemaId: number | null;
  name: string | null;
  number: string | null;
}

export interface CinemaWithRooms extends Cinema {
  rooms: Room[];
}
