import { getCinemaById, getRoomsByCinema } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { updateCinemaAction, addRoomAction, deleteRoomAction } from '../actions'
import DeleteButton from '@/app/admin/components/DeleteButton'

export default async function EditCinemaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numId = Number(id)

  const [cinema, rooms] = await Promise.all([
    getCinemaById(numId),
    getRoomsByCinema(numId),
  ])
  if (!cinema) notFound()

  const updateAction = updateCinemaAction.bind(null, numId)
  const addRoom      = addRoomAction.bind(null, numId)

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">Edit cinema</h1>

        <form action={updateAction} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="name">Name *</label>
            <input id="name" name="name" required defaultValue={cinema.name} className="form-input" />
          </div>

          <div>
            <label className="form-label" htmlFor="address">Address</label>
            <input id="address" name="address" defaultValue={cinema.address ?? ''} className="form-input" />
          </div>

          <div className="flex items-center gap-3">
            <input id="active" name="active" type="checkbox" defaultChecked={cinema.active ?? true}
              className="h-4 w-4 rounded border-neutral-300 accent-neutral-900" />
            <label htmlFor="active" className="text-sm font-medium text-neutral-700">Active</label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit"
              className="bg-neutral-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
              Save changes
            </button>
            <Link href="/admin/cinemas" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Rooms</h2>

        {rooms.length > 0 && (
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-neutral-600">Room</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-2 text-neutral-700">
                      {room.number ? `Room ${room.number}` : `Room #${room.id}`}
                    </td>
                    <td className="px-4 py-2 flex justify-end">
                      <DeleteButton
                        action={deleteRoomAction.bind(null, numId, room.id)}
                        confirm="Delete this room?"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form action={addRoom} className="flex items-end gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex-1">
            <label className="form-label" htmlFor="number">Room number</label>
            <input id="number" name="number" placeholder="1" className="form-input" />
          </div>
          <button type="submit"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors whitespace-nowrap">
            <Plus size={15} /> Add room
          </button>
        </form>
      </div>
    </div>
  )
}
