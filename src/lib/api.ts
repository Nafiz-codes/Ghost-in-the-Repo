import type { Investigation } from "@/data/types"

export interface Job {
  status: "running" | "complete" | "error"
  stage: string
  log: string[]
  error?: string
  report?: Investigation
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, init)
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.detail || `API error ${response.status}`)
  return body as T
}

const path = (owner: string, repo: string) => `/investigations/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
export const getJob = (owner: string, repo: string) => request<Job>(path(owner, repo))
export const startJob = (owner: string, repo: string) => request<Job>(path(owner, repo), { method: "POST" })
export const askGhost = (owner: string, repo: string, question: string) => request<{ grounded: boolean; paragraphs: string[]; sources: import("@/data/types").Evidence[] }>(`${path(owner, repo)}/ask`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) })
