import { getCinemas, getRoomsByCinema } from '@/lib/db'
import Link from 'next/link'
import { deleteCinemaAction } from './actions'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default async function AdminCinemasPage() {
  const cinemas = await getCinemas()
  const cinemasWithRooms = await Promise.all(
    cinemas.map(async (c) => ({ ...c, rooms: await getRoomsByCinema(c.id) }))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Cinemas</h1>
        <Link href="/admin/cinemas/new" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
          <Plus size={16} /> Add cinema
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600 hidden md:table-cell">Address</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Rooms</th>
              <th className="text-left px-4 py-3 font-semibold text-neutral-600">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {cinemasWithRooms.map((cinema) => (
              <tr key={cinema.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-900">{cinema.name}</td>
                <td className="px-4 py-3 text-neutral-600 hidden md:table-cell">{cinema.address ?? '—'}</td>
                <td className="px-4 py-3 text-neutral-600">{cinema.rooms.length}</td>
                <td className="px-4 py-3">
                  {cinema.active
                    ? <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">Yes</span>
                    : <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs font-medium rounded">No</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/cinemas/${cinema.id}`} className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors">
                      <Pencil size={15} />
                    </Link>
                    <form action={deleteCinemaAction.bind(null, cinema.id)}>
                      <button
                        type="submit"
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        onClick={(e) => { if (!confirm(`Delete "${cinema.name}"?`)) e.preventDefault() }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {cinemas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-neutral-400">No cinemas yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
