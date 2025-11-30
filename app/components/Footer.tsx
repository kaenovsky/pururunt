export default function Footer() {
  return (
    // CAMBIO: bg-white, border-neutral-100
    <footer className="border-t border-neutral-100 py-16 mt-12 text-center bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <p className="font-serif-display text-xl md:text-2xl text-neutral-900 italic mb-6">
          "No hay que tener pudor para crear."
        </p>
        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-8">
          — Leonardo Favio
        </p>
        
        <div className="flex justify-center gap-6 text-sm">
          <a href="mailto:hola@cineee.ar" className="text-neutral-500 hover:text-rose-600 transition-colors">
            hola@cineee.ar
          </a>
        </div>
      </div>
    </footer>
  )
}