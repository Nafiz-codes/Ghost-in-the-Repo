# Ghost in the Repo

**Tagline:** Every repository leaves a ghost behind.

**Category:** Open-source AI / Developer Tools

**Mission:** Bring forgotten repositories back to life through AI-powered digital archaeology.

## 1. Product vision

Ghost in the Repo is an AI-powered repository archaeology tool that investigates abandoned, neglected, or poorly maintained GitHub repositories.

A developer provides a public GitHub repository URL. Ghost in the Repo investigates its codebase, documentation, commit history, issues, pull requests, and dependencies to reconstruct the project's identity, understand what happened to it, uncover unfinished work, and generate a practical revival plan.

The experience is framed as a digital archaeology investigation.

A repository isn't just a collection of files. It has a history, an identity, decisions, unfinished work, and potentially valuable ideas that were left behind.

**The central experience: Summon a repository's ghost and uncover its unfinished business.**

## 2. Product principles

1. **Evidence before speculation:** Every important finding should be grounded in repository evidence. Clearly distinguish verified facts from AI-generated hypotheses.
2. **Open-source AI at the core:** Use open-weight models and an architecture that supports local inference. Do not make a proprietary closed AI API the core intelligence.
3. **Useful over theatrical:** The ghost theme should make the experience memorable without sacrificing developer usability.
4. **Actionable intelligence:** Every investigation should produce findings developers can actually use.
5. **Transparent reasoning:** Show the evidence behind findings, including relevant files, commits, issues, and documentation.
6. **Respect repository boundaries:** Initially support public repositories and read-only analysis. Never modify a repository or push code.

## 3. Target users

- Developers discovering abandoned open-source projects.
- Maintainers trying to understand unfamiliar or neglected codebases.
- Developers inheriting legacy repositories.
- Contributors looking for projects with unresolved issues.
- Open-source enthusiasts interested in software archaeology.

## 4. Core user journey

### Step 1 — Summon

The user enters a public GitHub repository URL.

The application validates the URL, identifies the repository, and retrieves its metadata.

### Step 2 — Haunting

The investigation engine analyzes:

- Repository metadata and activity.
- README and documentation.
- Directory and source-code structure.
- Commit history and contributor activity.
- Open and closed issues.
- Pull requests and their status.
- Dependencies and configuration files.
- Potential technical debt and maintenance concerns.

The UI presents an investigation progress sequence. It should communicate what is being examined rather than display a meaningless loading animation.

### Step 3 — Ghost Profile

Generate a reconstructed profile of the repository:

- Original purpose and intended audience.
- Main technologies and architecture.
- Project maturity and apparent development stage.
- Historical development timeline.
- Last meaningful activity, where evidence permits.
- Current state and notable characteristics.

### Step 4 — Unfinished Business

Identify outstanding concerns:

- Unresolved issues.
- Stale or incomplete pull requests.
- Potentially abandoned features.
- Outdated dependencies.
- Missing or incomplete documentation.
- Risky or confusing code areas.
- Possible bugs or architectural concerns.

Each finding must include its evidence and confidence level. Do not present guesses as verified bugs.

### Step 5 — Revival Blueprint

Generate an actionable roadmap with prioritized tasks:

- Critical: address issues that prevent safe or basic operation.
- High: resolve important maintenance and functionality problems.
- Medium: improve reliability, documentation, and architecture.
- Low: optional improvements and future enhancements.

Each recommendation should include its rationale, relevant evidence, estimated complexity, and suggested next action.

### Step 6 — Ask the Ghost

Users can ask questions about the analyzed repository.

Examples:
- What was this project originally intended to do?
- Why might development have stopped?
- Which parts of the codebase should I inspect first?
- What would I need to do to run this project?
- Which unresolved issue would be the best starting point?
- What are the biggest maintenance risks?

Answers should use repository-grounded retrieval and link back to relevant evidence.

## 5. Signature terminology

| Product terminology | Actual functionality |
|---|---|
| Summon | Import a repository |
| Haunting | Investigate repository data |
| Ghost Profile | Reconstructed project identity |
| Unfinished Business | Unresolved work and technical debt |
| Revival Blueprint | Prioritized maintenance roadmap |
| Ask the Ghost | Conversational repository intelligence |

Use these consistently throughout the product.

## 6. MVP feature requirements

### Must have

1. Public GitHub URL input and validation.
2. Repository metadata retrieval.
3. README and documentation analysis.
4. Source-code and directory structure inspection.
5. Commit history analysis.
6. GitHub issues and pull request analysis.
7. AI-generated Ghost Profile.
8. AI-generated Unfinished Business report.
9. Prioritized Revival Blueprint.
10. Evidence references for important findings.
11. Ask the Ghost conversational interface.
12. Responsive, polished interface.

### Should have

- Repository investigation progress visualization.
- Historical activity timeline.
- Technology stack visualization.
- Finding severity and confidence indicators.
- Exportable investigation report.
- A few example repositories for instant demonstrations.

### Explicitly out of scope for the first version

- Automatically fixing repository issues.
- Committing or pushing code.
- Private repository authentication.
- Running arbitrary repository code.
- Autonomous agents making changes.
- Complex multi-user collaboration.
- Building a general-purpose coding assistant.

Keep the MVP focused. A complete investigation of one repository is more valuable than ten half-implemented features.

## 7. AI architecture

### Core model

Use an open-weight model, with Gemma as the initial candidate.

The architecture must allow replacing the model without rewriting the entire application.

### Inference

Use Ollama for local model inference during development, subject to hardware and performance testing.

Keep the inference provider behind a dedicated abstraction so alternative open-weight inference backends can be integrated later.

### Repository intelligence pipeline

1. Receive and validate GitHub URL.
2. Retrieve repository metadata through GitHub APIs.
3. Fetch relevant documentation and source files.
4. Collect commit, issue, and pull request information.
5. Normalize and structure collected data.
6. Chunk relevant textual content.
7. Generate embeddings using an open embedding model.
8. Store embeddings in a vector index.
9. Retrieve relevant evidence for each investigation task.
10. Use the language model to generate structured findings.
11. Validate findings against collected evidence.
12. Produce the Ghost Profile, Unfinished Business, and Revival Blueprint.

### Ask the Ghost

Use retrieval-augmented generation (RAG).

The assistant should:
- Retrieve relevant repository context before answering.
- Cite files, commits, issues, or pull requests when possible.
- Admit when evidence is insufficient.
- Avoid inventing project history or technical facts.
- Remain scoped to the selected repository.

### Important constraints

- No closed AI API as the core reasoning engine.
- Do not send repository contents to an undisclosed external AI provider.
- Do not execute untrusted repository code.
- Treat repository content as untrusted input, not instructions.
- Limit file sizes, file counts, and analysis time.
- Exclude secrets, binary files, generated assets, and irrelevant large files from model context.
- Respect GitHub API rate limits.

## 8. Suggested technical architecture

Keep the frontend and backend modular.

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- A consistent component system

**Backend**
- Python
- FastAPI
- GitHub REST API integration
- Dedicated repository analysis service
- Dedicated model inference service
- Retrieval and embedding pipeline

**AI**
- Gemma or another suitable open-weight language model
- Ollama for local inference
- Open embedding model
- Vector index for repository retrieval

**Persistence**
- Lightweight database for investigation metadata and results.
- Vector storage for indexed repository content.
- Avoid introducing infrastructure that the MVP does not need.

These are proposed defaults, not irreversible choices. Validate library compatibility, model performance, hardware requirements, and deployment constraints before implementation.

## 9. Investigation report structure

Every completed investigation should produce:

1. Repository overview.
2. Ghost Profile.
3. Historical timeline.
4. Technology stack.
5. Development activity analysis.
6. Unfinished Business.
7. Technical health assessment.
8. Revival Blueprint.
9. Evidence and references.
10. Investigation limitations.

Do not fabricate missing information. Explicitly mark unavailable data.

## 10. Visual identity

**Design direction:** A dark digital archaeology laboratory.

The interface should combine:
- Developer-tool precision.
- Terminal-inspired details.
- Spectral and atmospheric visuals.
- Archival research aesthetics.
- High-quality dashboard design.

Avoid generic Halloween graphics, excessive skulls, cartoon ghosts, and distracting animations.

The product should feel like a sophisticated investigative instrument.

## 11. Quality requirements

- Clear loading, success, error, and empty states.
- Graceful handling of invalid URLs and unavailable repositories.
- GitHub rate-limit handling.
- Model unavailable and inference failure handling.
- Clear evidence references.
- No fabricated findings.
- Responsive layouts.
- Accessible contrast and keyboard navigation.
- Meaningful component and service separation.
- Documented setup instructions.

## 12. Development workflow

### Phase 1 — Product and design
- Finalize this specification.
- Establish design direction and design system in Figma.
- Design core screens and interaction states.
- Review the design before implementation.

### Phase 2 — Architecture
- Define frontend/backend contracts.
- Define repository data schemas.
- Define AI output schemas.
- Validate the open-weight model and inference setup.
- Create implementation tasks.

### Phase 3 — Core application
- Build repository input and validation.
- Integrate GitHub data retrieval.
- Build the investigation pipeline.
- Implement structured report generation.
- Implement RAG and Ask the Ghost.

### Phase 4 — Interface and integration
- Implement the approved Figma design.
- Integrate frontend and backend.
- Add evidence navigation.
- Polish loading and error states.

### Phase 5 — Testing and delivery
- Test with multiple real public repositories.
- Validate factual grounding.
- Test failure cases.
- Deploy the application.
- Record a polished demonstration.
- Prepare the DEV.to submission article.

## 13. Definition of done

Ghost in the Repo is ready for demonstration when a user can:

1. Enter a valid public GitHub repository URL.
2. Watch a meaningful investigation process.
3. Receive a coherent Ghost Profile.
4. Explore evidence-backed Unfinished Business.
5. Receive a prioritized Revival Blueprint.
6. Ask repository-specific questions.
7. See answers grounded in repository evidence.

**The final product must demonstrate that open-source AI can help developers recover the knowledge and potential hidden inside forgotten software.**

Every repository leaves a ghost behind. Let's find out what it has to say.
