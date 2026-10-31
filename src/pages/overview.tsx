import { Link } from "react-router"
import {
  ArrowRight,
  CircleCheck,
  CircleHelp,
  CircleX,
  FileSearch,
  GitCommitHorizontal,
  Info,
  MessageSquareText,
  TriangleAlert,
  Users,
  CircleDot,
  CalendarClock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActivityChart } from "@/components/activity-chart"
import { useInvestigation } from "@/components/app-shell"
import { Calavera } from "@/components/decor"
import { ConfidenceBadge, Panel, SeverityBadge, severityDot, severityLabel } from "@/components/common"
import { suggestedQuestions } from "@/data/lantern"
import type { HealthCheck, Severity } from "@/data/types"
import { cn } from "@/lib/utils"

const healthIcon: Record<HealthCheck["status"], { icon: typeof CircleCheck; className: string }> = {
  good: { icon: CircleCheck, className: "text-success" },
  warning: { icon: TriangleAlert, className: "text-gold" },
  critical: { icon: CircleX, className: "text-critical" },
  unknown: { icon: CircleHelp, className: "text-soft" },
}

export default function Overview() {
  const repo = useInvestigation()
  const base = `/r/${repo.owner}/${repo.name}`
  const severities: Severity[] = ["critical", "high", "medium", "low"]
  const bySeverity = Object.fromEntries(severities.map((s) => [s, repo.findings.filter((f) => f.severity === s).length]))

  const metrics = [
    { label: "Commits analyzed", value: repo.stats.commitsAnalyzed.toLocaleString(), note: `of ${repo.stats.commitsTotal.toLocaleString()}`, icon: GitCommitHorizontal },
    { label: "Contributors", value: repo.stats.contributors, icon: Users },
    { label: "Open issues", value: repo.stats.openIssues, note: `${repo.stats.openPullRequests} open PRs`, icon: CircleDot },
    { label: "Files examined", value: repo.stats.filesExamined, icon: FileSearch },
    { label: "Last activity", value: repo.lastActivityRelative, note: repo.lastActivity, icon: CalendarClock },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-line bg-surface p-4 last:max-md:col-span-2">
            <div className="flex items-center justify-between text-soft">
              <span className="text-xs font-medium tracking-wide uppercase">{m.label}</span>
              <m.icon className="size-4 text-turquesa" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-gold md:text-3xl">{m.value}</p>
            {m.note && <p className="font-mono text-xs text-soft">{m.note}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">
        <section className="ofrenda-frame overflow-hidden rounded-2xl bg-gradient-to-br from-elevated to-surface">
          <div className="grid gap-4 p-6 sm:grid-cols-[150px_1fr]">
            <Calavera variant="portrait" className="mx-auto w-32 sm:w-full" />
            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.14em] text-gold uppercase">Ghost Profile</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{repo.profile.claims[0]?.text ?? repo.description}</h2>
              <p className="mt-3 text-sm text-soft">{repo.profile.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <ConfidenceBadge confidence="verified" />
                <span className="text-xs text-soft">
                  {repo.profile.claims.filter((c) => c.confidence === "verified").length} of {repo.profile.claims.length} claims verified
                </span>
              </div>
              <Button asChild variant="turquesa" className="mt-5">
                <Link to={`${base}/profile`}>
                  Read the full profile <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Panel
          title="Unfinished Business"
          action={<Link to={`${base}/business`} className="text-sm text-turquesa-light hover:underline">View all</Link>}
        >
          <div className="grid grid-cols-4 gap-2">
            {severities.map((s) => (
              <Link
                key={s}
                to={`${base}/business?severity=${s}`}
                className="rounded-lg border border-line bg-noche p-3 text-center hover:border-soft"
              >
                <span className="font-display text-2xl font-bold">{bySeverity[s]}</span>
                <span className="mt-1 flex items-center justify-center gap-1.5 text-xs text-soft">
                  <span className={cn("size-1.5 rounded-full", severityDot[s])} />
                  {severityLabel[s]}
                </span>
              </Link>
            ))}
          </div>
          <ul className="mt-4 divide-y divide-line">
            {repo.findings.slice(0, 3).map((f) => (
              <li key={f.id} className="flex items-start gap-3 py-3">
                <SeverityBadge severity={f.severity} className="mt-0.5" />
                <p className="text-sm">{f.title}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Panel
          title="Development activity"
          action={<Link to={`${base}/timeline`} className="text-sm text-turquesa-light hover:underline">Timeline</Link>}
        >
          <ActivityChart data={repo.activity} />
        </Panel>
        <Panel title="Technical health">
          <ul className="space-y-3">
            {repo.health.map((h) => {
              const { icon: Icon, className } = healthIcon[h.status]
              return (
                <li key={h.label} className="flex gap-3">
                  <Icon className={cn("mt-0.5 size-5 flex-none", className)} />
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">{h.label}</span> · {h.summary}
                    </p>
                    <p className="text-xs text-soft">{h.detail}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Technology stack">
          <ul className="flex flex-wrap gap-2">
            {repo.stack.map((t) => (
              <li
                key={t.name}
                className={cn(
                  "rounded-lg border bg-noche px-3 py-2",
                  t.outdated ? "border-cempasuchil/40" : "border-line",
                )}
              >
                <p className="font-mono text-sm font-medium">
                  {t.name} {t.version && <span className="text-soft">{t.version}</span>}
                </p>
                <p className={cn("text-xs", t.outdated ? "text-[#ffb057]" : "text-soft")}>
                  {t.role}
                  {t.outdated && " · outdated"}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Revival Blueprint"
          action={<Link to={`${base}/blueprint`} className="text-sm text-turquesa-light hover:underline">Open</Link>}
        >
          <ol className="space-y-3">
            {repo.blueprint.slice(0, 3).map((t, i) => (
              <li key={t.id} className="flex gap-3">
                <span className="grid size-7 flex-none place-items-center rounded-full bg-elevated font-mono text-xs">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-soft">{t.nextAction}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Ask the Ghost" className="lg:col-span-2 xl:col-span-1">
          <p className="text-sm text-soft">Ask questions answered only from this repository's evidence.</p>
          <div className="mt-4 space-y-2">
            {suggestedQuestions.slice(0, 2).map((q) => (
              <Link
                key={q}
                to={`${base}/ask?q=${encodeURIComponent(q)}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-noche px-3 py-2.5 text-sm hover:border-turquesa"
              >
                {q}
                <ArrowRight className="size-4 flex-none text-turquesa" />
              </Link>
            ))}
          </div>
          <Button asChild className="mt-4 w-full">
            <Link to={`${base}/ask`}>
              <MessageSquareText data-icon="inline-start" /> Consult the Ghost
            </Link>
          </Button>
        </Panel>
      </div>

      <section className="rounded-xl border border-gold/30 bg-gold/5 p-5">
        <h2 className="flex items-center gap-2 font-semibold text-gold">
          <Info className="size-4" /> Investigation limitations
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-soft md:grid-cols-2">
          {repo.limitations.map((l) => (
            <li key={l} className="flex gap-2">
              <span className="text-gold">—</span>
              {l}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
