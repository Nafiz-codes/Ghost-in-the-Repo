# Ghost in the Repo

**Every repository leaves a ghost behind.**

Ghost in the Repo is an open-source AI tool for software archaeology. Give it a public GitHub repository and it reconstructs the project's identity, finds its unfinished business, and builds a prioritized plan to revive it.

The frontend includes a fictional demonstration (`ghost/lantern`). The FastAPI backend now investigates public GitHub repositories and uses a Gemma model through the Google Gemini API for evidence-linked reports and answers.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:4317.

In a second terminal, start the API (Python 3.11+):

```bash
python -m venv .venv
# Activate .venv for your shell, then:
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
# Edit backend/.env: set GEMINI_API_KEY and GEMMA_MODEL to your available Gemma model ID.
uvicorn backend.app:app --reload --port 8000
```

On PowerShell, use `Copy-Item backend/.env.example backend/.env` and activate with `.venv\Scripts\Activate.ps1`. The API key stays on the server. `GITHUB_TOKEN` is optional but raises GitHub's rate limit. Check `http://localhost:8000/api/health` to confirm configuration. The Vite dev server proxies `/api` to port 8000.

```bash
npm run build     # type-check and production build into dist/
npm run preview   # serve the production build on port 4317
npm run lint      # oxlint
```

## What's in the app

| Route | Screen |
| --- | --- |
| `/` | Landing page: hero, repository input, examples, how it works, open-source positioning |
| `/summon` | Summon: URL validation and repository preview (checks real repositories against the GitHub API) |
| `/haunting/:owner/:repo` | Haunting: the investigation trail and live log |
| `/r/:owner/:repo` | Investigation dashboard |
| `/r/:owner/:repo/profile` | Ghost Profile with confidence badges and evidence |
| `/r/:owner/:repo/timeline` | Timeline of the project's life |
| `/r/:owner/:repo/business` | Unfinished Business with filters, sorting, and the evidence panel |
| `/r/:owner/:repo/blueprint` | Revival Blueprint checklist with Markdown export |
| `/r/:owner/:repo/ask` | Ask the Ghost |
| `/states/:state` | System states: `rate-limit`, `ollama`, `evidence` |

The main flow is linked end to end: Landing → Summon → Haunting → Dashboard → each section in the sidebar.

### What's real and what's example data

- **Real:** URL validation, GitHub preview, bounded GitHub data collection, Gemma report generation, SQLite report persistence, and repository-grounded questions.
- **Example data:** The fictional `ghost/lantern` investigation lives in `src/data/lantern.ts` and remains available without the backend.
- **Ask the Ghost:** Live repositories use Gemma with retrieved source context; the fictional example uses its fixed answer set.

Live investigations sample up to 100 recent commits, issues, and pull requests, plus 45 small source files. Reports explicitly state these limits. Repository code is never executed. Source content is sent to the configured Google Gemini API; use a local inference endpoint if external processing is unsuitable. No key is bundled with the frontend.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4 and shadcn/ui (Radix) for primitives
- React Router
- Fonts: Fraunces (display), Inter (UI), JetBrains Mono (technical metadata)

## Design system

Colors are defined as tokens in `src/index.css`:

| Token | Hex | Use |
| --- | --- | --- |
| Noche | `#1E0B36` | Main background |
| Surface / Elevated | `#2A1450` / `#36205F` | Cards and panels |
| Rosa Mexicano | `#E6007E` | Primary actions |
| Turquesa | `#00B3B3` | Links, evidence, active navigation, focus rings |
| Cempasúchil | `#FF8C00` | Progress, marigolds, High severity |
| Marigold Gold | `#FFC20E` | Highlights, Medium severity |
| Hueso | `#FFF4E0` | Main text |
| Critical | `#FF4F5E` | Critical severity |

Decorative elements live in `src/components/decor.tsx`: papel picado banners, marigolds, candles, and the painted calavera artwork in `public/art/`.

## Project structure

```
src/
  components/     app shell, decor, evidence panel, shared badges, shadcn/ui primitives
  data/           types and the example investigation
  lib/            GitHub URL parsing and preview fetch
  pages/          one file per screen
public/art/       calavera artwork and app icon
```
