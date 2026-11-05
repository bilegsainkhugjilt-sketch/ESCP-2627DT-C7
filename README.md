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

**Requirements:** [Node.js](https://nodejs.org) 20 or newer (LTS) and npm.

```bash
git clone <this repository's URL>
cd <repository folder>
npm install          # install dependencies
npm run dev          # start the app, then open the local address shown (usually http://localhost:5173)
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the app locally |
| `npm test` | Runs the Vitest tests for the planning rules |
| `npm run storybook` | Opens the component library (design system) |
| `npm run build` | Builds a static version into `dist/` |

*Status: the prototype is being built with Claude Code. This section will be checked and updated once the app runs.*

---

## Demo script (about 3 minutes)

1. **Fleet (A1):** 8 trucks, 5 electric across 2 brands, 3 diesel, with battery level and predicted range.
2. **Jobs (A2):** today's 8 fictional jobs → click **Generate plan**.
3. **Daily plan (A3):** suggestions have a dashed border and explain why each truck fits. Approve one; reassign another to an e-truck that is too weak and see the warning.
4. **Simulate a disruption** (delay, charger outage or a cold day): VoltLane drafts a revised plan that again needs approval.
5. **Charging (A4):** depot charging first; public charging only inside the 45-minute driver break.
6. **Weekly report (A5):** electric km driven vs possible, estimated toll and energy savings.
7. **Reset demo** (top right) restores the starting data.

---

## Assumptions in the rules engine

- Energy needed = distance × truck efficiency (kWh/km) × weather factor × load factor (1 + 0.2 × load ÷ capacity).
- Every e-truck keeps a **15% safety reserve**; a job is feasible only if the truck arrives above it.
- A 45-minute break charge adds charger power × 0.75 h (e.g. 120 kW → 90 kWh).
- Toll saved uses the German rate for the truck's weight class (34.8 ct/km over 18 t, 17.8 ct/km for 7.5–12 t); e-trucks are toll-free until 30 June 2031.
- Energy prices: depot 0.24 €/kWh, public 0.49 €/kWh.

These are simplifications for a demo, **not a validated range model**. Sources for the numbers are in `evidence.md`.

---

## How we used AI

- **Research and documents:** drafted with Claude and checked by the team against the cited sources.
- **Wireframes:** generated in Figma through Claude's Figma connection, then reviewed by the team.
- **Prototype:** built with **Claude Code** (agentic coding) from the briefing documents above; every step is committed with the requirement IDs it implements.
