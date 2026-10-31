import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GithubMark } from "@/components/decor"
import { parseRepoUrl } from "@/lib/github"
import { cn } from "@/lib/utils"

export function RepoInput({ className, size = "lg" }: { className?: string; size?: "lg" | "default" }) {
  const navigate = useNavigate()
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!value.trim()) {
      setError("Paste a public GitHub repository URL to begin.")
      return
    }
    const ref = parseRepoUrl(value)
    if (!ref) {
      setError("That doesn't look like a GitHub repository. Try github.com/owner/name.")
      return
    }
    navigate(`/summon?repo=${encodeURIComponent(`${ref.owner}/${ref.name}`)}`)
  }

  return (
    <form onSubmit={submit} noValidate className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl border bg-surface p-2 shadow-[0_18px_48px_rgb(8_2_19/0.45)] transition-colors focus-within:border-turquesa sm:flex-row sm:items-center",
          error ? "border-critical/70" : "border-line",
        )}
      >
        <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
          <GithubMark className="size-5 flex-none text-soft" />
          <span className="sr-only">GitHub repository URL</span>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(null)
            }}
            placeholder="https://github.com/owner/repository"
            aria-invalid={!!error}
            aria-describedby={error ? "repo-input-error" : undefined}
            className={cn(
              "w-full min-w-0 bg-transparent font-mono text-hueso outline-none placeholder:text-soft/70",
              size === "lg" ? "h-12 text-base" : "h-10 text-sm",
            )}
          />
        </label>
        <Button type="submit" size={size} className="sm:flex-none">
          Summon Repository <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
      {error && (
        <p id="repo-input-error" role="alert" className="mt-2 px-2 text-sm text-[#ff8a94]">
          {error}
        </p>
      )}
    </form>
  )
}
