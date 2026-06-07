import { getCinemas, getMovies } from '@/lib/db'
import ScreeningForm from '../ScreeningForm'
import { createScreeningAction } from '../actions'

export default async function NewScreeningPage() {
  const [cinemas, movies] = await Promise.all([getCinemas(), getMovies()])

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Add screening</h1>
      <ScreeningForm cinemas={cinemas} movies={movies} action={createScreeningAction} />
    </div>
  )
}
