import { getMovies, getMoviesCount } from '@/lib/db'
import Link from 'next/link'
import { deleteFilmAction } from './actions'
import { Pencil, Plus, Search } from 'lucide-react'
import DeleteButton from '@/app/admin/components/DeleteButton'

const PAGE_SIZE = 25

export default async function AdminFilmsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const { page: pageStr, search } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const [films, total] = await Promise.all([
    getMovies({ search: search || undefined, limit: PAGE_SIZE, offset }),
    getMoviesCount({ search: search || undefined }),
  ])
  const totalPages = Math.ceil(total / PAGE_SIZE)

  function pageUrl(p: number) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/admin/films?${qs}` : '/admin/films'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Films</h1>
        <Link
          href="/admin/films/new"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors"
        >
          <Plus size={16} /> Add film
        </Link>
      </div>

      <form className="mb-4 flex gap-2" method="GET">
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            name="search"
            type="search"
            placeholder="Search films…"
            defaultValue={search ?? ''}
            className="form-input pl-9"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors"
        >
          Search
        </button>
        {search && (
          <Link href="/admin/films" className="px-4 py-2 border border-neutral-300 rounded-md text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
            Clear
          </Link>
        )}
      </form>

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
                    <Link
                      href={`/admin/films/${film.id}`}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <DeleteButton
                      action={deleteFilmAction.bind(null, film.id)}
                      confirm={`Delete "${film.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {films.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-400">
                  {search ? `No films matching "${search}".` : 'No films yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-neutral-500">
        <span>
          {total} film{total !== 1 ? 's' : ''}
          {search ? ` matching "${search}"` : ''}
          {totalPages > 1 ? ` — page ${page} of ${totalPages}` : ''}
        </span>
        {totalPages > 1 && (
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={pageUrl(page - 1)} className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors">
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={pageUrl(page + 1)} className="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors">
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
