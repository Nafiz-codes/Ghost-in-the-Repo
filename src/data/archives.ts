import { lantern } from "./lantern"
import type { Investigation } from "./types"

const archives: Record<string, Investigation> = {
  [`${lantern.owner}/${lantern.name}`]: lantern,
}

export function getArchive(owner?: string, name?: string): Investigation | undefined {
  if (!owner || !name) return undefined
  return archives[`${owner}/${name}`.toLowerCase()]
}

export const examples = [
  {
    owner: "ghost",
    name: "lantern",
    description: "Durable background jobs for Node.js, backed by Redis.",
    language: "TypeScript",
    lastCommit: "3 years ago",
    fullArchive: true,
  },
  {
    owner: "request",
    name: "request",
    description: "The classic Node.js HTTP client, deprecated in 2020.",
    language: "JavaScript",
    lastCommit: "Live from GitHub",
    fullArchive: false,
  },
  {
    owner: "moment",
    name: "moment",
    description: "Date library now in maintenance mode.",
    language: "JavaScript",
    lastCommit: "Live from GitHub",
    fullArchive: false,
  },
]
