import { Star } from 'lucide-react'
import Link from 'next/link';

interface HeroProps { movies: any[] }

export default function Hero({ movies }: HeroProps) {
  const heroMovies = Array.from(new Map(movies.map(m => [m.title, m])).values())
    .filter((m: any) => m.poster)
    .slice(0, 1);

  if (heroMovies.length === 0) return null;
  const movie = heroMovies[0];

  return (
    <section className="relative w-full py-10 md:py-14 border-b border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6 md:gap-10">
        
        <div className="w-40 md:w-56 shrink-0 mx-auto md:mx-0 shadow-2xl rounded-sm overflow-hidden self-start">
          <Link
          href={`/film/${movie.movie_id}`} 
          className="block">
           <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full h-auto object-cover"
          />
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col text-center md:text-left h-full min-h-[280px]">
          
          <div className="mb-4">
            <span className="inline-block px-2 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase bg-rose-50 text-rose-600 rounded-sm">
              Destacado de la semana
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif-display font-bold leading-[0.95] text-neutral-900 tracking-tight">
              {movie.title}
            </h2>
          </div>
          
          <div className="flex-1 mb-6">
             <p className="text-neutral-500 leading-relaxed text-sm md:text-base max-w-2xl mx-auto md:mx-0 line-clamp-4">
              {movie.overview}
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-neutral-100 md:border-none flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm font-medium text-neutral-600">
            {movie.vote_average && (
              <span className="flex items-center gap-1.5 text-black bg-neutral-100 px-2 py-1 rounded-md">
                <Star size={14} className="text-yellow-500 fill-yellow-500" /> 
                {Number(movie.vote_average).toFixed(1)}
              </span>
            )}
            
            {movie.duration && (
              <span className="flex items-center gap-1">
                {movie.duration} min
              </span>
            )}
            
            <span className="hidden md:inline text-neutral-300">|</span>
            <span className="uppercase text-xs tracking-wider text-neutral-400">
              Disponible en cartelera
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}