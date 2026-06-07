import { db } from '@/lib/db'
import { movies, screenings, cinemas } from '@/lib/schema'
import { gte, sql, count } from 'drizzle-orm'
import { Film, Building2, Calendar } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [filmCount, cinemaCount, upcomingCount] = await Promise.all([
    db.select({ count: count() }).from(movies),
    db.select({ count: count() }).from(cinemas),
    db.select({ count: count() }).from(screenings).where(gte(screenings.date, sql`CURRENT_DATE`)),
  ])
  return {
    films:     filmCount[0].count,
    cinemas:   cinemaCount[0].count,
    upcoming:  upcomingCount[0].count,
  }
}

const cards = [
  { label: 'Films',              key: 'films',    icon: Film,      href: '/admin/films' },
  { label: 'Cinemas',            key: 'cinemas',  icon: Building2, href: '/admin/cinemas' },
  { label: 'Upcoming screenings',key: 'upcoming', icon: Calendar,  href: '/admin/screenings' },
] as const

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map(({ label, key, icon: Icon, href }) => (
          <Link key={key} href={href} className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-neutral-400 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-neutral-100 rounded-lg">
                <Icon size={18} className="text-neutral-600" />
              </div>
              <span className="text-sm font-medium text-neutral-500">{label}</span>
            </div>
            <p className="text-3xl font-bold text-neutral-900">{stats[key]}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/films/new"      className="btn-admin-action">+ Add film</Link>
        <Link href="/admin/cinemas/new"    className="btn-admin-action">+ Add cinema</Link>
        <Link href="/admin/screenings/new" className="btn-admin-action">+ Add screening</Link>
      </div>
    </div>
  )
}
