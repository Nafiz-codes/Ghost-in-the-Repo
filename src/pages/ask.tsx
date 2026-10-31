import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { ArrowRight, ArrowUp, FileCode2, GitCommitHorizontal, Info, Lock, MessageSquareText, RotateCcw, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInvestigation } from "@/components/app-shell"
import { Calavera, SkullAvatar } from "@/components/decor"
import { Eyebrow, StatusDot } from "@/components/common"
import { EvidenceList } from "@/components/evidence"
import { answerBank, insufficientAnswer, suggestedQuestions, type GhostAnswer } from "@/data/lantern"
import { askGhost } from "@/lib/api"
import { cn } from "@/lib/utils"

type Message = { id: number; role: "user"; text: string } | { id: number; role: "ghost"; answer: GhostAnswer | null }

function findAnswer(question: string) {
  return answerBank.find((a) => a.match.test(question))?.answer ?? insufficientAnswer
}

export default function Ask() {
  const repo = useInvestigation()
  const [params, setParams] = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const nextId = useRef(0)
  const endRef = useRef<HTMLDivElement>(null)
  const pending = messages.some((m) => m.role === "ghost" && m.answer === null)

  function ask(question: string) {
    const q = question.trim()
    if (!q || pending) return
    const ghostId = nextId.current + 1
    nextId.current += 2
    setMessages((m) => [...m, { id: ghostId - 1, role: "user", text: q }, { id: ghostId, role: "ghost", answer: null }])
    setDraft("")
    const response = repo.owner === "ghost" && repo.name === "lantern"
      ? Promise.resolve(findAnswer(q))
      : askGhost(repo.owner, repo.name, q).catch((err) => ({ grounded: false, paragraphs: [err.message], sources: [] }))
    response.then((answer) => setMessages((m) => m.map((msg) => (msg.id === ghostId ? { ...msg, answer } : msg))))
  }

  const initialQuestion = useRef(params.get("q"))
  useEffect(() => {
    const q = initialQuestion.current
    if (!q) return
    initialQuestion.current = null
    ask(q)
    setParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  const asked = new Set(messages.flatMap((m) => (m.role === "user" ? [m.text] : [])))
  const followUps = suggestedQuestions.filter((q) => !asked.has(q)).slice(0, 3)

  return (
    <div className="grid min-h-[calc(100svh-130px)] xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="flex min-h-[calc(100svh-130px)] min-w-0 flex-col xl:border-r xl:border-line">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-noche/90 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Eyebrow>Ask the Ghost</Eyebrow>
            <span className="truncate text-sm text-soft max-sm:hidden">Answers grounded in {repo.stats.indexedChunks.toLocaleString()} sources</span>
          </div>
          {messages.length > 0 && (
            <Button variant="outline" size="sm" className="border-line" onClick={() => setMessages([])}>
              <RotateCcw data-icon="inline-start" /> New conversation
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto" aria-live="polite">
          {messages.length === 0 ? (
            <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-10 text-center md:py-14">
              <Calavera variant="portrait" className="w-40 md:w-48" />
              <Eyebrow className="mt-2">The archive is open</Eyebrow>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
                Ask what the repository remembers.
              </h1>
              <p className="mt-3 max-w-xl text-soft">
                The Ghost reads code, commits, issues, and pull requests — then answers with a trail back to the original
                evidence.
              </p>
              <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left transition-colors hover:border-turquesa hover:bg-elevated"
                  >
                    <span className="font-display text-lg font-bold text-cempasuchil">0{i + 1}</span>
                    <span className="flex-1 text-sm">{q}</span>
                    <ArrowRight className="size-4 flex-none text-turquesa transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-6">
              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-elevated px-4 py-3">{m.text}</p>
                  </div>
                ) : (
                  <GhostMessage key={m.id} answer={m.answer} />
                ),
              )}
              {!pending && followUps.length > 0 && (
                <div className="pl-0 sm:pl-[52px]">
                  <p className="mb-2 text-xs font-medium tracking-wide text-soft uppercase">Continue exploring</p>
                  <div className="flex flex-wrap gap-2">
                    {followUps.map((q) => (
                      <button key={q} onClick={() => ask(q)} className="rounded-lg border border-line bg-surface/70 px-3 py-2 text-left text-sm text-soft hover:border-turquesa hover:text-hueso">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(draft)
          }}
          className="sticky bottom-0 border-t border-line bg-noche-deep px-4 py-3 md:px-6"
        >
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border border-line bg-surface p-2 focus-within:border-turquesa focus-within:shadow-[0_0_0_3px_rgb(0_179_179/0.12)]">
            <label htmlFor="ask-input" className="sr-only">
              Ask the Ghost
            </label>
            <textarea
              id="ask-input"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  ask(draft)
                }
              }}
              placeholder="Ask the repository a question…"
              className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 outline-none placeholder:text-soft/70"
            />
            <Button type="submit" size="icon" disabled={!draft.trim() || pending} aria-label="Send question">
              <ArrowUp />
            </Button>
          </div>
          <div className="mx-auto mt-2 flex max-w-3xl justify-between gap-3 text-xs text-soft">
            <span className="flex items-center gap-1.5">
              <Lock className="size-3" /> Answers stay within this repository's evidence
            </span>
            <span className="max-sm:hidden">Enter to send · Shift + Enter for a new line</span>
          </div>
        </form>
      </div>

      <aside className="hidden space-y-4 bg-noche-deep p-4 xl:block">
        <div className="ofrenda-frame flex flex-col items-center rounded-xl bg-gradient-to-br from-elevated to-surface p-4 text-center">
          <Calavera variant="portrait" className="w-24" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-cempasuchil uppercase">Archive context</span>
          <code className="mt-1 font-mono text-turquesa-light">
            {repo.owner}/{repo.name}
          </code>
          <p className="text-xs text-soft">Public repository · Investigation complete</p>
        </div>
        <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-line bg-surface text-center">
          <div className="p-3">
            <dt className="text-xs text-soft">Sources</dt>
            <dd className="font-display text-xl font-bold text-gold">{repo.stats.indexedChunks.toLocaleString()}</dd>
          </div>
          <div className="border-l border-line p-3">
            <dt className="text-xs text-soft">Verified claims</dt>
            <dd className="font-display text-xl font-bold text-gold">
              {repo.profile.claims.filter((c) => c.confidence === "verified").length}/{repo.profile.claims.length}
            </dd>
          </div>
        </dl>
        <div>
          <h2 className="font-mono text-[11px] font-semibold tracking-wider text-soft uppercase">Sources available</h2>
          <ul className="mt-1 divide-y divide-line">
            {[
              { icon: FileCode2, title: `${repo.stats.filesExamined} files`, sub: "Source and documentation" },
              { icon: GitCommitHorizontal, title: `${repo.stats.commitsAnalyzed.toLocaleString()} commits`, sub: "History and decisions" },
              { icon: MessageSquareText, title: `${repo.stats.discussions} discussions`, sub: "Issues and pull requests" },
            ].map((s) => (
              <li key={s.title} className="flex items-center gap-3 py-3">
                <s.icon className="size-4 text-turquesa" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-soft">{s.sub}</p>
                </div>
                <span className="font-mono text-xs text-success">Ready</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2.5 rounded-lg border border-turquesa/25 bg-turquesa/5 p-3">
          <Info className="mt-0.5 size-4 flex-none text-turquesa" />
          <p className="text-xs text-soft">
            <span className="block text-sm font-semibold text-hueso">How answers work</span>
            The Ghost cites repository evidence and marks uncertainty instead of inventing details.
          </p>
        </div>
      </aside>
    </div>
  )
}

function GhostMessage({ answer }: { answer: GhostAnswer | null }) {
  return (
    <div className="flex gap-3">
      <SkullAvatar />
      <article className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-line bg-surface p-4 shadow-[0_18px_48px_rgb(8_2_19/0.3)] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <strong className="font-display">The Ghost</strong>
          {answer &&
            (answer.grounded ? (
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-success uppercase">
                <StatusDot /> Grounded answer
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-gold uppercase">
                <Info className="size-3.5" /> Insufficient evidence
              </span>
            ))}
        </div>
        {answer === null ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-soft">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-1.5 animate-bounce rounded-full bg-turquesa" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </span>
            Searching the archive…
          </p>
        ) : (
          <>
            {!answer.grounded && (
              <div className="mt-3 flex gap-2.5 rounded-lg border border-gold/30 bg-gold/5 p-3">
                <TriangleAlert className="mt-0.5 size-4 flex-none text-gold" />
                <p className="text-sm font-semibold text-gold">Not enough evidence in this repository to answer confidently.</p>
              </div>
            )}
            {answer.paragraphs.map((p) => (
              <p key={p} className={cn("mt-3 leading-relaxed text-hueso/90")}>
                {p}
              </p>
            ))}
            {answer.sources.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <span className="text-xs font-medium tracking-wide text-soft uppercase">{answer.grounded ? "Sources" : "Partial evidence"}</span>
                <EvidenceList items={answer.sources} heading="Sources for this answer" />
              </div>
            )}
          </>
        )}
      </article>
    </div>
  )
}
