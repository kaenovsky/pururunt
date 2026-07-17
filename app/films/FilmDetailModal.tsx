'use client'
import { getLetterboxdUrl } from '@/lib/calendar-url'
import { Film, ExternalLink, Calendar, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { ArchivedMovie } from '@/lib/types'

interface FilmDetailModalProps {
  film: ArchivedMovie
  isOpen: boolean
  onClose: () => void
}

export default function FilmDetailModal({ film, isOpen, onClose }: FilmDetailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white text-neutral-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 p-5">
              <div className="w-24 shrink-0">
                <div className="relative aspect-2/3 rounded-sm overflow-hidden bg-neutral-100">
                  {film.poster && (
                    <img src={film.poster} alt={film.title} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-xl font-bold leading-tight text-black">{film.title}</h3>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-600 mt-2">
                  {film.director && (
                    <span><span className="text-neutral-400">Dir.</span> {film.director}</span>
                  )}
                  {film.country && (
                    <>
                      <span className="text-neutral-300">•</span>
                      <span>{film.country}</span>
                    </>
                  )}
                  {film.duration && (
                    <>
                      <span className="text-neutral-300">•</span>
                      <span>{film.duration} min</span>
                    </>
                  )}
                </div>

                {film.cinemas.length > 0 && (
                  <div className="flex items-start gap-1.5 text-sm text-neutral-600 mt-2">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span>{film.cinemas.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {film.overview && (
              <p className="px-5 pb-4 text-sm leading-relaxed text-neutral-700">{film.overview}</p>
            )}

            <div className="p-4 border-t border-neutral-100 space-y-2">
              <a
                href={getLetterboxdUrl(film.title, film.tmdb_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action-minimal"
              >
                <Film size={20} className="text-neutral-600" />
                <span>Ver ficha en Letterboxd</span>
                <ExternalLink size={14} className="ml-auto text-neutral-400" />
              </a>

              <Link href={`/film/${film.id}`} className="btn-action-minimal">
                <Calendar size={20} className="text-neutral-600" />
                <span>Ver funciones</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
