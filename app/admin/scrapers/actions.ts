'use server'
import { requireAuth } from '@/lib/require-auth'
import { getCinemas } from '@/lib/db'
import { scrapeCosmos } from '@/lib/scraper/cosmos'
import { detectLorcaImageUrl, extractLorcaFromImage } from '@/lib/scraper/lorca'
import { parseCacodelphiaNewsletter } from '@/lib/scraper/cacodelphia'
import { buildImportPlan, commitImportPlan } from '@/lib/scraper/import'
import type { ImportPlan, ImportDecisions, ImportResult } from '@/lib/scraper/import'
import { revalidatePath } from 'next/cache'

async function findCinema(nameMatch: string) {
  const cinemas = await getCinemas()
  const cinema = cinemas.find((c) => c.name.toLowerCase().includes(nameMatch.toLowerCase()))
  if (!cinema) throw new Error(`No se encontró un cine que matchee "${nameMatch}"`)
  return cinema
}

export async function runCosmosScraperAction(): Promise<ImportPlan> {
  await requireAuth()
  const cinema = await findCinema('cosmos')
  const scraped = await scrapeCosmos(cinema.websiteUrl)
  return buildImportPlan(cinema.id, scraped)
}

export async function detectLorcaImageAction(): Promise<string | null> {
  await requireAuth()
  const cinema = await findCinema('lorca')
  return detectLorcaImageUrl(cinema.websiteUrl)
}

export async function runLorcaScraperAction(imageUrl: string): Promise<ImportPlan> {
  await requireAuth()
  const cinema = await findCinema('lorca')
  const scraped = await extractLorcaFromImage(imageUrl)
  return buildImportPlan(cinema.id, scraped)
}

export async function parseCacodelphiaAction(html: string, periodText: string): Promise<ImportPlan> {
  await requireAuth()
  const cinema = await findCinema('caco')
  const scraped = parseCacodelphiaNewsletter(html, periodText)
  return buildImportPlan(cinema.id, scraped)
}

export async function confirmImportAction(plan: ImportPlan, decisions: ImportDecisions): Promise<ImportResult> {
  await requireAuth()
  const result = await commitImportPlan(plan, decisions)

  revalidatePath('/admin/scrapers')
  revalidatePath('/admin/screenings')
  revalidatePath('/admin/films')
  revalidatePath('/')

  return result
}
