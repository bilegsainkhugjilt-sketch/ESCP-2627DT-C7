# CLAUDE.md — instructions for the coding agent

You are building **VoltLane**, a desktop-first web prototype for an ESCP Digital Transformation course.

## Source of truth (read these first, in this order)
1. `product.md` — what to build: user needs (UN-xx), user stories (US-xx), functional (FR-xx) and non-functional (NFR-xx) requirements, screens A1–A5, user flow and data model
2. `architecture.md` — how to build it: stack, folder structure, data model, rules engine, KPI constants, demo plan
3. `design.md` — design tokens and components (Storybook)
4. `evidence.md` — background only; do not change it

If these files disagree, `product.md` wins for *what*, `architecture.md` wins for *how*. If something is unclear, ask instead of guessing.

## Hard rules
- **No external APIs, no network calls, no real data.** All data is fictional and lives in `src/data/`.
- No maps or map tiles (they need external services). Show routes as lists or timelines.
- The "AI" is the transparent rules engine in `src/logic/` (architecture.md §7). Do not add a language model to the app.
- The system only **proposes**; the dispatcher **approves**. Proposed and approved assignments must always look different (NFR-05, NFR-07).
- Every proposal shows a one-sentence explanation (FR-09, FR-10).
- Use the tokens in `src/styles/tokens.css`; no hard-coded colours.
- Accessibility: keyboard-operable controls, labels on inputs, WCAG AA contrast, never colour alone for status.

## Stack
React + TypeScript + Vite · plain CSS with custom properties · Storybook (`@storybook/react-vite`) · Vitest for `src/logic/` · `localStorage` with a Reset demo button.

## Way of working
- Work in small steps. After each step: run `npm run build` (and `npm test` once tests exist), fix errors, then **commit with a clear message that names the requirement IDs**, e.g. `feat(A3): proposal cards with explanations (FR-09, FR-10)`.
- Reference requirement IDs in code comments where a function implements one.
- Keep `README.md` up to date: install, run, test, Storybook, reset demo, and the list of assumptions used in the rules engine.
- Do not edit `evidence.md`, `product.md`, `architecture.md` or `design.md` unless asked.
