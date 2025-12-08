import { getScreeningById } from '@/lib/db'
import { Calendar, ExternalLink, Clock, Star, ArrowLeft, Ticket } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export default async function FilmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const screening = await getScreeningById(id)

  if (!screening) {
    notFound()
  }

  const formatDateFull = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`)
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }

  const letterboxdUrl = screening.tmdb_id 
    ? `https://letterboxd.com/tmdb/${screening.tmdb_id}`
    : `https://letterboxd.com/search/${encodeURIComponent(screening.title)}`;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Ir a la cartelera
        </Link>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* COLUMNA IZQUIERDA: Poster (Sticky desktop) */}
          <aside className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="sticky top-24">
              <div className="relative aspect-2/3 rounded-sm overflow-hidden bg-neutral-100 shadow-2xl mb-6">
                <Link href={`/film/${screening.movie_id}`}>
                  {screening.poster ? (
                    <img 
                      src={screening.poster} 
                      alt={screening.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6 text-center border border-neutral-200">
                      <span className="font-serif-display text-2xl text-neutral-400 italic">{screening.title}</span>
                    </div>
                  )}
                </Link>
              </div>

              {/* Data técnica */}
              <div className="flex flex-wrap gap-4 text-sm text-neutral-600 font-medium justify-center md:justify-start">
                {screening.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} /> {screening.duration} min
                  </span>
                )}
                {screening.rating && (
                  <span className="px-2 py-0.5 border border-neutral-200 rounded text-xs uppercase tracking-wider">
                    {screening.rating}
                  </span>
                )}
              </div>
            </div>
          </aside>

          {/* COLUMNA DERECHA: Info y acciones */}
          <article className="flex-1 flex flex-col">
            
            {/* Encabezado */}
            <header className="mb-8 border-b border-neutral-100 pb-8">
              <h1 className="text-4xl md:text-6xl font-serif-display font-bold leading-tight mb-4 text-black">
                {screening.title}
              </h1>
              
              <div className="flex items-center gap-4">
                {screening.vote_average && (
                  <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-full">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-lg">{Number(screening.vote_average).toFixed(1)}</span>
                    <span className="text-neutral-400 text-sm font-normal">en TMDB</span>
                  </div>
                )}
              </div>
            </header>

            {/* Sinopsis */}
            {screening.overview && (
              <section className="mb-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-3">Sinopsis</h3>
                <p className="text-lg leading-relaxed text-neutral-700 max-w-2xl font-serif-display">
                  {screening.overview}
                </p>
              </section>
            )}

            {/* Tarjeta de la función */}
            <section className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-rose-600 mb-1">Función Seleccionada</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-neutral-900">{formatDateFull(screening.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-neutral-600">
                    <Clock size={20} className="text-neutral-400" />
                    <span className="font-medium text-black">{screening.time} hs</span>
                    <span className="text-neutral-300">|</span>
                    <span className="font-medium">{screening.cinema}</span>
                  </div>
                  {screening.format && (
                    <div className="mt-3 inline-block px-2 py-1 bg-white border border-neutral-200 text-xs font-medium uppercase rounded">
                      Proyección: {screening.format}
                    </div>
                  )}
                </div>

                {/* Agregar a calendario */}
                <a 
                  href={`/api/ical/${screening.id}`}
                  className="w-full sm:w-auto px-6 py-4 bg-black text-white text-base font-medium rounded-md hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  download
                >
                  <Calendar size={18} />
                  Agregar a mi calendario
                </a>
              </div>
            </section>

            {/* Botones secundarios */}
            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <a 
                href={letterboxdUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 rounded-md text-neutral-700 hover:border-black hover:text-black transition-colors font-medium"
              >
                <ExternalLink size={18} />
                Ver en Letterboxd
              </a>
            </div>

          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}