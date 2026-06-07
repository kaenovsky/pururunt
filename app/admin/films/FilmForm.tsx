import type { Movie } from '@/lib/types'
import Link from 'next/link'

interface FilmFormProps {
  film?: Movie
  action: (formData: FormData) => Promise<void>
}

export default function FilmForm({ film, action }: FilmFormProps) {
  const v = (field: keyof Movie) => film?.[field] ?? ''

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="title">Title *</label>
          <input id="title" name="title" required defaultValue={v('title') as string}
            className="form-input" />
        </div>

        <div>
          <label className="form-label" htmlFor="director">Director</label>
          <input id="director" name="director" defaultValue={v('director') as string}
            className="form-input" />
        </div>

        <div>
          <label className="form-label" htmlFor="country">Country</label>
          <input id="country" name="country" defaultValue={v('country') as string}
            className="form-input" />
        </div>

        <div>
          <label className="form-label" htmlFor="duration">Duration (min)</label>
          <input id="duration" name="duration" type="number" min="1" defaultValue={v('duration') as number}
            className="form-input" />
        </div>

        <div>
          <label className="form-label" htmlFor="rating">Rating</label>
          <input id="rating" name="rating" placeholder="ATP, +13…" defaultValue={v('rating') as string}
            className="form-input" />
        </div>

        <div>
          <label className="form-label" htmlFor="tmdbId">TMDB ID</label>
          <input id="tmdbId" name="tmdbId" type="number" defaultValue={v('tmdb_id') as number}
            className="form-input" />
        </div>

        <div>
          <label className="form-label" htmlFor="voteAverage">Vote average</label>
          <input id="voteAverage" name="voteAverage" type="number" step="0.1" min="0" max="10"
            defaultValue={v('vote_average') as string} className="form-input" />
        </div>

        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="posterUrl">Poster URL</label>
          <input id="posterUrl" name="posterUrl" type="url" defaultValue={v('poster') as string}
            className="form-input" />
        </div>

        <div className="sm:col-span-2">
          <label className="form-label" htmlFor="synopsis">Synopsis</label>
          <textarea id="synopsis" name="synopsis" rows={4} defaultValue={v('overview') as string}
            className="form-input resize-none" />
        </div>

        <div className="sm:col-span-2 flex items-center gap-3">
          <input id="isFeatured" name="isFeatured" type="checkbox"
            defaultChecked={film?.isFeatured ?? false}
            className="h-4 w-4 rounded border-neutral-300 accent-neutral-900" />
          <label htmlFor="isFeatured" className="text-sm font-medium text-neutral-700">
            Show in hero section (featured)
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit"
          className="bg-neutral-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
          {film ? 'Save changes' : 'Create film'}
        </button>
        <Link href="/admin/films" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  )
}
