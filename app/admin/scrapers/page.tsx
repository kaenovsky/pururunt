import { getCinemas } from '@/lib/db'
import ScraperCard from './ScraperCard'

export const maxDuration = 60

export default async function AdminScrapersPage() {
  const cinemas = await getCinemas()
  const cosmos = cinemas.find((c) => c.name.toLowerCase().includes('cosmos'))
  const lorca = cinemas.find((c) => c.name.toLowerCase().includes('lorca'))
  const caco = cinemas.find((c) => c.name.toLowerCase().includes('cacodelphia'))

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Scrapers</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Reemplaza el workflow de n8n. Cada corrida muestra un preview antes de tocar la base de datos.
      </p>

      <div className="space-y-6 max-w-2xl">
        {cosmos && <ScraperCard kind="cosmos" cinemaName={cosmos.name} />}
        {lorca && <ScraperCard kind="lorca" cinemaName={lorca.name} />}
        {caco && <ScraperCard kind="cacodelphia" cinemaName={caco.name} />}
      </div>
    </div>
  )
}
