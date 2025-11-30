import { Star, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link';

export default function ScreeningCard({ screening }: { screening: any }) {
  const letterboxdUrl = screening.tmdb_id 
    ? `https://letterboxd.com/tmdb/${screening.tmdb_id}`
    : `https://letterboxd.com/search/${encodeURIComponent(screening.title)}`;

  return (
    <div className="group flex flex-col h-full">
      
      {/* IMAGEN */}
      <div className="relative aspect-2/3 overflow-hidden rounded-sm bg-neutral-100">
        <Link href={`/screening/${screening.id}`} className="block relative aspect-2/3 overflow-hidden rounded-sm bg-neutral-100 cursor-pointer">
          {screening.poster ? (
            <img 
              src={screening.poster} 
              alt={screening.title} 
              className="w-full h-full object-cover group-hover:opacity-95 transition-opacity duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center border border-neutral-200">
              <span className="font-serif-display text-xl text-neutral-400 italic">{screening.title}</span>
            </div>
          )}
        </Link>

        {/* Rating Pill */}
        {screening.vote_average && (
          <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star size={8} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold">{Number(screening.vote_average).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium truncate">
          {screening.director ? screening.director : screening.country}
        </div>
        <h3 className="text-sm font-bold leading-tight text-black line-clamp-1" title={screening.title}>
          {screening.title}
        </h3>

        <span className={`text-[10px] font-bold text-blue-950`}>
            {screening.cinema}
        </span>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="font-medium text-black bg-neutral-100 px-1.5 py-0.5 rounded">
            {screening.time} hs
          </span>
          {screening.duration && <span>{screening.duration} min</span>}
        </div>

        {/* Acciones */}
        <div className="flex gap-4 mt-2">
          <a 
            href={`/api/ical/${screening.id}`}
            className="text-neutral-400 hover:text-black transition-colors"
            title="Agendar"
          >
            <Calendar size={14} />
          </a>
          <a 
            href={letterboxdUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-green-600 transition-colors"
            title="Ver en Letterboxd"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}