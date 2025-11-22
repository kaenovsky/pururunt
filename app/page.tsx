'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Film } from 'lucide-react'

interface Screening {
  id: string;
  cinema: string;
  film: string;
  date: string;
  time: string;
  duration: number | null;
  og_link: string;
  rate: string;
  genre: string[];
  format: string;
  timestamp: string;
  scrapped_at: string;
  info: string;
}

interface GroupedScreenings {
  [date: string]: Screening[];
}

export default function Home() {
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [groupedScreenings, setGroupedScreenings] = useState<GroupedScreenings>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCinema, setSelectedCinema] = useState<string>('all')

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await fetch('/api/screenings')
        const data = await response.json()
        setScreenings(data.screenings)
        setGroupedScreenings(data.groupedByDate)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching screenings:', error)
        setLoading(false)
      }
    }

    fetchScreenings()
  }, [])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUniqueCinemas = (): string[] => {
    const cinemas = [...new Set(screenings.map(s => s.cinema))]
    return cinemas
  }

  const filteredScreenings = selectedCinema === 'all' 
    ? groupedScreenings 
    : Object.keys(groupedScreenings).reduce((acc: GroupedScreenings, date: string) => {
        const dayScreenings = groupedScreenings[date].filter(s => s.cinema === selectedCinema)
        if (dayScreenings.length > 0) acc[date] = dayScreenings
        return acc
      }, {})

  if (loading) return <div className="loading">Cargando cartelera...</div>

  return (
    <div className="container">
      <header className="header">
        <h1>🎬 cineee.ar</h1>
        <p>Cartelera unificada de cines alternativos de Buenos Aires</p>
      </header>

      {/* Filtro por cine */}
      <div className="filters">
        <select 
          value={selectedCinema} 
          onChange={(e) => setSelectedCinema(e.target.value)}
          className="cinema-filter"
        >
          <option value="all">Todos los cines</option>
          {getUniqueCinemas().map(cinema => (
            <option key={cinema} value={cinema}>{cinema}</option>
          ))}
        </select>
      </div>

      {/* Listado de screenings */}
      <div className="screenings-container">
        {Object.keys(filteredScreenings).length === 0 ? (
          <div className="empty-state">
            No hay funciones programadas para los criterios seleccionados
          </div>
        ) : (
          Object.entries(filteredScreenings).map(([date, dayScreenings]) => (
            <div key={date} className="day-section">
              <h2 className="date-header">{formatDate(date)}</h2>
              
              {dayScreenings.map(screening => (
                <div key={screening.id} className="screening-card">
                  <div className="screening-header">
                    <h3 className="film-title">{screening.film}</h3>
                    <span className={`cinema-badge ${screening.cinema.toLowerCase()}`}>
                      {screening.cinema}
                    </span>
                  </div>
                  
                  <div className="screening-details">
                    <div className="detail">
                      <Clock size={16} />
                      <span>{screening.time} hs</span>
                    </div>
                    <div className="detail">
                      <MapPin size={16} />
                      <span>{screening.cinema}</span>
                    </div>
                    {screening.rate && (
                      <div className="detail">
                        <Film size={16} />
                        <span>{screening.rate} • {screening.format}</span>
                      </div>
                    )}
                  </div>

                  {screening.info && (
                    <p className="synopsis">{screening.info}</p>
                  )}

                  <div className="screening-actions">
                    <a 
                      href={screening.og_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn secondary"
                    >
                      Sitio oficial
                    </a>
                    <a 
                      href={`/api/ical/${screening.id}`}
                      className="btn primary"
                      download
                    >
                      Agregar al calendario
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}