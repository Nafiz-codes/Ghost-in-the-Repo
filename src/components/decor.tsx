import { cn } from "@/lib/utils"

const flags = [
  ["bg-rosa", "{ }"],
  ["bg-cempasuchil", "✺"],
  ["bg-turquesa", "</>"],
  ["bg-gold", "◇"],
  ["bg-hueso", "{"],
  ["bg-rosa", "✺"],
  ["bg-turquesa", ">_"],
  ["bg-cempasuchil", "}"],
  ["bg-gold", "</>"],
  ["bg-hueso", "✺"],
  ["bg-rosa", "#"],
  ["bg-turquesa", "✺"],
] as const

export function PapelPicado({ className, count = 12 }: { className?: string; count?: number }) {
  return (
    <div className={cn("relative h-10 overflow-hidden", className)} aria-hidden="true">
      <span className="absolute inset-x-0 top-1.5 h-px bg-gold/80" />
      <div className="flex justify-around">
        {flags.slice(0, count).map(([color, glyph], i) => (
          <span
            key={i}
            className={cn(
              "papel-flag relative grid h-8 w-[clamp(40px,7vw,88px)] place-items-center font-mono text-[11px] font-bold text-noche/80",
              color,
              i >= 6 && "max-sm:hidden",
            )}
          >
            {glyph}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Marigold({ size = 20, dim = false, className }: { size?: number; dim?: boolean; className?: string }) {
  return (
    <span
      className={cn("marigold", className)}
      data-dim={dim}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

export function Candle({ lit = true, height = 56, className }: { lit?: boolean; height?: number; className?: string }) {
  return (
    <span className={cn("relative inline-block w-3.5 flex-none", className)} style={{ height }} aria-hidden="true">
      {lit && <i className="flame absolute top-0 left-[3px] z-10 h-3.5 w-2 bg-gold shadow-[0_0_18px_var(--gold)]" />}
      <i className="absolute top-3 left-1.5 h-1.5 w-0.5 bg-noche" />
      <i className="absolute bottom-0 h-[calc(100%-16px)] w-full rounded-t-[4px] rounded-b-[1px] bg-hueso shadow-[inset_-4px_0_rgb(255_194_14/0.25)]" />
    </span>
  )
}

export function CandleRow({ className, lit = [true, true, true] }: { className?: string; lit?: boolean[] }) {
  return (
    <div className={cn("flex items-end gap-2", className)} aria-hidden="true">
      {lit.map((l, i) => (
        <Candle key={i} lit={l} height={i === 1 ? 72 : 54} />
      ))}
    </div>
  )
}

type CalaveraVariant = "hero" | "portrait" | "resting"

const art: Record<CalaveraVariant, { src: string; w: number; h: number }> = {
  hero: { src: "/art/calavera-hero.webp", w: 900, h: 1200 },
  portrait: { src: "/art/calavera-portrait.webp", w: 512, h: 512 },
  resting: { src: "/art/calavera-resting.webp", w: 1100, h: 825 },
}

export function Calavera({
  variant = "portrait",
  className,
  fade = true,
  alt = "",
}: {
  variant?: CalaveraVariant
  className?: string
  fade?: boolean
  alt?: string
}) {
  const a = art[variant]
  return (
    <img
      src={a.src}
      width={a.w}
      height={a.h}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading={variant === "hero" ? "eager" : "lazy"}
      className={cn(
        "select-none",
        variant === "resting" ? "ofrenda-frame rounded-xl" : fade && "art-fade",
        className,
      )}
      draggable={false}
    />
  )
}

export function SkullAvatar({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-10 flex-none place-items-center overflow-hidden rounded-lg border border-gold/70 bg-noche", className)}>
      <img src="/art/calavera-avatar.webp" alt="" aria-hidden="true" className="size-full object-cover" />
    </span>
  )
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <SkullAvatar className="size-9" />
      {!compact && (
        <span className="font-display text-lg leading-none font-bold tracking-tight">
          Ghost <em className="font-semibold text-gold">in the</em> Repo
        </span>
      )}
    </span>
  )
}

export function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("size-5", className)}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}
