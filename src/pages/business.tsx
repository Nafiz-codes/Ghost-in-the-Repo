import { useMemo, type ReactNode } from "react"
import { useSearchParams } from "react-router"
import { ArrowRight, Eye } from "lucide-react"
import { useInvestigation } from "@/components/app-shell"
import { Calavera } from "@/components/decor"
import { ConfidenceBadge, PageHeader, SeverityBadge, severityLabel } from "@/components/common"
import { EvidenceList, useOpenEvidence } from "@/components/evidence"
import type { Confidence, Severity } from "@/data/types"
import { cn } from "@/lib/utils"

const severities: Severity[] = ["critical", "high", "medium", "low"]
const sevRank: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }
const confRank: Record<Confidence, number> = { verified: 0, likely: 1, hypothesis: 2 }

export default function Business() {
  const repo = useInvestigation()
  const open = useOpenEvidence()
  const [params, setParams] = useSearchParams()
  const severity = params.get("severity") as Severity | null
  const sort = params.get("sort") === "confidence" ? "confidence" : "severity"
  const hideHypotheses = params.get("hypotheses") === "hide"

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (value === null) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const findings = useMemo(() => {
    return repo.findings
      .filter((f) => !severity || f.severity === severity)
      .filter((f) => !hideHypotheses || f.confidence !== "hypothesis")
      .sort((a, b) =>
        sort === "confidence"
          ? confRank[a.confidence] - confRank[b.confidence] || sevRank[a.severity] - sevRank[b.severity]
          : sevRank[a.severity] - sevRank[b.severity] || confRank[a.confidence] - confRank[b.confidence],
      )
  }, [repo.findings, severity, sort, hideHypotheses])

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        eyebrow="Unfinished Business"
        title={`${repo.findings.length} things the project left behind`}
        description="Unresolved bugs, stale work, and maintenance risks. Open a finding to see the issue, file, commit, or pull request behind it."
      />

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-3 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by severity">
          <FilterChip active={!severity} onClick={() => update("severity", null)}>
            All <span className="font-mono text-soft">{repo.findings.length}</span>
          </FilterChip>
          {severities.map((s) => (
            <FilterChip key={s} active={severity === s} onClick={() => update("severity", s)}>
              {severityLabel[s]}{" "}
              <span className="font-mono text-soft">{repo.findings.filter((f) => f.severity === s).length}</span>
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 md:ml-auto">
          <label className="flex items-center gap-2 text-sm text-soft">
            Sort by
            <select
              value={sort}
              onChange={(e) => update("sort", e.target.value === "severity" ? null : e.target.value)}
              className="h-9 rounded-lg border border-line bg-noche px-2 text-hueso"
            >
              <option value="severity">Severity</option>
              <option value="confidence">Confidence</option>
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-soft">
            <input
              type="checkbox"
              checked={hideHypotheses}
              onChange={(e) => update("hypotheses", e.target.checked ? "hide" : null)}
              className="size-4 accent-turquesa"
            />
            Hide hypotheses
          </label>
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-line bg-surface px-6 py-12 text-center">
          <Calavera variant="resting" className="mb-4 w-full max-w-sm" />
          <h2 className="mt-2 font-display text-2xl font-bold">No findings detected</h2>
          <p className="mt-2 max-w-md text-soft">
            Nothing matches these filters. The Ghost only reports what the evidence supports.
          </p>
          <button
            onClick={() => setParams({}, { replace: true })}
            className="mt-4 text-sm font-medium text-turquesa-light hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {findings.map((f) => (
            <li key={f.id}>
              <article
                className={cn(
                  "rounded-xl border bg-surface p-5 transition-colors hover:border-soft/60",
                  f.severity === "critical" ? "border-critical/40" : "border-line",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={f.severity} />
                  <ConfidenceBadge confidence={f.confidence} />
                  <span className="text-xs text-soft">{f.category}</span>
                  <code className="ml-auto font-mono text-xs text-soft">{f.id}</code>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold">{f.title}</h2>
                <p className="mt-2 text-soft">{f.explanation}</p>
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-turquesa/25 bg-turquesa/5 p-3 text-sm">
                  <ArrowRight className="mt-0.5 size-4 flex-none text-turquesa" />
                  <p>
                    <span className="font-semibold text-turquesa-light">Next action: </span>
                    {f.nextAction}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <EvidenceList items={f.evidence} heading={f.title} />
                  <button
                    onClick={() => open(f.evidence, 0, f.title)}
                    className="inline-flex h-9 flex-none items-center gap-2 self-start rounded-lg border border-line px-3 text-sm hover:border-turquesa sm:self-auto"
                  >
                    <Eye className="size-4 text-turquesa" /> View evidence
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 rounded-lg border px-3 text-sm font-medium transition-colors",
        active ? "border-turquesa/50 bg-turquesa/10 text-turquesa-light" : "border-transparent text-soft hover:bg-elevated hover:text-hueso",
      )}
    >
      {children}
    </button>
  )
}
