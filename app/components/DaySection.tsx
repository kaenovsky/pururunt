import ScreeningCard from './ScreeningCard'

export default function DaySection({ date, formattedDate, screenings, isToday }: any) {
  return (
    <details className="group mb-0 border-b border-neutral-100" open={isToday}>
      <summary className="list-none cursor-pointer py-6 hover:bg-neutral-50 transition-colors px-2 -mx-2 rounded-md">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-amber-300' : 'bg-neutral-300'}`}></div>
          <h2 className={`text-lg font-medium flex-1 ${isToday ? 'text-neutral-900' : 'text-neutral-500'}`}>
            {formattedDate}
          </h2>
          <span className="text-xs text-neutral-400 group-open:rotate-180 transition-transform">
            ▼
          </span>
        </div>
      </summary>
      
      <div className="pb-8 pt-2 animate-in slide-in-from-top-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10">
          {screenings.map((s: any) => (
            <ScreeningCard key={s.id} screening={s} />
          ))}
        </div>
      </div>
    </details>
  )
}