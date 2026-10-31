import { useEffect, useState } from "react"
import { ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useInvestigation } from "@/components/app-shell"
import { Marigold } from "@/components/decor"
import { PageHeader } from "@/components/common"
import { EvidenceList } from "@/components/evidence"
import type { Investigation, Severity } from "@/data/types"
import { cn } from "@/lib/utils"

const groups: { priority: Severity; label: string; hint: string }[] = [
  { priority: "critical", label: "Critical priorities", hint: "Needed for safe, basic operation" },
  { priority: "high", label: "High priorities", hint: "Important maintenance and functionality" },
  { priority: "medium", label: "Medium priorities", hint: "Reliability, docs, and architecture" },
  { priority: "low", label: "Future improvements", hint: "Optional enhancements" },
]

const complexityLabel = { S: "Small", M: "Medium", L: "Large" }

function exportReport(repo: Investigation) {
  const lines = [
    `# Ghost in the Repo — ${repo.owner}/${repo.name}`,
    "",
    repo.profile.summary,
    "",
    "## Unfinished Business",
    ...repo.findings.map((f) => `- [${f.severity.toUpperCase()} · ${f.confidence}] ${f.title} — ${f.nextAction} (${f.evidence.map((e) => e.ref).join(", ")})`),
    "",
    "## Revival Blueprint",
    ...repo.blueprint.map((t) => `- [ ] **${t.title}** (${t.priority}, ${complexityLabel[t.complexity]}) — ${t.nextAction}`),
    "",
    "## Limitations",
    ...repo.limitations.map((l) => `- ${l}`),
  ]
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/markdown" }))
  const a = Object.assign(document.createElement("a"), { href: url, download: `${repo.name}-revival-report.md` })
  a.click()
  URL.revokeObjectURL(url)
}

export default function Blueprint() {
  const repo = useInvestigation()
  const storageKey = `gitr:blueprint:${repo.owner}/${repo.name}`
  const [done, setDone] = useState<Set<string>>(() => new Set(JSON.parse(localStorage.getItem(storageKey) ?? "[]")))

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...done]))
  }, [done, storageKey])

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const progress = repo.blueprint.length ? Math.round((done.size / repo.blueprint.length) * 100) : 0

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        eyebrow="Revival Blueprint"
        title="A plan to bring it back"
        description="A prioritized maintenance checklist built from the findings. Progress is saved in this browser."
        actions={
          <Button variant="outline" className="border-line" onClick={() => exportReport(repo)}>
            <Download data-icon="inline-start" /> Export report
          </Button>
        }
      />

      <div className="rounded-xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {done.size} of {repo.blueprint.length} tasks complete
          </span>
          <span className="font-mono text-gold">{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-noche" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Blueprint progress">
          <div className="h-full rounded-full bg-gradient-to-r from-cempasuchil to-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {groups.map((g) => {
        const tasks = repo.blueprint.filter((t) => t.priority === g.priority)
        if (!tasks.length) return null
        return (
          <section key={g.priority} aria-labelledby={`group-${g.priority}`}>
            <div className="mb-3 flex items-center gap-3">
              <Marigold size={22} />
              <h2 id={`group-${g.priority}`} className="font-display text-2xl font-semibold">
                {g.label}
              </h2>
              <span className="text-sm text-soft max-sm:hidden">{g.hint}</span>
            </div>
            <ul className="space-y-3">
              {tasks.map((t) => {
                const checked = done.has(t.id)
                return (
                  <li key={t.id}>
                    <article className={cn("flex gap-4 rounded-xl border bg-surface p-5 transition-opacity", checked ? "border-success/30 opacity-70" : "border-line")}>
                      <Checkbox
                        id={t.id}
                        checked={checked}
                        onCheckedChange={() => toggle(t.id)}
                        className="mt-1 size-5 border-soft data-[state=checked]:border-success data-[state=checked]:bg-success data-[state=checked]:text-noche"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <label htmlFor={t.id} className={cn("cursor-pointer font-display text-lg font-semibold", checked && "line-through decoration-success/70")}>
                            {t.title}
                          </label>
                          <span className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-soft" title="Estimated complexity">
                            {t.complexity} · {complexityLabel[t.complexity]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-soft">{t.rationale}</p>
                        <p className="mt-3 flex items-start gap-2 text-sm">
                          <ArrowRight className="mt-0.5 size-4 flex-none text-turquesa" />
                          {t.nextAction}
                        </p>
                        <EvidenceList items={t.evidence} heading={t.title} className="mt-3" />
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
