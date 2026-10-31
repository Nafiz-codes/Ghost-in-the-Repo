import { Link, useParams } from "react-router"
import { Check, Info, Lock, Minus, RefreshCw, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calavera, CandleRow, Marigold } from "@/components/decor"
import { Eyebrow } from "@/components/common"
import { SiteFooter, SiteHeader } from "@/components/site-chrome"
import { cn } from "@/lib/utils"

const states = {
  "rate-limit": {
    tab: "Partial investigation",
    code: "PARTIAL",
    eyebrow: "Partial investigation",
    title: "Some of the archive is still beyond reach.",
    text: "GitHub's API rate limit interrupted the investigation before all issues and commits could be indexed. You can still explore and ask questions, but answers may be incomplete.",
    status: "4 of 7 investigation stages complete",
    detail: "Rate limit resets in 38 minutes",
    action: "Retry when the limit resets",
    art: "candles-partial",
    available: ["Repository files", "README and documentation", "First 612 commits"],
    missing: ["592 recent commits", "Issues and pull requests", "Contributor activity"],
  },
  ollama: {
    tab: "AI offline",
    code: "AI_OFFLINE",
    eyebrow: "AI inference unavailable",
    title: "The archive is ready, but the Ghost cannot speak.",
    text: "Ollama isn't running on this machine. Your repository evidence is safely indexed and will be used as soon as the local model is back.",
    status: "1,204 chunks ready for inference",
    detail: "Expected at http://localhost:11434",
    action: "Check Ollama again",
    art: "skull",
    available: ["Repository evidence indexed", "No data needs to be fetched again", "Investigation results preserved"],
    missing: ["Local model connection", "AI-generated answers", "Follow-up reasoning"],
  },
  evidence: {
    tab: "Evidence unavailable",
    code: "NO_EVIDENCE",
    eyebrow: "Evidence unavailable",
    title: "There isn't enough here to consult.",
    text: "The repository couldn't provide the public files or history needed to ground an answer. The Ghost never answers from guesses alone.",
    status: "0 grounded sources available",
    detail: "The repository may be private, empty, or removed",
    action: "Choose another repository",
    art: "candles-out",
    available: ["Repository identity confirmed"],
    missing: ["Source files", "Commit history", "Issues and pull requests"],
  },
} as const

type StateKey = keyof typeof states

export default function States() {
  const { state } = useParams()
  const key: StateKey = state && state in states ? (state as StateKey) : "rate-limit"
  const s = states[key]

  return (
    <div className="min-h-svh bg-noche-deep">
      <SiteHeader />
      <main id="main" className="dot-grid">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <Eyebrow>System states</Eyebrow>
          <nav className="mt-4 flex flex-wrap gap-2" aria-label="System states">
            {(Object.keys(states) as StateKey[]).map((k) => (
              <Link
                key={k}
                to={`/states/${k}`}
                aria-current={k === key ? "page" : undefined}
                className={cn(
                  "h-9 rounded-full border px-4 text-sm leading-9 font-medium",
                  k === key ? "border-turquesa/50 bg-turquesa/10 text-turquesa-light" : "border-line text-soft hover:text-hueso",
                )}
              >
                {states[k].tab}
              </Link>
            ))}
          </nav>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-elevated/80 to-noche px-6 py-10 text-center shadow-[0_18px_48px_rgb(8_2_19/0.4)] md:py-14">
              <div className="pointer-events-none absolute size-96 rounded-full bg-cempasuchil/10 blur-[120px]" />
              <Marigold size={24} className="absolute top-8 left-[14%] max-sm:hidden" />
              <Marigold size={18} className="absolute right-[16%] bottom-10 max-sm:hidden" />
              <div className="relative grid min-h-44 place-items-center">
                {s.art === "skull" ? (
                  <Calavera variant="resting" className="h-48 w-auto" />
                ) : (
                  <CandleRow className="scale-150" lit={s.art === "candles-partial" ? [true, true, false] : [false, true, false]} />
                )}
              </div>
              <Eyebrow className="relative mt-4">{s.eyebrow}</Eyebrow>
              <h1 className="relative mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">{s.title}</h1>
              <p className="relative mt-3 max-w-xl text-soft">{s.text}</p>
              <div className="relative mt-6 flex w-full max-w-md items-start gap-3 rounded-lg border border-line bg-noche p-3 text-left">
                <Info className="mt-0.5 size-4 flex-none text-gold" />
                <div>
                  <p className="text-sm font-semibold">{s.status}</p>
                  <p className="font-mono text-xs text-soft">{s.detail}</p>
                </div>
              </div>
              <Button asChild className="relative mt-5">
                <Link to={key === "evidence" ? "/summon" : "/r/ghost/lantern"}>
                  <RefreshCw data-icon="inline-start" /> {s.action}
                </Link>
              </Button>
            </section>

            <aside className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line bg-elevated px-5 py-4">
                <span className="font-display text-lg font-semibold">Investigation state</span>
                <code className="font-mono text-xs text-cempasuchil">{s.code}</code>
              </div>
              <section className="border-b border-line p-5">
                <h2 className="font-mono text-[11px] font-semibold tracking-wider text-soft uppercase">Still available</h2>
                <ul className="mt-3 space-y-2.5">
                  {s.available.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm">
                      <span className="grid size-5 place-items-center rounded-full bg-success/15 text-success">
                        <Check className="size-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <section className="border-b border-line p-5">
                <h2 className="font-mono text-[11px] font-semibold tracking-wider text-soft uppercase">Unavailable right now</h2>
                <ul className="mt-3 space-y-2.5">
                  {s.missing.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-soft">
                      <span className="grid size-5 place-items-center rounded-full bg-critical/15 text-critical">
                        <Minus className="size-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <div className="m-4 flex gap-2.5 rounded-lg border border-turquesa/25 bg-turquesa/5 p-3">
                <Lock className="mt-0.5 size-4 flex-none text-turquesa" />
                <p className="text-xs text-soft">
                  <span className="block text-sm font-semibold text-hueso">Transparent by design</span>
                  Unavailable evidence is clearly marked and never replaced with invented details.
                </p>
              </div>
              {key === "ollama" && (
                <div className="mx-4 mb-4 flex items-center gap-3 rounded-lg bg-noche p-3">
                  <Terminal className="size-4 text-turquesa" />
                  <div>
                    <p className="text-xs text-soft">Start Ollama locally</p>
                    <code className="font-mono text-sm">ollama serve</code>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
