import { useInvestigation } from "@/components/app-shell"
import { Calavera, Marigold } from "@/components/decor"
import { ConfidenceBadge, PageHeader, Panel } from "@/components/common"
import { EvidenceList } from "@/components/evidence"
import { cn } from "@/lib/utils"

export default function Profile() {
  const repo = useInvestigation()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        eyebrow="Ghost Profile"
        title="The reconstructed identity"
        description="What this project was, who it served, and how it lived — each claim labeled by how strongly the evidence supports it."
      />

      <section className="ofrenda-frame relative overflow-hidden rounded-2xl bg-gradient-to-br from-elevated via-surface to-noche">
        <div className="grid items-center gap-6 p-6 md:grid-cols-[220px_1fr] md:p-8">
          <Calavera variant="portrait" className="mx-auto w-44 md:w-full" alt="" />
          <div>
            <code className="font-mono text-2xl font-semibold text-turquesa-light md:text-3xl">
              {repo.owner}/{repo.name}
            </code>
            <p className="mt-1 text-sm text-soft">
              {repo.createdAt} — {repo.lastActivity} · {repo.language} · {repo.license}
            </p>
            <p className="mt-4 font-display text-xl leading-snug md:text-2xl">{repo.profile.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {repo.stack.map((t) => (
                <span key={t.name} className="rounded-md border border-line bg-noche/70 px-2.5 py-1 font-mono text-xs">
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Marigold size={26} className="absolute top-4 left-4" />
        <Marigold size={20} className="absolute top-4 right-4" />
        <Marigold size={20} className="absolute bottom-4 left-4" />
        <Marigold size={26} className="absolute right-4 bottom-4" />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {repo.profile.claims.map((claim) => (
          <article
            key={claim.label}
            className={cn(
              "rounded-xl border bg-surface p-5",
              claim.confidence === "hypothesis" ? "border-dashed border-rosa-light/40" : "border-line",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-mono text-xs font-semibold tracking-[0.14em] text-gold uppercase">{claim.label}</h2>
              <ConfidenceBadge confidence={claim.confidence} />
            </div>
            <p className="mt-3">{claim.text}</p>
            <div className="mt-4 border-t border-line pt-3">
              <EvidenceList items={claim.evidence} heading={claim.label} />
            </div>
          </article>
        ))}
      </div>

      <Panel title="Project lifecycle">
        <ol className="grid gap-4 md:grid-cols-5">
          {repo.profile.lifecycle.map((l, i) => (
            <li key={l.stage} className="relative">
              <div className="flex items-center gap-2">
                <Marigold size={18} dim={i === repo.profile.lifecycle.length - 1} />
                <h3 className="font-display text-lg font-semibold">{l.stage}</h3>
              </div>
              <p className="mt-2 text-sm text-soft">{l.text}</p>
              <ConfidenceBadge confidence={l.confidence} className="mt-2" />
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  )
}
