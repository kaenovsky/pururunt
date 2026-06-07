import { getMovies } from '@/lib/db'
import Link from 'next/link'
import { deleteFilmAction } from './actions'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default async function AdminFilmsPage() {
  const films = await getMovies()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Films</h1>
        <Link href="/admin/films/new" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
          <Plus size={16} /> Add film
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600 hidden md:table-cell">Director</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600 hidden lg:table-cell">Country</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600 hidden md:table-cell">Duration</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {films.map((film) => (
              <tr key={film.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-900">{film.title}</td>
                <td className="px-4 py-3 text-neutral-600 hidden md:table-cell">{film.director ?? '—'}</td>
                <td className="px-4 py-3 text-neutral-600 hidden lg:table-cell">{film.country ?? '—'}</td>
                <td className="px-4 py-3 text-neutral-600 hidden md:table-cell">
                  {film.duration ? `${film.duration} min` : '—'}
                </td>
                <td className="px-4 py-3">
                  {film.isFeatured
                    ? <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">Yes</span>
                    : <span className="text-neutral-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/films/${film.id}`} className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors">
                      <Pencil size={15} />
                    </Link>
                    <form action={deleteFilmAction.bind(null, film.id)}>
                      <button
                        type="submit"
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        onClick={(e) => { if (!confirm(`Delete "${film.title}"?`)) e.preventDefault() }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {films.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-400">No films yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
