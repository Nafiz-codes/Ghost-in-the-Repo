import type { ActivityPoint } from "@/data/types"
import { cn } from "@/lib/utils"

export function ActivityChart({ data, className, lastActiveIndex }: { data: ActivityPoint[]; className?: string; lastActiveIndex?: number }) {
  const max = Math.max(...data.map((d) => d.commits), 1)
  const peak = data.findIndex((d) => d.commits === max)
  const last = lastActiveIndex ?? data.reduce((acc, d, i) => (d.commits > 0 ? i : acc), 0)

  return (
    <figure className={cn("w-full", className)}>
      <div className="flex h-44 items-end gap-1 sm:gap-1.5" role="img" aria-label={`Commits per period. Peak of ${max} in ${data[peak].period}. No commits after ${data[last].period}.`}>
        {data.map((d, i) => {
          const silent = i > last
          return (
            <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
              <span className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-elevated px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap group-hover:block">
                {d.commits}
              </span>
              {silent ? (
                <span className="h-1 rounded-sm border border-dashed border-line" />
              ) : (
                <span
                  className={cn(
                    "rounded-t-sm transition-colors",
                    i === peak ? "bg-gold" : i === last ? "bg-rosa" : "bg-turquesa/70 group-hover:bg-turquesa",
                  )}
                  style={{ height: `${Math.max((d.commits / max) * 100, 3)}%` }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-1 font-mono text-[11px] text-soft sm:gap-1.5" aria-hidden="true">
        {data.map((d, i) => (
          <span key={i} className="relative h-4 min-w-0 flex-1">
            {d.period.startsWith("20") && (
              <span className={cn("absolute left-0 whitespace-nowrap", !d.period.includes("Q1") && "max-sm:hidden")}>
                ’{d.period.slice(2, 4)}
              </span>
            )}
          </span>
        ))}
      </div>
      <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-soft">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-gold" /> Peak · {max} commits</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-rosa" /> Last active period</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm border border-dashed border-soft" /> Silence</span>
      </figcaption>
    </figure>
  )
}
