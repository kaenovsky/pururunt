import { getMovieById, getScreeningsByMovieId } from '@/lib/db'
import { Clock, Star, Calendar, MapPin, ArrowLeft } from 'lucide-react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [movie, screenings] = await Promise.all([
    getMovieById(id),
    getScreeningsByMovieId(id) 
  ])

  if (!movie) notFound()

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`)
    return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={16} /> Volver
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          
          <aside className="w-full md:w-64 shrink-0 mx-auto md:mx-0">
            <div className="sticky top-24">
              <div className="relative aspect-2/3 rounded-sm overflow-hidden shadow-2xl bg-neutral-100">
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-50 text-neutral-300">Sin Imagen</div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col gap-3 text-sm text-neutral-600">
                {movie.vote_average && (
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-black">{Number(movie.vote_average).toFixed(1)}</span>
                    <span>en TMDB</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> {movie.duration} min
                  </div>
                )}
              </div>
            </div>
          </aside>

          <article className="flex-1">
            <h1 className="text-4xl md:text-5xl font-serif-display font-bold leading-tight mb-6 text-black">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-8 font-medium">
                {movie.director && (
                <span className="flex items-center gap-1">
                    <span className="text-neutral-400 font-normal">Dir.</span> 
                    <span className="text-black border-b border-neutral-200 pb-0.5">{movie.director}</span>
                </span>
                )}
        
                {movie.country && (
                <>
                    <span className="text-neutral-300">•</span>
                    <span>{movie.country}</span>
                </>
                )}

                {movie.duration && (
                <>
                    <span className="text-neutral-300">•</span>
                    <span>{movie.duration} min</span>
                </>
                )}
            </div>

            {movie.overview && (
              <p className="text-lg leading-relaxed text-neutral-700 font-serif-display mb-12 max-w-2xl">
                {movie.overview}
              </p>
            )}

            {/* SECCIÓN DE FUNCIONES */}
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 border-b border-neutral-100 pb-2">
              Próximas Funciones
            </h3>

            {screenings.length === 0 ? (
              <p className="text-neutral-500 italic">No hay funciones programadas próximamente.</p>
            ) : (
              <div className="grid gap-4">
                {screenings.map((s) => (
                  <Link 
                    key={s.id} 
                    href={`/screening/${s.id}`}
                    className="group block border border-neutral-200 rounded-lg p-4 hover:border-black transition-colors bg-neutral-50/50 hover:bg-white"
                  >
                    <div className="flex items-center justify-between">
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center w-16 leading-tight">
                          <span className="block text-xs font-bold uppercase text-neutral-400">
                            {formatDate(s.date).split(' ')[0]}
                          </span>
                          <span className="block text-2xl font-bold text-black">
                            {s.date.split('-')[2]}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg text-neutral-900">{s.time} hs</span>
                            {s.format && (
                              <span className="text-[10px] uppercase border border-neutral-200 px-1.5 rounded text-neutral-500">
                                {s.format}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                            <MapPin size={14} />
                            <span className={s.cinema.toLowerCase().includes('lorca') ? 'text-rose-700 font-medium' : 'text-neutral-700'}>
                              {s.cinema}
                            </span>
                            {s.room && <span className="text-neutral-400">· Sala {s.room}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-neutral-300 group-hover:text-black transition-colors">
                        <Calendar size={20} />
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}