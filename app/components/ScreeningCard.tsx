import { Star } from 'lucide-react'
import Link from 'next/link'
import ScreeningModalTrigger from './ScreeningModalTrigger'

export default function ScreeningCard({ screening }: { screening: any }) {

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
  
        <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium truncate h-3.5 leading-none">
          {/*
            Lógica de visualización: 
            1. Si hay director, lo muestra.
            2. Si no hay director, pero hay país, muestra el país.
            3. Si no hay ninguno, el div está vacío, pero mantiene su altura (h-3.5)
              gracias al 'leading-none', evitando que el título se mueva.
          */}
          {screening.director 
            ? screening.director 
            : screening.country
          }
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
        <div className="mt-2">          
          <ScreeningModalTrigger screening={screening}>
            <button
              className="w-full flex items-center justify-center gap-2 bg-neutral-100 py-2 px-4 rounded-lg text-sm font-semibold text-neutral-600 hover:bg-amber-100 hover:text-amber-800 transition-all duration-300 ease-in-out transform hover:scale-[1.01] active:scale-[0.99] outline-none shadow-sm"
              title="Me interesa 👀"
            >              
              <span className="text-lg leading-none">💡</span>
            </button>
          </ScreeningModalTrigger>
        </div>

      </div>
    </div>
  )
}