import { useInvestigation } from "@/components/app-shell"
import { ActivityChart } from "@/components/activity-chart"
import { Candle, Marigold } from "@/components/decor"
import { PageHeader, Panel } from "@/components/common"
import { EvidenceList, EvidenceUnavailable } from "@/components/evidence"
import type { TimelineEvent } from "@/data/types"
import { cn } from "@/lib/utils"

const kindLabel: Record<TimelineEvent["kind"], string> = {
  origin: "Origin",
  release: "Release",
  peak: "Peak",
  contributors: "Contributors",
  last: "Last active",
  silence: "Silence",
}

export default function Timeline() {
  const repo = useInvestigation()

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        eyebrow="Timeline"
        title="How the project lived — and when it went quiet"
        description={`Reconstructed from ${repo.stats.commitsAnalyzed.toLocaleString()} commits, releases, and ${repo.stats.discussions} issue and pull request discussions.`}
      />

      <Panel title="Commits over time">
        <ActivityChart data={repo.activity} />
      </Panel>

      <ol className="relative space-y-4 pl-10 md:pl-0">
        <span className="absolute top-2 bottom-2 left-[14px] w-0.5 bg-gradient-to-b from-cempasuchil via-cempasuchil/50 to-line md:left-1/2" aria-hidden="true" />
        {repo.timeline.map((e, i) => {
          const right = i % 2 === 1
          return (
            <li key={e.title} className={cn("relative md:flex", right ? "md:justify-end" : "md:justify-start")}>
              <span className="absolute top-5 -left-10 grid w-[30px] place-items-center md:left-1/2 md:-translate-x-1/2">
                {e.kind === "last" ? <Candle height={34} /> : <Marigold size={e.kind === "silence" ? 18 : 24} dim={e.kind === "silence"} />}
              </span>
              <article
                className={cn(
                  "rounded-xl border bg-surface p-5 md:w-[calc(50%-36px)]",
                  e.kind === "last" ? "border-rosa/50" : e.kind === "peak" ? "border-gold/50" : "border-line",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <time className="font-mono text-sm text-gold">{e.date}</time>
                  <span className="text-xs font-medium tracking-wide text-soft uppercase">{kindLabel[e.kind]}</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold">{e.title}</h2>
                <p className="mt-1 text-sm text-soft">{e.detail}</p>
                <div className="mt-3">
                  {e.evidence.length ? <EvidenceList items={e.evidence} heading={e.title} /> : <EvidenceUnavailable />}
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
