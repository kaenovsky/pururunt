'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ArchivedMovie } from '@/lib/types'

const FilmDetailModal = dynamic(() => import('./FilmDetailModal'), { ssr: false })

export default function FilmCard({ film }: { film: ArchivedMovie }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setIsModalOpen(true)} className="group text-left w-full">
        <div className="relative aspect-2/3 rounded-sm overflow-hidden bg-neutral-100 shadow-sm group-hover:shadow-lg transition-shadow">
          {film.poster && (
            <img
              src={film.poster}
              alt={film.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        <p className="mt-2 text-sm font-medium text-neutral-800 truncate group-hover:text-black">
          {film.title}
        </p>
      </button>

      <FilmDetailModal film={film} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
