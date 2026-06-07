import { getScreenings, getScreeningsCount } from '@/lib/db'
import Link from 'next/link'
import { deleteScreeningAction } from './actions'
import { Pencil, Plus } from 'lucide-react'
import DeleteButton from '@/app/admin/components/DeleteButton'

const PAGE_SIZE = 30

export default async function AdminScreeningsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const [screenings, total] = await Promise.all([
    getScreenings({ includePast: true, limit: PAGE_SIZE, offset }),
    getScreeningsCount({ includePast: true }),
  ])
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const fmt = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString('es-AR', {
      weekday: 'short', day: 'numeric', month: 'short',
    })

  function pageUrl(p: number) {
    return p > 1 ? `/admin/screenings?page=${p}` : '/admin/screenings'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Screenings</h1>
        <Link
          href="/admin/screenings/new"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors"
        >
          <Plus size={16} /> Add screening
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Film</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Cinema</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Time</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600 hidden md:table-cell">Format</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {screenings.map((s) => (
              <tr key={s.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-900 max-w-[200px] truncate">{s.title}</td>
                <td className="px-4 py-3 text-neutral-600">{s.cinema}</td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">{fmt(s.date)}</td>
                <td className="px-4 py-3 text-neutral-600">{s.time}</td>
                <td className="px-4 py-3 text-neutral-500 hidden md:table-cell">{s.format ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/screenings/${s.id}`}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
                    >
                      <Pencil size={15} />
                    </Link>
                    <DeleteButton
                      action={deleteScreeningAction.bind(null, s.id)}
                      confirm={`Delete screening of "${s.title}" on ${s.date}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {screenings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-400">No screenings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-neutral-500">
        <span>{total} screening{total !== 1 ? 's' : ''}{totalPages > 1 ? ` — page ${page} of ${totalPages}` : ''}</span>
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
