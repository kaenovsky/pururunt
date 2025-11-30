export default function SkeletonGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
      <div className="h-64 bg-neutral-100 rounded-lg animate-pulse mb-8"></div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-neutral-100 rounded-sm h-80 animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}