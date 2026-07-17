'use client'
import { useState, useTransition } from 'react'
import { RefreshCw, Wand2 } from 'lucide-react'
import type { ImportPlan } from '@/lib/scraper/import'
import {
  runCosmosScraperAction,
  detectLorcaImageAction,
  runLorcaScraperAction,
  parseCacodelphiaAction,
} from './actions'
import ImportPreview from './ImportPreview'

type Kind = 'cosmos' | 'lorca' | 'cacodelphia'

export default function ScraperCard({ kind, cinemaName }: { kind: Kind; cinemaName: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<ImportPlan | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [imageDetected, setImageDetected] = useState(false)
  const [newsletterHtml, setNewsletterHtml] = useState('')
  const [periodText, setPeriodText] = useState('')

  function run(fn: () => Promise<ImportPlan>) {
    setError(null)
    startTransition(async () => {
      try {
        setPlan(await fn())
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido')
      }
    })
  }

  function detectImage() {
    setError(null)
    startTransition(async () => {
      try {
        const url = await detectLorcaImageAction()
        if (url) {
          setImageUrl(url)
          setImageDetected(true)
        } else {
          setError('No se pudo detectar la imagen automáticamente. Pegala manualmente abajo.')
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido')
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <h2 className="text-lg font-semibold text-neutral-900 mb-1">{cinemaName}</h2>

      {kind === 'cosmos' && (
        <>
          <p className="text-sm text-neutral-500 mb-4">Scrape determinístico del sitio, sin IA.</p>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(runCosmosScraperAction)}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={pending ? 'animate-spin' : ''} />
            Sincronizar ahora
          </button>
        </>
      )}

      {kind === 'lorca' && (
        <>
          <p className="text-sm text-neutral-500 mb-4">Detecta la imagen de la cartelera y la analiza con IA.</p>
          <div className="flex gap-2 mb-1">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setImageDetected(false) }}
              placeholder="URL de la imagen de la cartelera…"
              className="form-input flex-1"
            />
            <button
              type="button"
              disabled={pending}
              onClick={detectImage}
              className="px-4 py-2 border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Auto-detectar
            </button>
          </div>
          {imageDetected && <p className="text-xs text-neutral-400 mb-3">Imagen detectada automáticamente.</p>}
          <button
            type="button"
            disabled={pending || !imageUrl}
            onClick={() => run(() => runLorcaScraperAction(imageUrl))}
            className="mt-3 inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            <Wand2 size={16} />
            Extraer con IA
          </button>
        </>
      )}

      {kind === 'cacodelphia' && (
        <>
          <p className="text-sm text-neutral-500 mb-4">
            Pegá el asunto del newsletter (ej: &quot;del 26 de Febrero al 4 de Marzo&quot;) y el HTML del cuerpo del mail.
          </p>
          <input
            value={periodText}
            onChange={(e) => setPeriodText(e.target.value)}
            placeholder="del 26 de Febrero al 4 de Marzo"
            className="form-input mb-3"
          />
          <textarea
            value={newsletterHtml}
            onChange={(e) => setNewsletterHtml(e.target.value)}
            rows={8}
            placeholder="Pegá acá el HTML del newsletter…"
            className="form-input resize-none mb-3 font-mono text-xs"
          />
          <button
            type="button"
            disabled={pending || !newsletterHtml.trim() || !periodText.trim()}
            onClick={() => run(() => parseCacodelphiaAction(newsletterHtml, periodText))}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            <Wand2 size={16} />
            Parsear
          </button>
        </>
      )}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {plan && (
        <div className="mt-6 border-t border-neutral-200 pt-6">
          <ImportPreview plan={plan} onDone={() => setPlan(null)} />
        </div>
      )}
    </div>
  )
}
