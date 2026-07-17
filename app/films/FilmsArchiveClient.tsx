'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { ArchivedMovie } from '@/lib/types'
import FilmCard from './FilmCard'
import FilmCardSkeleton from './FilmCardSkeleton'

interface FilmsArchiveClientProps {
  initialFilms: ArchivedMovie[]
  initialHasMore: boolean
}

interface MonthGroup {
  label: string
  films: ArchivedMovie[]
}

const PAGE_SIZE = 24
const GRID_CLASSES = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'

function formatMonthLabel(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`)
  const label = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

// Films arrive already sorted by firstScreeningDate desc, so consecutive same-month
// entries can just be merged into the running last group instead of a full re-group.
function groupByMonth(films: ArchivedMovie[]): MonthGroup[] {
  const groups: MonthGroup[] = []
  for (const film of films) {
    const label = formatMonthLabel(film.firstScreeningDate)
    const last = groups[groups.length - 1]
    if (last && last.label === label) {
      last.films.push(film)
    } else {
      groups.push({ label, films: [film] })
    }
  }
  return groups
}

export default function FilmsArchiveClient({ initialFilms, initialHasMore }: FilmsArchiveClientProps) {
  const [films, setFilms] = useState<ArchivedMovie[]>(initialFilms)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)
    setError(false)

    try {
      const res = await fetch(`/api/films/archive?limit=${PAGE_SIZE}&offset=${films.length}`)
      if (!res.ok) throw new Error('Request failed')
      const data: { films: ArchivedMovie[]; hasMore: boolean } = await res.json()
      setFilms((prev) => [...prev, ...data.films])
      setHasMore(data.hasMore)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [films.length, hasMore])

  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '600px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  const groups = groupByMonth(films)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {groups.length === 0 && !loading && (
        <div className="text-center py-20 border border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-400">Todavía no hay películas en el archivo.</p>
        </div>
      )}

      {groups.map((group) => (
        <section key={group.label} className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4 border-b border-neutral-100 pb-2">
            {group.label}
          </h2>
          <div className={GRID_CLASSES}>
            {group.films.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        </section>
      ))}

      {loading && (
        <div className={GRID_CLASSES}>
          {Array.from({ length: 6 }).map((_, i) => <FilmCardSkeleton key={i} />)}
        </div>
      )}

      {error && (
        <div className="text-center py-6">
          <button type="button" onClick={loadMore} className="text-sm text-neutral-500 hover:text-black underline">
            Error cargando más películas — reintentar
          </button>
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </div>
  )
}
