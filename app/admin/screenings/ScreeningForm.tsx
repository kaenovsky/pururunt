'use client'
import { useState, useTransition } from 'react'
import type { Cinema, Room, Movie, Screening } from '@/lib/types'
import { getRoomsForCinemaAction } from './actions'
import Link from 'next/link'

interface ScreeningFormProps {
  cinemas:  Cinema[]
  movies:   Movie[]
  screening?: Screening
  action:   (formData: FormData) => Promise<void>
  initialRooms?: Room[]
}

export default function ScreeningForm({ cinemas, movies, screening, action, initialRooms = [] }: ScreeningFormProps) {
  const [rooms, setRooms]       = useState<Room[]>(initialRooms)
  const [roomId, setRoomId]     = useState<number | ''>(screening?.id ? (initialRooms[0]?.id ?? '') : '')
  const [pending, startTransition] = useTransition()

  function handleCinemaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const cinemaId = Number(e.target.value)
    setRooms([])
    setRoomId('')

    if (!cinemaId) return

    startTransition(async () => {
      const fetched = await getRoomsForCinemaAction(cinemaId)
      setRooms(fetched)
      if (fetched.length === 1) setRoomId(fetched[0].id)
    })
  }

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="movieId">Film *</label>
          <select id="movieId" name="movieId" required defaultValue={screening?.movie_id ?? ''}
            className="form-input">
            <option value="">Select a film…</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="cinema">Cinema *</label>
          <select id="cinema" name="cinema" required onChange={handleCinemaChange}
            className="form-input">
            <option value="">Select a cinema…</option>
            {cinemas.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="roomId">
            Room * {pending && <span className="text-neutral-400 font-normal">(loading…)</span>}
          </label>
          <select
            id="roomId"
            name="roomId"
            required
            value={roomId}
            onChange={(e) => setRoomId(Number(e.target.value))}
            disabled={rooms.length === 0}
            className="form-input disabled:opacity-40"
          >
            <option value="">
              {rooms.length === 0 ? 'Select a cinema first' : 'Select a room…'}
            </option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.number ? `Room ${r.number}` : ''}{r.name ? ` — ${r.name}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="date">Date *</label>
          <input id="date" name="date" type="date" required
            defaultValue={screening?.date ?? ''}
            className="form-input" />
        </div>

        <div>
          <label className="form-label" htmlFor="time">Time *</label>
          <input id="time" name="time" type="time" required
            defaultValue={screening?.time ?? ''}
            className="form-input" />
        </div>

        <div>
          <label className="form-label" htmlFor="format">Projection format</label>
          <input id="format" name="format" placeholder="2D, 4K, 35mm…"
            defaultValue={screening?.format ?? ''}
            className="form-input" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit"
          className="bg-neutral-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
          {screening ? 'Save changes' : 'Create screening'}
        </button>
        <Link href="/admin/screenings" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  )
}
