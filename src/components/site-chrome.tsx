import { Link } from "react-router"
import { Logo, PapelPicado } from "@/components/decor"

export function SiteHeader() {
  return (
    <header className="relative z-20">
      <PapelPicado />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" aria-label="Ghost in the Repo home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm text-soft">
          <a href="/#how" className="rounded-md px-3 py-2 hover:text-hueso max-md:hidden">
            How it works
          </a>
          <a href="/#examples" className="rounded-md px-3 py-2 hover:text-hueso max-md:hidden">
            Examples
          </a>
          <a href="/#open-source" className="rounded-md px-3 py-2 hover:text-hueso max-md:hidden">
            Open source
          </a>
          <Link
            to="/summon"
            className="ml-2 rounded-lg border border-turquesa/50 bg-turquesa/10 px-3 py-2 font-medium text-turquesa-light hover:bg-turquesa/20"
          >
            Summon
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-noche-deep">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-soft">
            Every repository leaves a ghost behind. Open-source AI for software archaeology.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-soft">
          <Link to="/summon" className="hover:text-hueso">
            Summon a repository
          </Link>
          <Link to="/r/ghost/lantern" className="hover:text-hueso">
            Example archive
          </Link>
          <Link to="/states" className="hover:text-hueso">
            System states
          </Link>
        </div>
      </div>
    </footer>
  )
}
