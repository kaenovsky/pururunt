'use client'

import { useState, useMemo } from 'react'
import Navbar from './Navbar'
import FilterBar from './FilterBar'
import Hero from './Hero'
import DaySection from './DaySection'
import Footer from './Footer'

import { Screening } from '@/lib/db' 

interface HomeClientProps {
  initialScreenings: Screening[];
}

interface GroupedScreenings {
  [date: string]: Screening[];
}

export default function HomeClient({ initialScreenings }: HomeClientProps) {

  const [screenings] = useState<Screening[]>(initialScreenings)
  
  const [selectedCinema, setSelectedCinema] = useState<string>('all')
  const [selectedMovie, setSelectedMovie] = useState<string>('all')

  const uniqueCinemas = useMemo(() => 
    [...new Set(screenings.map(s => s.cinema))].sort(), 
  [screenings])

  const uniqueMovies = useMemo(() => 
    [...new Set(screenings.map(s => s.title))].sort(), 
  [screenings])

  const filteredScreenings = useMemo(() => {
    return screenings.filter(s => {
      const matchCinema = selectedCinema === 'all' || s.cinema === selectedCinema
      const matchMovie = selectedMovie === 'all' || s.title === selectedMovie
      return matchCinema && matchMovie
    })
  }, [screenings, selectedCinema, selectedMovie])

  const groupedScreenings: GroupedScreenings = useMemo(() => {
    return filteredScreenings.reduce((acc: GroupedScreenings, item) => {
      if (!acc[item.date]) acc[item.date] = []
      acc[item.date].push(item)
      return acc
    }, {})
  }, [filteredScreenings])

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`)
    return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <Navbar />      
      
      {selectedCinema === 'all' && selectedMovie === 'all' && (
        <Hero movies={screenings} />
      )}

      <FilterBar 
        cinemas={uniqueCinemas} 
        movies={uniqueMovies} 
        selectedCinema={selectedCinema} 
        selectedMovie={selectedMovie}
        onCinemaChange={setSelectedCinema}
        onMovieChange={setSelectedMovie}
      />

      <main className="max-w-7xl mx-auto px-4 mt-8 pb-20">
        {Object.keys(groupedScreenings).length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-lg">
            <p className="text-neutral-400">No hay funciones disponibles.</p>
          </div>
        ) : (
          Object.keys(groupedScreenings).sort().map((date) => (
            <DaySection 
              key={date}
              date={date}
              formattedDate={formatDate(date)}
              screenings={groupedScreenings[date]}
              isToday={date === todayStr}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  )
}