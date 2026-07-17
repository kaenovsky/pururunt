import 'server-only'
import OpenAI from 'openai'
import type { ScrapedMovie } from './types'

const LORCA_URL = 'https://cinelorca.wixsite.com/cine-lorca/current-production'

// The Wix page embeds the poster as a plain <img>, so a regular fetch (no headless
// browser) is enough. We match on the "cartelera.jpg" filename specifically and take
// the base media URL (before the /v1/fill/... transform) to get the full-resolution image.
export async function detectLorcaImageUrl(websiteUrl?: string | null): Promise<string | null> {
  const url = websiteUrl || LORCA_URL
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Lorca: HTTP ${res.status} fetching ${url}`)
  const html = await res.text()

  const match = html.match(/(https:\/\/static\.wixstatic\.com\/media\/[^"'\s]+?\.jpe?g)\/v1\/[^"'\s]*cartelera\.jpe?g/i)
  return match ? match[1] : null
}

interface LorcaOcrFunction {
  date: string
  time: string
  room: string
}

interface LorcaOcrMovie {
  title: string
  rating: string
  duration: string
  language: string
  functions: LorcaOcrFunction[]
}

interface LorcaOcrResult {
  movies: LorcaOcrMovie[]
}

const LORCA_SCHEMA = {
  type: 'object',
  properties: {
    movies: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Solo el nombre en mayúsculas' },
          rating: { type: 'string', description: 'Ej: ATP, +13, +16' },
          duration: { type: 'string', description: "Texto tal cual aparece, ej '109 MIN'" },
          language: { type: 'string', description: 'Ej: SUBT, DOBLADA, 2D' },
          functions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', description: 'YYYY-MM-DD' },
                time: { type: 'string', description: 'HH:MM' },
                room: { type: 'string', description: "'1' o '2'" },
              },
              required: ['date', 'time', 'room'],
              additionalProperties: false,
            },
          },
        },
        required: ['title', 'rating', 'duration', 'language', 'functions'],
        additionalProperties: false,
      },
    },
  },
  required: ['movies'],
  additionalProperties: false,
} as const

// Ported from the n8n "AI Agent - Lorca OCR" system prompt.
function systemPrompt(year: number): string {
  return `Eres un experto en extracción de datos OCR. Tu tarea es analizar la imagen de la cartelera del 'Cine Lorca' y extraer los datos estructurados.

INSTRUCCIONES DE EXTRACCIÓN:
1. Títulos: Solo el nombre en mayúsculas.
2. Duración: Extrae el texto tal cual aparece (ej: "109 MIN").
3. Salas: Asigna "1" o "2" según la proximidad visual de la hora.
4. Fechas: Calcula los días basándote en el rango de la cartelera (año ${year}). Genera una entrada por cada función.

EJEMPLO DE RAZONAMIENTO (Cómo debes actuar):
Si ves: "KARLA. 16:15 (Sala 1) y 18:20 (Sala 2). Del 27/11 al 28/11"
Debes generar:
- Karla, 27/11, 16:15, Sala 1
- Karla, 27/11, 18:20, Sala 2
- Karla, 28/11, 16:15, Sala 1
- Karla, 28/11, 18:20, Sala 2

IMPORTANTE: Rellena los campos del esquema proporcionado. No inventes datos.`
}

function parseDuration(raw: string): number | null {
  const digits = raw.replace(/\D/g, '')
  return digits ? parseInt(digits, 10) : null
}

export async function extractLorcaFromImage(imageUrl: string): Promise<ScrapedMovie[]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY no está configurada')

  const imgRes = await fetch(imageUrl, { cache: 'no-store' })
  if (!imgRes.ok) throw new Error(`Lorca: HTTP ${imgRes.status} descargando la imagen`)
  const buffer = Buffer.from(await imgRes.arrayBuffer())
  const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
  const base64 = buffer.toString('base64')

  const client = new OpenAI({ apiKey })

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_LORCA_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt(new Date().getFullYear()) },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analiza esta imagen de la cartelera del Cine Lorca.' },
          { type: 'image_url', image_url: { url: `data:${contentType};base64,${base64}` } },
        ],
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'lorca_cartelera', strict: true, schema: LORCA_SCHEMA },
    },
  })

  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('Lorca OCR: respuesta vacía de OpenAI')
  const parsed = JSON.parse(raw) as LorcaOcrResult

  const seenSignatures = new Set<string>()

  return parsed.movies
    .filter((m) => m.functions.length > 0)
    .map((m) => {
      const title = m.title.trim().toUpperCase()
      const screenings = m.functions
        .map((f) => {
          const room = (f.room.match(/\d+/) || ['1'])[0]
          const time = f.time.length === 5 ? `${f.time}:00` : f.time
          const signature = `${title}|${f.date}|${time}|${room}`
          if (seenSignatures.has(signature)) return null
          seenSignatures.add(signature)
          return { date: f.date, time, room, format: m.language || null }
        })
        .filter((s): s is NonNullable<typeof s> => s !== null)

      return {
        title,
        rating: m.rating || null,
        duration: parseDuration(m.duration),
        synopsis: null,
        poster: null,
        screenings,
      }
    })
    .filter((m) => m.screenings.length > 0)
}
