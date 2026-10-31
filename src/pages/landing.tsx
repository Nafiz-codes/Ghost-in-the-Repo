import { Link } from "react-router"
import { ArrowRight, Cpu, Eye, HardDrive, Lock, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calavera, CandleRow, Marigold } from "@/components/decor"
import { Eyebrow, SeverityBadge } from "@/components/common"
import { RepoInput } from "@/components/repo-input"
import { SiteFooter, SiteHeader } from "@/components/site-chrome"
import { examples } from "@/data/archives"
import { lantern } from "@/data/lantern"

const steps = [
  {
    name: "Summon",
    icon: Search,
    text: "Paste a public GitHub URL. The Ghost confirms the repository and reads its metadata.",
  },
  {
    name: "Haunting",
    icon: Eye,
    text: "Docs, source structure, commits, issues, and pull requests are examined and indexed.",
  },
  {
    name: "Revival",
    icon: Sparkles,
    text: "Get the project's story, its unfinished business, and a prioritized plan to bring it back.",
  },
]

const openSource = [
  { icon: Cpu, title: "Gemma, open weights", text: "No closed AI API at the core. Swap the model without rewriting the app." },
  { icon: HardDrive, title: "Runs locally with Ollama", text: "Repository contents never leave your machine for an undisclosed provider." },
  { icon: Lock, title: "Read-only by design", text: "Public repositories only. The Ghost never runs code, commits, or pushes." },
]

export default function Landing() {
  const counts = lantern.findings.reduce<Record<string, number>>((acc, f) => {
    acc[f.severity] = (acc[f.severity] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-svh overflow-x-clip bg-noche-deep">
      <SiteHeader />

      <section className="relative">
        <div className="pointer-events-none absolute inset-0 dot-grid" />
        <div className="pointer-events-none absolute top-0 right-0 h-[520px] w-[520px] rounded-full bg-rosa/10 blur-[140px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-10 pb-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16 lg:pb-24">
          <div>
            <Eyebrow>Digital archaeology · Open-source AI</Eyebrow>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] font-bold tracking-tight text-balance md:text-6xl xl:text-7xl">
              Every repository leaves a <span className="text-gold">ghost</span> behind.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-soft">
              Ghost in the Repo uses open-source AI to investigate abandoned GitHub repositories, reconstruct their
              history, and build a plan to bring them back.
            </p>
            <RepoInput className="mt-8 max-w-xl" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" size="lg" className="border-line bg-transparent">
                <Link to="/r/ghost/lantern">Explore an Example</Link>
              </Button>
              <span className="text-sm text-soft">No sign-up · Public repositories · Read-only</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <Calavera
              variant="hero"
              alt="Painted sugar skull crowned with marigolds"
              className="mx-auto w-[78%] drop-shadow-[0_30px_60px_rgb(0_0_0/0.5)] sm:w-[70%]"
            />
            <div className="ofrenda-frame -mt-24 rounded-2xl bg-elevated/95 p-5 backdrop-blur sm:mx-6">
              <div className="flex items-center justify-between gap-3">
                <Eyebrow>Ghost Profile</Eyebrow>
                <span className="font-mono text-xs text-soft">Last commit {lantern.lastActivityRelative}</span>
              </div>
              <code className="mt-3 block font-mono text-lg font-semibold text-turquesa-light">
                {lantern.owner}/{lantern.name}
              </code>
              <p className="mt-1.5 text-sm text-soft">{lantern.profile.summary.split(". ")[0]}.</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {lantern.stack.slice(0, 4).map((t) => (
                  <span key={t.name} className="rounded-md border border-line bg-noche px-2 py-0.5 font-mono text-xs">
                    {t.name}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                {(["critical", "high", "medium", "low"] as const).map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <SeverityBadge severity={s} />
                    <span className="font-mono text-sm">{counts[s] ?? 0}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex max-w-7xl items-end justify-between px-8 pb-2" aria-hidden="true">
          <CandleRow />
          <div className="flex gap-3 max-sm:hidden">
            <Marigold size={22} />
            <Marigold size={16} />
            <Marigold size={26} />
          </div>
          <CandleRow lit={[true, false, true]} />
        </div>
      </section>

      <section id="how" className="border-t border-line bg-noche">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">From forgotten to revived in three steps</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.name} className="relative rounded-xl border border-line bg-surface p-6">
                <div className="flex items-center gap-3">
                  <Marigold size={28} />
                  <span className="font-mono text-sm text-soft">0{i + 1}</span>
                  <step.icon className="ml-auto size-5 text-turquesa" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">{step.name}</h3>
                <p className="mt-2 text-soft">{step.text}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute top-1/2 -right-5 z-10 hidden size-5 -translate-y-1/2 text-gold md:block" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="examples" className="border-t border-line bg-noche-deep">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <Eyebrow>Explore an example</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Start with a repository that went quiet</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {examples.map((ex) => (
              <Link
                key={ex.name}
                to={ex.fullArchive ? `/r/${ex.owner}/${ex.name}` : `/summon?repo=${ex.owner}/${ex.name}`}
                className="group rounded-xl border border-line bg-surface p-6 transition-colors hover:border-gold/70 hover:bg-elevated"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-soft">{ex.language}</span>
                  {ex.fullArchive ? (
                    <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">Full archive</span>
                  ) : (
                    <span className="rounded-full bg-turquesa/10 px-2.5 py-0.5 text-xs font-semibold text-turquesa-light">
                      Live preview
                    </span>
                  )}
                </div>
                <code className="mt-4 block font-mono text-lg font-semibold">
                  {ex.owner}/{ex.name}
                </code>
                <p className="mt-2 text-soft">{ex.description}</p>
                <p className="mt-5 flex items-center gap-2 text-sm font-medium text-turquesa-light">
                  {ex.fullArchive ? "Open the investigation" : "Summon from GitHub"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="open-source" className="border-t border-line bg-noche">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>Powered by open-source AI</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">Your code stays yours</h2>
            <p className="mt-4 text-soft">
              Every finding is grounded in evidence from the repository and labeled Verified, Likely, or Hypothesis — so
              you always know what's fact and what's a guess.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {openSource.map((item) => (
              <div key={item.title} className="rounded-xl border border-line bg-surface p-5">
                <item.icon className="size-6 text-turquesa" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-sm text-soft">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
