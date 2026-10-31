import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Calavera } from "@/components/decor"
import { Eyebrow } from "@/components/common"
import { SiteHeader } from "@/components/site-chrome"

export default function NotFound({ repo }: { repo?: string }) {
  return (
    <div className="min-h-svh bg-noche-deep">
      <SiteHeader />
      <main id="main" className="dot-grid flex flex-col items-center px-5 py-12 text-center">
        <Calavera variant="resting" className="mb-6 w-full max-w-md" />
        <Eyebrow className="mt-2">{repo ? "No archive found" : "Page not found"}</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-bold">This ghost hasn't been summoned.</h1>
        <p className="mt-3 max-w-md text-soft">
          {repo ? (
            <>
              There's no investigation for <code className="font-mono text-hueso">{repo}</code> yet.
            </>
          ) : (
            "The page you're looking for doesn't exist."
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/summon">Summon a repository</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-line">
            <Link to="/r/ghost/lantern">Open the example</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
