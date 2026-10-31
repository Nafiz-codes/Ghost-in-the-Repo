# Ghost in the Repo — Figma Design Brief

## 1. Creative direction

Design a premium developer tool called **Ghost in the Repo**.

Tagline: **Every repository leaves a ghost behind.**

The product is a digital archaeology laboratory that investigates forgotten GitHub repositories using open-source AI.

The interface should feel like a combination of:
- A sophisticated developer dashboard.
- A digital forensic investigation workstation.
- An archival research laboratory.
- A mysterious, atmospheric digital environment.

The visual identity must be distinctive, polished, and functional.

Do not make it look like a Halloween landing page.

## 2. Visual mood

**Primary aesthetic:** Dark, cinematic, technical, atmospheric.

Suggested visual elements:
- Near-black and deep charcoal backgrounds.
- Muted indigo and violet surfaces.
- Spectral cyan accents.
- Restrained lavender highlights.
- Subtle grain, scanlines, and atmospheric gradients.
- Thin borders and carefully layered panels.
- Monospaced typography for technical metadata.
- Clean modern sans-serif typography for primary interface content.

Avoid:
- Bright orange Halloween palettes.
- Cartoon ghosts.
- Excessive skulls or horror imagery.
- Overuse of neon.
- Generic AI gradients.
- Excessive glassmorphism.
- Visual effects that reduce readability.

## 3. Initial color system

Treat these as starting tokens; refine contrast and accessibility in Figma.

| Token | Suggested value | Usage |
|---|---|---|
| Background | #090A12 | Main application background |
| Surface | #111421 | Main cards |
| Elevated surface | #191D2C | Dialogs and secondary panels |
| Primary accent | #8B7CFF | Primary actions |
| Spectral accent | #6DE0D0 | Investigation highlights |
| Secondary accent | #B69CFF | Ghost-related visual details |
| Main text | #F0F1F7 | Primary text |
| Muted text | #9298AC | Secondary text |
| Border | #292D40 | Dividers and card borders |
| Warning | #E9B86C | Warnings |
| Critical | #F07889 | Critical findings |
| Success | #79D6A5 | Successful operations |

Do not use every accent everywhere. The design should remain restrained.

## 4. Typography

Suggested pairing:

- **Primary:** Inter or Geist Sans.
- **Technical:** JetBrains Mono.

Typography hierarchy:
- Large editorial hero heading.
- Medium-weight section titles.
- Clear card titles.
- Compact metadata labels.
- Monospaced repository names, hashes, timestamps, and technical identifiers.

Use typography to establish hierarchy rather than relying on glowing effects.

## 5. Logo and visual symbol

Explore a minimal symbol combining:
- A ghost silhouette.
- A repository/file structure.
- A terminal cursor or code bracket.

The logo should work as:
- A standalone application icon.
- A wordmark.
- A small sidebar icon.
- A favicon.

Avoid an overly literal cartoon ghost.

## 6. Screens to design

### Screen 1 — Landing page

Purpose: Explain the product and invite the user to investigate a repository.

Required elements:
- Logo and navigation.
- Hero headline: "Every repository leaves a ghost behind."
- Short explanation of the product.
- GitHub repository URL input.
- Primary CTA: "Summon Repository".
- Secondary CTA: "Explore an Example".
- A visually compelling Ghost Profile preview.
- A short three-step explanation: Summon → Haunting → Revival.
- Open-source AI positioning.
- Footer.

The hero should immediately communicate what the application does.

### Screen 2 — Summon / repository input

Purpose: Collect and validate the repository URL.

Required elements:
- Repository URL field.
- Example repository shortcut.
- Input validation state.
- Repository preview after successful validation.
- Repository name, owner, description, and primary language.
- Confirmation CTA to begin investigation.

### Screen 3 — Haunting / investigation progress

Purpose: Make the analysis process understandable and engaging.

Display investigation stages:
1. Repository identified.
2. Documentation examined.
3. Source structure mapped.
4. Commit history reconstructed.
5. Issues and pull requests inspected.
6. Technical health assessed.
7. Ghost Profile generated.

Use a vertical investigation timeline or structured progress panel.

Show meaningful progress information, not arbitrary percentages unless actual progress can be measured.

### Screen 4 — Investigation dashboard

Purpose: Provide a central overview of the repository.

Suggested layout:
- Left navigation/sidebar.
- Repository identity header.
- Investigation status.
- Summary metric cards.
- Ghost Profile preview.
- Development activity timeline.
- Technology stack.
- Unfinished Business summary.
- Revival Blueprint preview.
- Ask the Ghost entry point.

Possible summary cards:
- Commits analyzed.
- Contributors.
- Open issues.
- Files examined.
- Last activity.

Every number must come from actual repository data.

### Screen 5 — Ghost Profile

Purpose: Present the reconstructed identity and history of the repository.

Sections:
- Project identity.
- Original purpose.
- Intended audience.
- Technology stack.
- Architecture overview.
- Development timeline.
- Project lifecycle observations.
- Evidence references.

Make this screen feel like a digital archive.

### Screen 6 — Unfinished Business

Purpose: Show the repository's outstanding problems.

Include:
- Finding severity.
- Finding title.
- Explanation.
- Supporting evidence.
- Confidence level.
- Suggested next action.

Suggested severity levels:
- Critical.
- High.
- Medium.
- Low.

Include filtering and sorting.

Clicking a finding should expose its supporting evidence, such as a GitHub issue, file, commit, or pull request.

### Screen 7 — Revival Blueprint

Purpose: Turn investigation results into an actionable plan.

Organize recommendations into:
- Critical priorities.
- High priorities.
- Medium priorities.
- Future improvements.

Each task should show:
- Title.
- Rationale.
- Evidence.
- Estimated complexity.
- Suggested next action.

Make this screen practical enough that a developer could use it as a real maintenance checklist.

### Screen 8 — Ask the Ghost

Purpose: Enable repository-grounded conversation.

Include:
- Chat interface.
- Repository context indicator.
- Suggested questions.
- Evidence references in responses.
- Clear indication when the model lacks sufficient evidence.

Suggested starter questions:
- What was this project originally built to do?
- Why might development have stopped?
- What should I fix first?
- How can I run this project locally?

The chat should feel like consulting a repository's digital archive, not chatting with a generic chatbot.

## 7. Navigation

Suggested application navigation:

- Overview
- Ghost Profile
- Timeline
- Unfinished Business
- Revival Blueprint
- Ask the Ghost

Keep navigation simple and consistent.

## 8. Components to establish

Create reusable components for:

- Primary and secondary buttons.
- Repository URL input.
- Repository identity header.
- Metric cards.
- Status indicators.
- Severity badges.
- Evidence cards.
- Timeline events.
- Technology chips.
- Finding cards.
- Revival task cards.
- Chat messages.
- Source references.
- Progress stages.
- Empty states.
- Loading states.
- Error states.
- Modal and tooltip patterns.

Use Auto Layout and component variants wherever appropriate.

## 9. Interaction states

Design the following states:

- Empty repository input.
- Invalid GitHub URL.
- Repository not found.
- Repository successfully identified.
- Investigation in progress.
- Investigation completed.
- Partial investigation due to API limits.
- AI inference unavailable.
- No findings detected.
- Evidence unavailable.
- Ask the Ghost with no conversation.
- Ask the Ghost with conversation.
- Mobile navigation open.

## 10. Responsive requirements

Design desktop first, then adapt to tablet and mobile.

Desktop:
- Full dashboard layout.
- Sidebar navigation.
- Multi-column information cards.

Tablet:
- Compact navigation.
- Reduced columns.
- Readable timelines and evidence panels.

Mobile:
- Single-column layout.
- Collapsible navigation.
- Full-width repository input.
- Stacked cards.
- Usable chat interface.
- No horizontal overflow.

## 11. Figma deliverables

Organize the Figma file into these pages:

1. Cover & Product Vision
2. Design System
3. Components
4. Landing Page
5. Summon & Haunting
6. Investigation Dashboard
7. Ghost Profile
8. Unfinished Business
9. Revival Blueprint
10. Ask the Ghost
11. Responsive Layouts
12. Prototype & Interaction Flow

Include:
- Color and typography styles.
- Spacing system.
- Component variants.
- Auto Layout.
- Reusable design tokens.
- Desktop and mobile layouts.
- Prototype links for the main user journey.

## 12. Quality bar

The final design should look like a polished, credible developer product.

A developer should immediately understand:
1. What the tool does.
2. What repository they are investigating.
3. What the AI discovered.
4. Why each finding matters.
5. What they should do next.

The spooky atmosphere should enhance the product's identity, never obscure its usefulness.

**Design principle: Make software archaeology feel like uncovering a forgotten digital civilization.**
