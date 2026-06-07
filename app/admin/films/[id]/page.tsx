import { getMovieById } from '@/lib/db'
import { notFound } from 'next/navigation'
import FilmForm from '../FilmForm'
import { updateFilmAction } from '../actions'

export default async function EditFilmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const film = await getMovieById(id)
  if (!film) notFound()

  const action = updateFilmAction.bind(null, film.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Edit film</h1>
      <FilmForm film={film} action={action} />
    </div>
  )
}
