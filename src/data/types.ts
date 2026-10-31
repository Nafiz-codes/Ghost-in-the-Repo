export type Severity = "critical" | "high" | "medium" | "low"
export type Confidence = "verified" | "likely" | "hypothesis"
export type EvidenceKind = "file" | "commit" | "issue" | "pr" | "release"

export interface Evidence {
  kind: EvidenceKind
  ref: string
  title: string
  excerpt?: string
  meta?: string
}

export interface Claim {
  label: string
  text: string
  confidence: Confidence
  evidence: Evidence[]
}

export interface TimelineEvent {
  date: string
  title: string
  detail: string
  kind: "origin" | "release" | "peak" | "contributors" | "last" | "silence"
  evidence: Evidence[]
}

export interface Finding {
  id: string
  severity: Severity
  confidence: Confidence
  category: string
  title: string
  explanation: string
  nextAction: string
  evidence: Evidence[]
}

export interface RevivalTask {
  id: string
  priority: Severity
  title: string
  rationale: string
  complexity: "S" | "M" | "L"
  nextAction: string
  evidence: Evidence[]
}

export interface HealthCheck {
  label: string
  status: "good" | "warning" | "critical" | "unknown"
  summary: string
  detail: string
}

export interface ActivityPoint {
  period: string
  commits: number
}

export interface Investigation {
  owner: string
  name: string
  description: string
  language: string
  license: string
  stars: number
  forks: number
  createdAt: string
  lastActivity: string
  lastActivityRelative: string
  defaultBranch: string
  stats: {
    commitsAnalyzed: number
    commitsTotal: number
    contributors: number
    openIssues: number
    openPullRequests: number
    filesExamined: number
    indexedChunks: number
    discussions: number
  }
  stack: { name: string; role: string; version?: string; outdated?: boolean }[]
  profile: {
    summary: string
    claims: Claim[]
    lifecycle: { stage: string; text: string; confidence: Confidence }[]
  }
  timeline: TimelineEvent[]
  activity: ActivityPoint[]
  health: HealthCheck[]
  findings: Finding[]
  blueprint: RevivalTask[]
  limitations: string[]
}
