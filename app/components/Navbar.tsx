import Link from 'next/link'
import Logo from './Logo'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-zinc-950 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-start">
        <Link href="/" className="block group outline-none cursor-pointer">
          <Logo className="text-3xl text-zinc-50 hover:text-orange-200 transition-colors" />
        </Link>
      </div>
    </nav>
  )
}