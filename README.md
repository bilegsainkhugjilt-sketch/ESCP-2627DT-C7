# VoltLane — electric-first planning for mixed truck fleets

**ESCP Business School · Bachelor in Management · Digital Transformation (Dr. David M. Lehmann) · Berlin, 2026**
**Team (Group C7):** Bilegsain Khugjilt · Noélie Girardot Chaffard · Minghongyu (Echo) Li · Angilbert · Yasha · Zack

VoltLane is a prototype web app for **dispatchers at trucking companies that run diesel and electric trucks side by side**. It predicts how far each electric truck can safely go, proposes which jobs should go electric and explains why, and fits charging around the depot and drivers' legal breaks. The dispatcher always approves or changes the plan.

> **Prototype only.** All trucks, jobs, chargers, drivers and figures are fictional. The app makes **no external API calls** and uses **no real data**. The "AI" is a transparent rules engine, not a trained model.

---

## Project documents

| File | What it contains |
|---|---|
| [`evidence.md`](evidence.md) | Key insights from (desk) user research, with 29 evidence items and sources |
| [`product.md`](product.md) | Product Requirements Document: 1 Strategy · 2 Scope · 3 Structure · 4 Skeleton |
| [`design.md`](design.md) | Design system: principles, tokens, components, Storybook plan, accessibility |
| [`architecture.md`](architecture.md) | Technology stack, data model, rules engine, demo plan |
| [`CLAUDE.md`](CLAUDE.md) | Instructions for the AI coding agent (Claude Code) that builds the prototype |
| [Figma wireframes](https://www.figma.com/design/rUYDqDUAa8etl3w6t6hFu9) | Low-fidelity wireframes of screens A1–A5 |

---

## Run the prototype

**Requirements:** [Node.js](https://nodejs.org) 20 or newer (LTS) and npm. Tested with Node 22.

```bash
git clone https://github.com/bilegsainkhugjilt-sketch/ESCP-2627DT-C7.git
cd ESCP-2627DT-C7
npm install          # install dependencies (about 1 minute)
npm run dev          # start the app, then open the address shown (usually http://localhost:5173)
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the app locally |
| `npm test` | Runs the 12 Vitest tests for the planning rules (`src/logic/__tests__`) |
| `npm run storybook` | Opens the component library / design system at http://localhost:6006 |
| `npm run build` | Type-checks and builds a static version into `dist/` |
| `npm run build-storybook` | Builds a static Storybook into `storybook-static/` |

The app keeps your plan in the browser (`localStorage`). **Reset demo** (top right) restores the starting data.

---

## Demo script (about 3 minutes)

1. **Fleet:** 8 fictional trucks (5 electric from 2 brands, 3 diesel) with battery level, the 15% safety reserve and approximate range.
2. **Jobs:** 8 fictional jobs, longest first or earliest first. Click **Generate plan**.
3. **Daily plan, the dispatch board:** one lane per truck. VoltLane proposes **7 of 8 jobs on electric trucks**. Proposed jobs are *hatched* (pencilled in); on each electric lane a line shows the battery through the day against the dashed reserve. Click a job on the board to jump to its explanation, e.g. *"E-03 can do this: needs 182 kWh, has 236 kWh above the 15% reserve, so it arrives with 28% left."* The 330 km job J-07 goes to a diesel, with the reason.
4. **Approve** J-01 and J-04: their blocks turn solid ("inked") and move to *Approved*.
5. **Reassign J-08 to E-03:** the dialog warns that E-03 would end below its reserve and asks you to confirm (*Assign anyway*). Trucks that cannot take the job are disabled with the reason.
6. **Test a disruption → Charger outage:** jobs that relied on a break charge are re-planned to diesel; approved jobs that still work stay approved. Also try **Cold day, −5 °C** and **Road closure on J-01**.
7. **Charging:** depot charging after the last job; public charging only inside the 45-minute break. E-05's break charge ends after the driver's shift, so it is flagged with a cheaper depot alternative.
8. **Weekly report:** one sentence with the electric share of the week, three supporting figures, and each e-truck's battery use (E-02 and E-04 under-used with the starting data).

---

## Code structure

```text
src/
  types/domain.ts          data model (architecture.md §5)
  data/                    fictional seed data, one past week, constants with evidence IDs
  logic/                   range estimator, planner + re-planner, charging, KPIs (+ tests)
  state/store.ts           app state, localStorage, Reset demo
  components/              PlanBoard, RecommendationCard (decision rows + EnergyBar), ReassignDialog, Navigation, TopBar, basics (+ *.stories.tsx)
  pages/                   A1 FleetOverview, A2 Jobs, A3 DailyPlan (dispatch board), A4 Charging, A5 WeeklyReport
  styles/                  tokens.css (from design.md) + app.css
```

Requirement IDs from `product.md` (US-xx, FR-xx, NFR-xx) are referenced in code comments and commit messages.

---

## Assumptions in the rules engine

- Energy needed = distance × truck efficiency (kWh/km) × weather factor × load factor (1 + 0.2 × load ÷ capacity).
- Every e-truck keeps a **15% safety reserve**; a job is feasible only if the truck arrives above it.
- A 45-minute break charge adds charger power × 0.75 h (120 kW public charger → 90 kWh); at most one per truck per day.
- Weather factor: 1.00 above 8 °C, 1.05 at 1–8 °C, 1.12 at −4–0 °C, 1.18 at −5 °C and below.
- A truck can do several jobs a day if their time windows are at least 30 min apart; energy is used in driving order.
- Diesel cost comparison (assumption, not from evidence.md): 27 L/100 km over 18 t, 18 L/100 km for 7.5–12 t, 1.45 €/L.
- Toll saved uses the German rate for the truck's weight class (34.8 ct/km over 18 t, 17.8 ct/km for 7.5–12 t); e-trucks are toll-free until 30 June 2031.
- Energy prices: depot 0.24 €/kWh, public 0.49 €/kWh.

These are simplifications for a demo, **not a validated range model**. Sources for the numbers are in `evidence.md`.

---

## How we used AI

- **Research and documents:** drafted with Claude and checked by the team against the cited sources.
- **Wireframes:** generated in Figma through Claude's Figma connection, then reviewed by the team.
- **Prototype:** built with **Claude Code** (agentic coding) from the briefing documents above; every step is committed with the requirement IDs it implements.
