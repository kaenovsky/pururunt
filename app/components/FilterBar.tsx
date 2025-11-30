import { Filter } from 'lucide-react'

export default function FilterBar({ cinemas, movies, selectedCinema, selectedMovie, onCinemaChange, onMovieChange }: any) {
  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 sm:gap-3">
        
        {/* Select Cine: flex-1 para ocupar espacio equitativo */}
        <div className="relative flex-1">
          <select 
            value={selectedCinema} 
            onChange={(e) => onCinemaChange(e.target.value)}
            className="w-full appearance-none bg-transparent border border-neutral-200 hover:border-neutral-400 text-neutral-900 text-xs sm:text-sm rounded-full py-2 pl-3 pr-8 focus:outline-none transition-colors cursor-pointer truncate"
          >
            <option value="all">Todos los cines</option>
            {cinemas.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Filter className="absolute right-2.5 top-2.5 text-neutral-400 pointer-events-none" size={12} />
        </div>

        {/* Select Película */}
        <div className="relative flex-1">
          <select 
            value={selectedMovie} 
            onChange={(e) => onMovieChange(e.target.value)}
            className="w-full appearance-none bg-transparent border border-neutral-200 hover:border-neutral-400 text-neutral-900 text-xs sm:text-sm rounded-full py-2 pl-3 pr-8 focus:outline-none transition-colors cursor-pointer truncate"
          >
            <option value="all">Todas las películas</option>
            {movies.map((m: string) => <option key={m} value={m}>{m}</option>)}
          </select>
          <Filter className="absolute right-2.5 top-2.5 text-neutral-400 pointer-events-none" size={12} />
        </div>

      </div>
    </div>
  )
}