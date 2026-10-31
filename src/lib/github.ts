export interface RepoRef {
  owner: string
  name: string
}

export interface RepoPreview extends RepoRef {
  description: string | null
  language: string | null
  stars: number
  pushedAt: string
  archived: boolean
}

const NAME = /^[A-Za-z0-9_.-]+$/

export function parseRepoUrl(input: string): RepoRef | null {
  const raw = input.trim().replace(/\.git$/, "").replace(/\/+$/, "")
  if (!raw) return null
  const short = raw.match(/^([^/\s]+)\/([^/\s]+)$/)
  if (short && !raw.includes(":")) {
    return NAME.test(short[1]) && NAME.test(short[2]) ? { owner: short[1], name: short[2] } : null
  }
  let url: URL
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`)
  } catch {
    return null
  }
  if (!/^(www\.)?github\.com$/i.test(url.hostname)) return null
  const [owner, name] = url.pathname.split("/").filter(Boolean)
  if (!owner || !name || !NAME.test(owner) || !NAME.test(name)) return null
  return { owner, name }
}

export type PreviewResult =
  | { status: "found"; repo: RepoPreview }
  | { status: "not-found" }
  | { status: "rate-limited"; resetAt: Date | null }
  | { status: "error"; message: string }

export async function fetchRepoPreview(ref: RepoRef, signal?: AbortSignal): Promise<PreviewResult> {
  try {
    const res = await fetch(`/api/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.name)}/preview`, { signal })
    const data = await res.json()
    if (!res.ok) return { status: "error", message: data.detail ?? `Preview failed (${res.status}).` }
    if (data.status === "rate-limited") return { status: "rate-limited", resetAt: data.resetAt ? new Date(data.resetAt) : null }
    return data as PreviewResult
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err
    return { status: "error", message: "Couldn't reach GitHub. Check your connection and try again." }
  }
}

export function timeAgo(iso: string) {
  const years = (Date.now() - new Date(iso).getTime()) / (365.25 * 24 * 3600 * 1000)
  if (years >= 1) return `${Math.floor(years)} year${years >= 2 ? "s" : ""} ago`
  const months = Math.floor(years * 12)
  if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`
  return "this month"
}
