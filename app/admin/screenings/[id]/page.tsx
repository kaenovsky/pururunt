import { getScreeningById, getCinemas, getMovies, getRoomsByCinema } from '@/lib/db'
import { notFound } from 'next/navigation'
import ScreeningForm from '../ScreeningForm'
import { updateScreeningAction } from '../actions'

export default async function EditScreeningPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const screening = await getScreeningById(id)
  if (!screening) notFound()

  const [cinemas, movies, initialRooms] = await Promise.all([
    getCinemas(),
    getMovies(),
    screening.cinema_id ? getRoomsByCinema(screening.cinema_id) : Promise.resolve([]),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Edit screening</h1>
      <ScreeningForm
        cinemas={cinemas}
        movies={movies}
        screening={screening}
        action={updateScreeningAction.bind(null, screening.id)}
        initialRooms={initialRooms}
        initialCinemaId={screening.cinema_id ?? undefined}
      />
    </div>
  )
}
