import { createContext, useContext, useState, type ReactNode } from "react"
import { CircleDot, FileCode2, GitCommitHorizontal, GitPullRequest, Tag } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Evidence, EvidenceKind } from "@/data/types"
import { cn } from "@/lib/utils"

export const evidenceIcon: Record<EvidenceKind, typeof FileCode2> = {
  file: FileCode2,
  commit: GitCommitHorizontal,
  issue: CircleDot,
  pr: GitPullRequest,
  release: Tag,
}

const kindLabel: Record<EvidenceKind, string> = {
  file: "File",
  commit: "Commit",
  issue: "Issue",
  pr: "Pull request",
  release: "Release",
}

interface EvidenceState {
  items: Evidence[]
  focus: number
  heading?: string
}

const EvidenceContext = createContext<(items: Evidence[], focus?: number, heading?: string) => void>(() => {})

export function useOpenEvidence() {
  return useContext(EvidenceContext)
}

export function EvidenceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EvidenceState | null>(null)
  const desktop = useMediaQuery("(min-width: 768px)")

  return (
    <EvidenceContext.Provider value={(items, focus = 0, heading) => setState({ items, focus, heading })}>
      {children}
      <Sheet open={state !== null} onOpenChange={(open) => !open && setState(null)}>
        <SheetContent
          side={desktop ? "right" : "bottom"}
          className={cn(
            "gap-0 border-line bg-noche-deep p-0",
            desktop ? "w-full sm:max-w-md" : "max-h-[85vh] rounded-t-2xl",
          )}
        >
          <SheetHeader className="border-b border-line bg-elevated/60 px-5 py-4">
            <SheetTitle className="font-display text-lg">{state?.heading ?? "Supporting evidence"}</SheetTitle>
            <SheetDescription>
              {state?.items.length ?? 0} source{state?.items.length === 1 ? "" : "s"} from the repository
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 overflow-y-auto p-5">
            {state?.items.length === 0 && <EvidenceUnavailable />}
            {state?.items.map((item, i) => (
              <EvidenceCard key={item.ref + i} item={item} highlighted={i === state.focus} />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </EvidenceContext.Provider>
  )
}

export function EvidenceUnavailable() {
  return (
    <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
      <p className="font-semibold text-gold">Evidence unavailable</p>
      <p className="mt-1 text-soft">
        No file, commit, issue, or pull request supports this directly. Treat it as a hypothesis.
      </p>
    </div>
  )
}

export function EvidenceCard({ item, highlighted }: { item: Evidence; highlighted?: boolean }) {
  const Icon = evidenceIcon[item.kind]
  return (
    <article
      className={cn(
        "rounded-xl border bg-surface p-4",
        highlighted ? "border-turquesa/60 shadow-[0_0_0_3px_rgb(0_179_179/0.12)]" : "border-line",
      )}
    >
      <div className="flex items-center gap-2 text-xs text-soft">
        <Icon className="size-4 text-turquesa" />
        <span className="font-medium uppercase tracking-wider">{kindLabel[item.kind]}</span>
        <code className="ml-auto font-mono text-turquesa-light">{item.ref}</code>
      </div>
      <h3 className="mt-2 font-semibold">{item.title}</h3>
      {item.meta && <p className="mt-1 font-mono text-xs text-soft">{item.meta}</p>}
      {item.meta?.startsWith("https://github.com/") && <a href={item.meta} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-turquesa-light underline">Open source on GitHub</a>}
      {item.excerpt && (
        <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-noche-deep p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-hueso/90">
          {item.excerpt}
        </pre>
      )}
    </article>
  )
}

export function EvidenceChip({
  item,
  onClick,
  className,
}: {
  item: Evidence
  onClick?: () => void
  className?: string
}) {
  const open = useOpenEvidence()
  const Icon = evidenceIcon[item.kind]
  return (
    <button
      type="button"
      onClick={onClick ?? (() => open([item], 0, item.title))}
      title={item.title}
      className={cn(
        "inline-flex h-7 max-w-full items-center gap-1.5 rounded-md border border-turquesa/35 bg-noche px-2 font-mono text-xs text-turquesa-light transition-colors hover:border-turquesa hover:bg-turquesa/10",
        className,
      )}
    >
      <Icon className="size-3.5 flex-none" />
      <span className="truncate">{item.ref}</span>
    </button>
  )
}

export function EvidenceList({ items, heading, className }: { items: Evidence[]; heading?: string; className?: string }) {
  const open = useOpenEvidence()
  if (items.length === 0) {
    return <span className="text-xs text-soft italic">No direct evidence</span>
  }
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item, i) => (
        <EvidenceChip key={item.ref + i} item={item} onClick={() => open(items, i, heading)} />
      ))}
    </div>
  )
}
