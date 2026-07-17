import { getArchivedMovies } from '@/lib/db'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import FilmsArchiveClient from './FilmsArchiveClient'

export const revalidate = 3600

const PAGE_SIZE = 24

export default async function FilmsPage() {
  const rows = await getArchivedMovies({ limit: PAGE_SIZE + 1, offset: 0 })
  const hasMore = rows.length > PAGE_SIZE
  const films = rows.slice(0, PAGE_SIZE)

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <Navbar />

      <header className="max-w-7xl mx-auto px-4 pt-10">
        <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-black">Archivo</h1>
        <p className="text-neutral-500 mt-2">Todas las películas que pasaron por foquito, mes a mes.</p>
      </header>

      <FilmsArchiveClient initialFilms={films} initialHasMore={hasMore} />

      <Footer />
    </div>
  )
}
