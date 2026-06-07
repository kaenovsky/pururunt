import { getScreeningById, getCinemas, getMovies, getRoomsByCinema } from '@/lib/db'
import { notFound } from 'next/navigation'
import ScreeningForm from '../ScreeningForm'
import { updateScreeningAction } from '../actions'
import { db } from '@/lib/db'
import { rooms } from '@/lib/schema'
import { eq } from 'drizzle-orm'

async function getCinemaIdForRoom(roomId: number): Promise<number | null> {
  const result = await db.select({ cinemaId: rooms.cinemaId }).from(rooms).where(eq(rooms.id, roomId)).limit(1)
  return result[0]?.cinemaId ?? null
}

export default async function EditScreeningPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const screening = await getScreeningById(id)
  if (!screening) notFound()

  const cinemaId = screening.room
    ? await getCinemaIdForRoom(
        await db.select({ id: rooms.id }).from(rooms)
          .where(eq(rooms.number, screening.room))
          .limit(1)
          .then(r => r[0]?.id ?? 0)
      )
    : null

  const [cinemas, movies, initialRooms] = await Promise.all([
    getCinemas(),
    getMovies(),
    cinemaId ? getRoomsByCinema(cinemaId) : Promise.resolve([]),
  ])

  const action = updateScreeningAction.bind(null, screening.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Edit screening</h1>
      <ScreeningForm
        cinemas={cinemas}
        movies={movies}
        screening={screening}
        action={action}
        initialRooms={initialRooms}
      />
    </div>
  )
}
