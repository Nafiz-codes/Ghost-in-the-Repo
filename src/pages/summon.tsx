import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { ArrowRight, CircleAlert, Clock, LoaderCircle, SearchX, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calavera, CandleRow, GithubMark } from "@/components/decor"
import { Eyebrow, StatusDot } from "@/components/common"
import { SiteHeader } from "@/components/site-chrome"
import { examples, getArchive } from "@/data/archives"
import { fetchRepoPreview, parseRepoUrl, timeAgo, type PreviewResult, type RepoRef } from "@/lib/github"
import { cn } from "@/lib/utils"

type State = { status: "idle" } | { status: "invalid" } | { status: "loading" } | PreviewResult

function useRepoPreview(ref: RepoRef | null, raw: string | null): State {
  const [state, setState] = useState<State>({ status: "idle" })

  useEffect(() => {
    if (raw === null) return setState({ status: "idle" })
    if (!ref) return setState({ status: "invalid" })
    const archive = getArchive(ref.owner, ref.name)
    if (archive) {
      return setState({
        status: "found",
        repo: {
          owner: archive.owner,
          name: archive.name,
          description: archive.description,
          language: archive.language,
          stars: archive.stars,
          pushedAt: "2022-08-09T00:00:00Z",
          archived: false,
        },
      })
    }
    const controller = new AbortController()
    setState({ status: "loading" })
    fetchRepoPreview(ref, controller.signal).then(setState, () => {})
    return () => controller.abort()
  }, [ref?.owner, ref?.name, raw])

  return state
}

export default function Summon() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const raw = params.get("repo")
  const ref = raw ? parseRepoUrl(raw) : null
  const state = useRepoPreview(ref, raw)
  const [draft, setDraft] = useState(raw ?? "")

  useEffect(() => setDraft(raw ?? ""), [raw])

  function submit(e: FormEvent) {
    e.preventDefault()
    setParams(draft.trim() ? { repo: draft.trim() } : {})
  }


  return (
    <div className="min-h-svh bg-noche-deep">
      <SiteHeader />
      <main id="main" className="dot-grid relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-[1fr_320px] lg:py-20">
          <div>
            <Eyebrow>Step 1 · Summon</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Which repository should we call back?
            </h1>
            <p className="mt-3 max-w-xl text-soft">
              Paste a public GitHub repository. The Ghost reads it without changing anything.
            </p>

            <form onSubmit={submit} noValidate className="mt-8">
              <div
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border bg-surface p-2 transition-colors focus-within:border-turquesa sm:flex-row sm:items-center",
                  state.status === "invalid" || state.status === "not-found" ? "border-critical/70" : "border-line",
                )}
              >
                <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <GithubMark className="size-5 flex-none text-soft" />
                  <span className="sr-only">GitHub repository URL</span>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    aria-invalid={state.status === "invalid"}
                    className="h-12 w-full min-w-0 bg-transparent font-mono text-base outline-none placeholder:text-soft/70"
                    autoFocus
                  />
                </label>
                <Button type="submit" size="lg" variant="turquesa">
                  Identify
                </Button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-soft">Try an example:</span>
              {examples.map((ex) => (
                <button
                  key={ex.name}
                  type="button"
                  onClick={() => setParams({ repo: `${ex.owner}/${ex.name}` })}
                  className="h-8 rounded-full border border-line bg-surface px-3 font-mono text-xs hover:border-gold"
                >
                  {ex.owner}/{ex.name}
                </button>
              ))}
            </div>

            <div className="mt-8" aria-live="polite">
              {state.status === "idle" && (
                <p className="rounded-xl border border-dashed border-line p-5 text-sm text-soft">
                  Accepted formats: <code className="font-mono text-hueso">https://github.com/owner/name</code>,{" "}
                  <code className="font-mono text-hueso">github.com/owner/name</code>, or{" "}
                  <code className="font-mono text-hueso">owner/name</code>.
                </p>
              )}
              {state.status === "invalid" && (
                <Notice tone="critical" icon={CircleAlert} title="That isn't a GitHub repository URL">
                  Use the form <code className="font-mono">github.com/owner/name</code>. Private repositories aren't supported yet.
                </Notice>
              )}
              {state.status === "loading" && (
                <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-5 text-soft">
                  <LoaderCircle className="size-5 animate-spin text-turquesa" />
                  Looking for <code className="font-mono text-hueso">{raw}</code> on GitHub…
                </div>
              )}
              {state.status === "not-found" && (
                <Notice tone="critical" icon={SearchX} title="Repository not found">
                  <code className="font-mono">{ref?.owner}/{ref?.name}</code> doesn't exist, was removed, or is private.
                </Notice>
              )}
              {state.status === "rate-limited" && (
                <Notice tone="gold" icon={Clock} title="GitHub's rate limit was reached">
                  Too many lookups from this network.{" "}
                  {state.resetAt ? `Try again after ${state.resetAt.toLocaleTimeString()}.` : "Try again in a few minutes."}
                </Notice>
              )}
              {state.status === "error" && (
                <Notice tone="critical" icon={CircleAlert} title="Couldn't check this repository">
                  {state.message}
                </Notice>
              )}
              {state.status === "found" && (
                <div className="ofrenda-frame rounded-2xl bg-elevated/80 p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-success">
                    <StatusDot /> Repository identified
                  </div>
                  <code className="mt-3 block font-mono text-xl font-semibold break-all">
                    {state.repo.owner}/{state.repo.name}
                  </code>
                  <p className="mt-2 text-soft">{state.repo.description ?? "No description provided."}</p>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex gap-1.5">
                      <dt className="text-soft">Language</dt>
                      <dd className="font-mono">{state.repo.language ?? "Unknown"}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Stars</dt>
                      <Star className="size-3.5 text-gold" />
                      <dd className="font-mono">{state.repo.stars.toLocaleString()}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-soft">Last push</dt>
                      <dd>{timeAgo(state.repo.pushedAt)}</dd>
                    </div>
                    {state.repo.archived && <dd className="font-semibold text-gold">Archived by owner</dd>}
                  </dl>
                  <Button size="lg" className="mt-6" onClick={() => navigate(`/haunting/${state.repo.owner}/${state.repo.name}`)}>
                    Begin the Haunting <ArrowRight data-icon="inline-end" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden flex-col items-center lg:flex">
            <Calavera variant="portrait" className="w-full" />
            <CandleRow className="-mt-6" />
          </div>
        </div>
      </main>
    </div>
  )
}

function Notice({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: "critical" | "gold"
  icon: typeof CircleAlert
  title: string
  children: ReactNode
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border p-5",
        tone === "critical" ? "border-critical/40 bg-critical/8" : "border-gold/40 bg-gold/8",
      )}
    >
      <Icon className={cn("mt-0.5 size-5 flex-none", tone === "critical" ? "text-critical" : "text-gold")} />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-soft">{children}</p>
      </div>
    </div>
  )
}
