import { getFeaturedMovies } from '@/lib/db'
import { Star, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface MovieData {
  id: number;
  title: string;
  poster: string | null;
  vote_average: string | number | null;
  duration: number | null;
  director: string | null;
  overview?: string | null;
}

export default async function Hero() {
  
  const featuredMovies = await getFeaturedMovies() as MovieData[];
  
  const movie = featuredMovies.find(m => m.poster); 

  if (!movie || !movie.poster) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden border-b border-sepia-border bg-black">
    
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 blur-lg scale-110"
          style={{ backgroundImage: `url(${movie.poster})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-end gap-8">
        
        <div className="w-32 md:w-48 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-sm overflow-hidden border border-white/10 mx-auto md:mx-0">

           <Link href={`/film/${movie.id}`}> 
             <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
           </Link>
        </div>
        
        <div className="flex-1 flex flex-col text-left text-white">
          
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-accent text-white rounded-sm shadow-sm">
              Destacado
            </span>
          </div>
          
          <Link href={`/film/${movie.id}`} className="group"> 
            <h2 className="text-4xl md:text-6xl font-black leading-[0.9] mb-4 tracking-tight group-hover:text-amber-200 transition-colors">
              {movie.title}
            </h2>
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/80 mb-4">
            {movie.vote_average && (
              <span className="flex items-center gap-1 text-amber-400">
                <Star size={14} fill="currentColor" /> 
                {Number(movie.vote_average).toFixed(1)}
              </span>
            )}
            {movie.duration && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> 
                {movie.duration} min
              </span>
            )}
            <span className="text-white/40">|</span>
            <span className="uppercase text-xs tracking-wider text-white/60">
              {movie.director || "Cartelera"}
            </span>
          </div>

          <div className="max-w-2xl">
             <p className="text-white/80 leading-relaxed text-sm md:text-base line-clamp-4 mb-4 font-light">
              {movie.overview}
            </p>
            
            <Link 
              href={`/film/${movie.id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-amber-300 transition-colors border-b border-transparent hover:border-amber-300 pb-0.5"
            >
              Leer más <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}