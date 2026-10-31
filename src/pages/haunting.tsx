import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowRight, LoaderCircle, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/common"
import { SiteHeader } from "@/components/site-chrome"
import { getArchive } from "@/data/archives"
import { getJob, startJob, type Job } from "@/lib/api"

export default function Haunting() {
  const { owner = "", repo = "" } = useParams()
  const navigate = useNavigate()
  const example = getArchive(owner, repo)
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState("")
  useEffect(() => {
    if (example) return
    let active = true
    startJob(owner, repo).then((result) => active && setJob(result)).catch((err) => active && setError(err.message))
    const timer = window.setInterval(() => getJob(owner, repo).then((result) => active && setJob(result)).catch(() => {}), 1800)
    return () => { active = false; window.clearInterval(timer) }
  }, [owner, repo, example])
  const done = Boolean(example) || job?.status === "complete"
  const lines = example ? ["Example investigation loaded"] : job?.log ?? []
  return <div className="min-h-svh bg-noche-deep"><SiteHeader /><main id="main" className="dot-grid"><div className="mx-auto max-w-4xl px-5 py-12 md:px-8"><Eyebrow>Step 2 · Haunting</Eyebrow><h1 className="mt-4 font-display text-4xl font-bold">{done ? "The ghost has answered." : "Following the trail…"}</h1><p className="mt-3 text-soft">Investigating <code className="text-hueso">{owner}/{repo}</code>.</p><div className="mt-8 rounded-xl border border-line bg-noche p-5"><div className="flex items-center gap-2 font-semibold"><Terminal className="size-4 text-turquesa" /> Investigation log</div><ol className="mt-4 space-y-3 font-mono text-sm text-soft">{lines.map((line, i) => <li key={`${i}-${line}`} className="flex items-center gap-2"><span className="text-turquesa">✓</span>{line}</li>)}</ol>{!done && !error && job?.status !== "error" && <p className="mt-5 flex items-center gap-2 text-turquesa"><LoaderCircle className="size-4 animate-spin" />{job?.stage ?? "Connecting to the investigation service…"}</p>}{(error || job?.error) && <p role="alert" className="mt-5 text-critical">{error || job?.error}</p>}</div><div className="mt-7 flex gap-3">{done ? <Button size="lg" onClick={() => navigate(`/r/${owner}/${repo}`)}>Open the investigation <ArrowRight /></Button> : job?.status === "error" || error ? <Button onClick={() => { setError(""); startJob(owner, repo).then(setJob).catch((err) => setError(err.message)) }}>Retry</Button> : null}<Button asChild variant="outline"><Link to="/summon">Back</Link></Button></div></div></main></div>
}
