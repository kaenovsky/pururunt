import FilmForm from '../FilmForm'
import { createFilmAction } from '../actions'

export default function NewFilmPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Add film</h1>
      <FilmForm action={createFilmAction} />
    </div>
  )
}
