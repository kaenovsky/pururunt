import { Pool, QueryResult } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export interface Screening {
  id: string;
  cinema: string;
  film: string;
  date: string;
  time: string;
  duration: number | null;
  og_link: string;
  rate: string;
  genre: string[];
  format: string;
  timestamp: string;
  scrapped_at: string;
  info: string;
}

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export async function getScreenings(): Promise<Screening[]> {
  const result = await query(`
    SELECT * FROM screenings 
    WHERE timestamp >= NOW() - INTERVAL '1 day'
    ORDER BY timestamp ASC, cinema, film
  `)
  return result.rows as Screening[]
}

export async function getScreeningsByCinema(cinema: string): Promise<Screening[]> {
  const result = await query(`
    SELECT * FROM screenings 
    WHERE cinema = $1 AND timestamp >= NOW()
    ORDER BY timestamp ASC
  `, [cinema])
  return result.rows as Screening[]
}

export async function getScreeningById(id: string): Promise<Screening | null> {
  const result = await query('SELECT * FROM screenings WHERE id = $1', [id])
  return result.rows.length > 0 ? (result.rows[0] as Screening) : null
}