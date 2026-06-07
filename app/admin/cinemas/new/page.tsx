import { createCinemaAction } from '../actions'
import Link from 'next/link'

export default function NewCinemaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Add cinema</h1>

      <form action={createCinemaAction} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="name">Name *</label>
            <input id="name" name="name" required className="form-input" />
          </div>

          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="address">Address</label>
            <input id="address" name="address" className="form-input" />
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm font-semibold text-neutral-700 mb-3">First room (optional)</p>
            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <label className="form-label" htmlFor="roomNumber">Room number</label>
                <input id="roomNumber" name="roomNumber" placeholder="1" className="form-input" />
              </div>
              <div>
                <label className="form-label" htmlFor="roomName">Room name</label>
                <input id="roomName" name="roomName" placeholder="Sala principal" className="form-input" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit"
            className="bg-neutral-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
            Create cinema
          </button>
          <Link href="/admin/cinemas" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
