import Link from 'next/link'
import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { Film, Building2, Calendar, LayoutDashboard, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/films',      label: 'Films',      icon: Film },
  { href: '/admin/cinemas',    label: 'Cinemas',    icon: Building2 },
  { href: '/admin/screenings', label: 'Screenings', icon: Calendar },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen flex bg-neutral-100">
      <aside className="w-56 shrink-0 bg-neutral-900 text-white flex flex-col">
        <div className="px-5 py-6 border-b border-neutral-800">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">foquito.ar</span>
          <p className="text-sm font-semibold mt-1">Backoffice</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 px-3 mb-2 truncate">{session.user?.email}</p>
          <form action={async () => {
            'use server'
            await signOut({ redirectTo: '/admin/login' })
          }}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
