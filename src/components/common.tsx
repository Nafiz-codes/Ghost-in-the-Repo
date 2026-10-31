import type { ReactNode } from "react"
import { CircleCheck, CircleHelp, Lightbulb } from "lucide-react"
import { Marigold, PapelPicado } from "@/components/decor"
import type { Confidence, Severity } from "@/data/types"
import { cn } from "@/lib/utils"

export const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
}

const severityStyle: Record<Severity, string> = {
  critical: "border-critical/50 bg-critical/12 text-[#ff8a94]",
  high: "border-cempasuchil/50 bg-cempasuchil/12 text-[#ffb057]",
  medium: "border-gold/50 bg-gold/10 text-gold",
  low: "border-turquesa/50 bg-turquesa/10 text-turquesa-light",
}

export const severityDot: Record<Severity, string> = {
  critical: "bg-critical",
  high: "bg-cempasuchil",
  medium: "bg-gold",
  low: "bg-turquesa",
}

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold",
        severityStyle[severity],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", severityDot[severity])} />
      {severityLabel[severity]}
    </span>
  )
}

const confidenceMeta: Record<Confidence, { label: string; icon: typeof CircleCheck; style: string; hint: string }> = {
  verified: {
    label: "Verified",
    icon: CircleCheck,
    style: "border-success/40 bg-success/10 text-success",
    hint: "Directly supported by repository evidence",
  },
  likely: {
    label: "Likely",
    icon: Lightbulb,
    style: "border-gold/40 bg-gold/10 text-gold",
    hint: "Inferred from several pieces of evidence",
  },
  hypothesis: {
    label: "Hypothesis",
    icon: CircleHelp,
    style: "border-rosa-light/40 bg-rosa/10 text-rosa-light",
    hint: "AI-generated guess — not confirmed by evidence",
  },
}

export function ConfidenceBadge({ confidence, className }: { confidence: Confidence; className?: string }) {
  const meta = confidenceMeta[confidence]
  const Icon = meta.icon
  return (
    <span
      title={meta.hint}
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-xs font-medium",
        meta.style,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {meta.label}
    </span>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-gold uppercase",
        className,
      )}
    >
      <Marigold size={14} />
      {children}
    </span>
  )
}

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn("min-w-0 rounded-xl border border-line bg-surface/80 shadow-[0_18px_48px_rgb(8_2_19/0.3)]", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function PapelHeader({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn("border-b border-line bg-noche-deep", className)}>
      <PapelPicado />
      {children}
    </div>
  )
}

export function StatusDot({ tone = "success", className }: { tone?: "success" | "gold" | "critical"; className?: string }) {
  const color = { success: "bg-success shadow-[0_0_8px_var(--success)]", gold: "bg-gold shadow-[0_0_8px_var(--gold)]", critical: "bg-critical shadow-[0_0_8px_var(--critical)]" }[tone]
  return <span className={cn("inline-block size-2 flex-none rounded-full", color, className)} />
}
