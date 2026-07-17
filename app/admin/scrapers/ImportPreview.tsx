'use client'
import { useState, useTransition } from 'react'
import type { ImportPlan, ImportDecisions, ImportResult } from '@/lib/scraper/import'
import { confirmImportAction } from './actions'

export default function ImportPreview({ plan, onDone }: { plan: ImportPlan; onDone: () => void }) {
  const [pending, startTransition] = useTransition()
  const [merge, setMerge] = useState<Record<string, boolean>>({})
  const [deleteIds, setDeleteIds] = useState<Set<number>>(
    new Set(plan.orphanScreenings.map((o) => o.screeningId))
  )
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const newMovies = plan.movies.filter((m) => m.status === 'new')
  const existingMovies = plan.movies.filter((m) => m.status === 'existing')
  const duplicateMovies = plan.movies.filter((m) => m.status === 'possible_duplicate')

  const newScreenings = plan.screenings.filter((s) => s.status === 'new')
  const changedScreenings = plan.screenings.filter((s) => s.status === 'movie_changed')
  const unchangedScreenings = plan.screenings.filter((s) => s.status === 'unchanged')

  function toggleDelete(id: number) {
    setDeleteIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function confirm() {
    setError(null)
    const decisions: ImportDecisions = {
      mergeDuplicates: Object.fromEntries(
        duplicateMovies
          .filter((m) => merge[m.key] && m.duplicateSuggestionId)
          .map((m) => [m.key, m.duplicateSuggestionId as number])
      ),
      deleteOrphanIds: Array.from(deleteIds),
    }
    startTransition(async () => {
      try {
        setResult(await confirmImportAction(plan, decisions))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido')
      }
    })
  }

  if (result) {
    return (
      <div className="text-sm space-y-3">
        <p className="font-medium text-neutral-900">Import completado.</p>
        <ul className="text-neutral-600 list-disc list-inside space-y-0.5">
          <li>{result.moviesCreated} películas creadas, {result.moviesUpdated} actualizadas</li>
          <li>{result.screeningsCreated} funciones nuevas</li>
          <li>{result.screeningsReassigned} funciones reasignadas a otra película</li>
          <li>{result.screeningsDeleted} funciones eliminadas</li>
        </ul>
        <button type="button" onClick={onDone} className="text-sm text-neutral-500 hover:text-neutral-900 underline">
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 text-sm">
      {plan.unresolvedRooms.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2">
          No se encontraron las salas: {plan.unresolvedRooms.join(', ')}. Esas funciones no se van a importar — creá la sala en Cinemas primero.
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-600">
        <span>{newMovies.length} películas nuevas</span>
        <span>{existingMovies.length} existentes</span>
        <span>{duplicateMovies.length} posibles duplicados</span>
        <span>{newScreenings.length} funciones nuevas</span>
        <span>{changedScreenings.length} cambian de película</span>
        <span>{unchangedScreenings.length} sin cambios</span>
      </div>

      {duplicateMovies.length > 0 && (
        <div>
          <h3 className="font-medium text-neutral-900 mb-2">Posibles duplicados</h3>
          <ul className="space-y-2">
            {duplicateMovies.map((m) => (
              <li key={m.key} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={!!merge[m.key]}
                  onChange={(e) => setMerge((prev) => ({ ...prev, [m.key]: e.target.checked }))}
                  className="h-4 w-4 mt-0.5 rounded border-neutral-300 accent-neutral-900"
                />
                <span className="text-neutral-700">
                  <strong className="text-neutral-900">{m.title}</strong> — fusionar con la película existente &quot;{m.duplicateSuggestionTitle}&quot; en vez de crear una nueva
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {changedScreenings.length > 0 && (
        <div>
          <h3 className="font-medium text-neutral-900 mb-2">Funciones que cambian de película</h3>
          <ul className="space-y-1 text-neutral-600">
            {changedScreenings.map((s, i) => (
              <li key={i}>
                Sala {s.roomNumber} · {s.date} {s.time.slice(0, 5)} — {s.previousMovieTitle} → {plan.movies.find((m) => m.key === s.movieKey)?.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.orphanScreenings.length > 0 && (
        <div>
          <h3 className="font-medium text-neutral-900 mb-2">Funciones que ya no aparecen (¿eliminar?)</h3>
          <ul className="space-y-1">
            {plan.orphanScreenings.map((o) => (
              <li key={o.screeningId} className="flex items-center gap-2 text-neutral-600">
                <input
                  type="checkbox"
                  checked={deleteIds.has(o.screeningId)}
                  onChange={() => toggleDelete(o.screeningId)}
                  className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
                />
                Sala {o.roomNumber} · {o.date} {o.time} — {o.movieTitle}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          disabled={pending}
          onClick={confirm}
          className="bg-neutral-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          {pending ? 'Importando…' : 'Confirmar import'}
        </button>
        <button type="button" onClick={onDone} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  )
}
