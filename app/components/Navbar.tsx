import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center md:justify-start">
        
        <div className="flex items-center gap-2 group cursor-default">
          <span className="text-2xl group-hover:-rotate-12 transition-transform duration-300">🎥</span>
          <Link href={"/"}>
            <h1 className="text-2xl font-serif-display font-bold tracking-tight text-foreground">
              cineee<span className="text-red-600">.ar</span>
            </h1>
          </Link>
        </div>

      </div>
    </nav>
  )
}