import { useEffect, useState } from "react"
import { Link, NavLink, Outlet, useOutletContext, useParams } from "react-router"
import {
  BookOpenCheck,
  ExternalLink,
  GitBranch,
  History,
  LayoutGrid,
  Lock,
  Menu,
  MessageSquareText,
  ScrollText,
  Star,
  TriangleAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Logo, Marigold, PapelPicado, SkullAvatar } from "@/components/decor"
import { StatusDot } from "@/components/common"
import { EvidenceProvider } from "@/components/evidence"
import { getArchive } from "@/data/archives"
import { getJob } from "@/lib/api"
import type { Investigation } from "@/data/types"
import { cn } from "@/lib/utils"
import NotFound from "@/pages/not-found"

const nav = [
  { to: "", label: "Overview", icon: LayoutGrid, end: true },
  { to: "profile", label: "Ghost Profile", icon: ScrollText },
  { to: "timeline", label: "Timeline", icon: History },
  { to: "business", label: "Unfinished Business", icon: TriangleAlert },
  { to: "blueprint", label: "Revival Blueprint", icon: BookOpenCheck },
  { to: "ask", label: "Ask the Ghost", icon: MessageSquareText },
]

export function useInvestigation() {
  return useOutletContext<Investigation>()
}

function NavItems({ base, onNavigate, counts }: { base: string; onNavigate?: () => void; counts: Record<string, number> }) {
  return (
    <nav aria-label="Investigation sections" className="flex flex-col gap-1">
      <span className="px-3 pb-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-soft uppercase">
        Investigation
      </span>
      {nav.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={label}
          to={to ? `${base}/${to}` : base}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "relative flex h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-medium transition-colors",
              isActive
                ? "border-turquesa/25 bg-turquesa/10 text-turquesa-light before:absolute before:inset-y-2.5 before:-left-3 before:w-0.5 before:bg-turquesa before:shadow-[0_0_10px_var(--turquesa)]"
                : "text-soft hover:bg-elevated/60 hover:text-hueso",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="size-[18px] flex-none" />
              <span className="flex-1">{label}</span>
              {counts[to] ? (
                <span className="rounded-full bg-elevated px-2 py-0.5 font-mono text-[11px] text-hueso">{counts[to]}</span>
              ) : null}
              {isActive && <Marigold size={14} />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarBody({ repo, onNavigate }: { repo: Investigation; onNavigate?: () => void }) {
  const base = `/r/${repo.owner}/${repo.name}`
  const counts = { business: repo.findings.length, blueprint: repo.blueprint.length }
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center border-b border-line px-5">
        <Link to="/" onClick={onNavigate} aria-label="Ghost in the Repo home">
          <Logo />
        </Link>
      </div>
      <div className="mx-3 mt-4 flex items-center gap-3 rounded-lg border border-line bg-surface p-3">
        <span className="grid size-8 place-items-center rounded-md bg-turquesa/10 text-turquesa">
          <GitBranch className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-wider text-soft uppercase">Current repository</p>
          <code className="block truncate font-mono text-sm">
            {repo.owner}/{repo.name}
          </code>
        </div>
      </div>
      <div className="px-3 py-5">
        <NavItems base={base} onNavigate={onNavigate} counts={counts} />
      </div>
      <div className="mx-3 flex items-start gap-2.5 rounded-lg border border-turquesa/25 bg-turquesa/5 p-3 text-turquesa-light">
        <Lock className="mt-0.5 size-4 flex-none" />
        <div>
          <p className="text-sm font-semibold">Read-only investigation</p>
          <p className="text-xs text-soft">The Ghost never modifies or runs repository code.</p>
        </div>
      </div>
      <div className="mt-auto border-t border-line p-3">
        <div className="flex items-center gap-2.5 rounded-lg bg-success/5 p-3">
          <StatusDot />
          <div>
            <p className="text-sm font-semibold">Archive ready</p>
            <p className="font-mono text-xs text-soft">{repo.stats.indexedChunks.toLocaleString()} sources collected</p>
          </div>
        </div>
        <Link
          to="/summon"
          onClick={onNavigate}
          className="mt-2 flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm text-soft hover:border-turquesa hover:text-hueso"
        >
          Summon another repository
        </Link>
      </div>
    </div>
  )
}

function RepoHeader({ repo }: { repo: Investigation }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="border-b border-line bg-noche-deep">
      <PapelPicado />
      <div className="flex items-center gap-3 px-4 py-3 md:px-8 md:py-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[290px] border-line bg-noche-deep p-0 sm:max-w-[290px]">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">Investigation sections</SheetDescription>
            <SidebarBody repo={repo} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <SkullAvatar className="hidden size-11 sm:grid" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium tracking-wider text-soft uppercase max-sm:hidden">Investigating</p>
          <code className="block truncate font-mono text-base font-semibold md:text-lg">
            {repo.owner}/{repo.name}
          </code>
          <p className="truncate text-sm text-soft max-md:hidden">{repo.description}</p>
        </div>
        <div className="hidden items-center gap-4 text-sm text-soft xl:flex">
          <span className="font-mono">{repo.language}</span>
          <span className="flex items-center gap-1 font-mono">
            <Star className="size-3.5 text-gold" />
            {repo.stars.toLocaleString()}
          </span>
          <span>Last activity {repo.lastActivity}</span>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success sm:flex">
          <StatusDot /> Investigation complete
        </span>
        <a
          href={`https://github.com/${repo.owner}/${repo.name}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Open on GitHub"
          className="hidden size-10 place-items-center rounded-lg border border-line text-soft hover:text-hueso md:grid"
        >
          <ExternalLink className="size-4" />
        </a>
      </div>
    </header>
  )
}

export default function AppShell() {
  const { owner, repo: name } = useParams()
  const example = getArchive(owner, name)
  const [live, setLive] = useState<Investigation | null>(null)
  const [error, setError] = useState("")
  useEffect(() => {
    if (example || !owner || !name) return
    getJob(owner, name).then((job) => { if (job.report) setLive(job.report); else setError("Investigation is still running.") }).catch((err) => setError(err.message))
  }, [owner, name, example])
  const repo = example ?? live
  if (!repo) return error ? <NotFound repo={`${owner}/${name}: ${error}`} /> : <div className="p-8">Loading investigation…</div>

  return (
    <EvidenceProvider>
      <div className="min-h-svh lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-svh border-r border-line bg-noche-deep lg:block">
          <SidebarBody repo={repo} />
        </aside>
        <div className="min-w-0 bg-noche">
          <RepoHeader repo={repo} />
          <main id="main" className="dot-grid min-h-[calc(100svh-130px)]">
            <Outlet context={repo} />
          </main>
        </div>
      </div>
    </EvidenceProvider>
  )
}
