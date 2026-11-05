# architecture.md — VoltLane

**Course:** ESCP Business School, Bachelor in Management: Digital Transformation (Dr. David M. Lehmann), Berlin campus
**Team:** Bilegsain Khugjilt · Noélie Girardot Chaffard · Minghongyu (Echo) Li · Angilbert · Yasha Berliner · Zack Stanton

> Technical architecture for the VoltLane prototype. All records are fictional. No external APIs and no real data, as required by the workshop. Requirement IDs (`UN-xx`, screens `A1–A5`) refer to `product.md`; evidence IDs (`E-xx`) refer to `evidence.md`.

## 1. Architectural objective
Build a functional, desktop-first web prototype in which a dispatcher can generate, inspect, approve, override and revise electric-first job assignments for a mixed diesel/electric fleet. Prioritise a demonstrable end-to-end workflow over production integrations.

## 2. Technology stack

| Layer | Choice | Reason |
|---|---|---|
| UI | React + TypeScript | Component-based, type-safe dashboard and forms |
| Build | Vite | Lightweight local development and build |
| Styling | Plain CSS with CSS custom properties (`tokens.css`) | Tokens defined once in `design.md` and reused by every component and Storybook story |
| Component library | **Storybook** (`@storybook/react-vite`) | **Required by the workshop:** `design.md` must include a design system with a storybook |
| Navigation | React Router (or a simple tab state) | Five screens, A1–A5 |
| State | React hooks (`useState`, `useMemo`, `useReducer`) | Enough for a single-user local prototype |
| Persistence | `localStorage`, with a **Reset demo** button | Approved plans survive a page refresh; reviewers can restore the start state |
| Data | Local TypeScript seed objects | Meets the no-real-data / no-API rule |
| Planning logic | Deterministic TypeScript functions | Repeatable, explainable simulated agent workflow |
| Testing | Vitest for `src/logic/` | Verifies feasibility and re-planning rules that AI coding tools generate |
| Deployment | Local browser (`npm run dev`); optional static build (`npm run build`) | No backend or cloud account needed |

## 3. Component architecture

```text
Dispatcher (browser)
        |
        v
React UI: A1 Fleet / A2 Jobs / A3 Daily Plan / A4 Charging / A5 Weekly Report
        |
        v
App state: trucks, jobs, chargers, drivers, assignments (proposed | approved | overridden), scenario
        |
        +--> Range estimator: usable energy vs. energy needed per job (+ safety reserve)
        |
        +--> Planner: rank jobs -> match to feasible e-trucks first -> diesel for the rest
        |               -> attach a plain-language explanation to every proposal
        |
        +--> Charging planner: depot first; public charging only inside a 45-min driver break
        |
        +--> Scenario engine: late order / delay / charger outage / cold weather -> draft revised plan
        |
        +--> KPI calculator: approved e-km, e-km share, e-km per truck, acceptance rate,
        |                    toll and energy savings (sourced constants)
        |
        v
Local seed data (fictional) + one week of fictional history for the report; no network calls
```

### Traceability: component → user need → screen

| Component | User need (product.md) | Screen |
|---|---|---|
| Range estimator | UN-01 safe range with confidence | A1, A3 |
| Planner | UN-02 one plan for the mixed fleet | A3 |
| RecommendationCard (explanation + override) | UN-03 understand and override | A3 |
| Charging planner | UN-04 charging in depot time and breaks | A4 |
| Scenario engine | UN-05 re-plan quickly | A3 |
| KPI calculator | UN-06 see whether e-trucks pay off | A5 |

## 4. Folder structure

```text
voltlane/
  README.md                 # how to install, run, test, open Storybook, reset the demo
  evidence.md
  product.md
  architecture.md
  design.md
  package.json
  .storybook/               # Storybook config
  src/
    main.tsx
    App.tsx
    data/seedData.ts         # trucks, jobs, chargers, drivers (fictional)
    data/seedHistory.ts      # one fictional past week, so the weekly report is not empty
    data/constants.ts        # toll rates, energy prices, with evidence IDs in comments
    types/domain.ts
    logic/range.ts
    logic/planner.ts
    logic/charging.ts
    logic/scenarios.ts
    logic/kpis.ts
    logic/__tests__/planner.test.ts
    components/Navigation.tsx
    components/StatusBadge.tsx
    components/RecommendationCard.tsx
    components/*.stories.tsx  # one story per component state (feasible, infeasible, overridden…)
    pages/FleetOverview.tsx   # A1
    pages/Jobs.tsx            # A2
    pages/DailyPlan.tsx       # A3
    pages/Charging.tsx        # A4
    pages/WeeklyReport.tsx    # A5
    styles/tokens.css
```

## 5. Data model (`types/domain.ts`)

| Entity | Key fields |
|---|---|
| Truck | id, name, **brand** (mixed brands is our differentiator), powertrain (`electric` / `diesel`), weightClass (`7.5-12t` / `12-18t` / `>18t`), batteryKWh, socPercent, reservePercent, efficiencyKWhPerKm, capacityKg, status, depotId |
| Job | id, customer (fictional), distanceKm, tollRoadKm, payloadKg, stops, windowStart, windowEnd |
| Charger | id, kind (`depot` / `public`), powerKw, pricePerKWh, available |
| Driver | id, name (fictional), shiftStart, shiftEnd, drivenMinToday, breakDueAfterMin (270 = 4.5 h) |
| Assignment | jobId, truckId, driverId, status (`proposed` / `approved` / `overridden`), explanation, reserveAfterPercent, **confidence** (`high` / `medium` / `low`), chargingStop?, overrideReason? |
| Scenario | temperatureC, weatherFactor, events (late order, delay, charger outage) |

**Confidence (UN-01):** derived from the battery left on arrival **above the safety reserve**: `high` if > 25 points, `medium` if 10–25 points, `low` if under 10 points. Shown as a text badge (not colour alone) on A1 and A3.

Seed values should stay realistic: heavy e-trucks use about **0.9–1.5 kWh/km** (E-10/ICCT: 92–150 kWh/100 km).

## 6. Data flow and user control
1. Load seed records (or the saved state from `localStorage`) into app state.
2. Dispatcher requests a plan.
3. Planner creates *proposed* assignments with feasibility checks and explanations.
4. UI shows proposals separately from approved assignments.
5. Dispatcher approves or overrides; only then is the approved state updated.
6. A simulated event triggers re-planning; the changes are proposals again and need confirmation.
7. KPI calculator works only from approved assignments and history; it never invents live results.

## 7. Rules engine (illustrative, not real routing)

```ts
// Energy needed: heavier loads and colder weather use more energy (simple assumption)
const loadRatio = job.payloadKg / truck.capacityKg;
const payloadFactor = 1 + 0.2 * loadRatio;                 // assumption, documented in README
const requiredEnergy = job.distanceKm * truck.efficiencyKWhPerKm
  * scenario.weatherFactor * payloadFactor;

// Energy available above the safety reserve
const usableEnergy = truck.batteryKWh
  * (truck.socPercent - truck.reservePercent) / 100;

// Optional top-up during the legal 45-min break (Reg. 561/2006, E-21):
// only at a free PUBLIC charger on the route (depot charging happens before/after the shift)
const breakTopUp = charger?.kind === 'public' && charger.available
  ? charger.powerKw * 0.75   // kWh delivered in 45 min (0.75 h)
  : 0;

const fitsDirectly = requiredEnergy <= usableEnergy;
const fitsWithBreakCharge = !fitsDirectly && requiredEnergy <= usableEnergy + breakTopUp;

// Driver hours (Reg. 561/2006): job must end within the shift and the 9 h daily driving limit
const driveMin = drivingMinutes(job);                         // distance ÷ average speed + stops
const breakMin = driver.drivenMinToday + driveMin > driver.breakDueAfterMin ? 45 : 0;
const fitsDriver = addMinutes(job.windowStart, driveMin + breakMin) <= driver.shiftEnd
  && driver.drivenMinToday + driveMin <= 540;

const feasible = truck.powertrain === 'electric'
  && truck.status === 'available'
  && job.payloadKg <= truck.capacityKg
  && (fitsDirectly || fitsWithBreakCharge)
  && fitsDriver;

// Confidence shown to the dispatcher (UN-01)
const reserveAfterPercent = truck.socPercent
  - (requiredEnergy - (fitsWithBreakCharge ? breakTopUp : 0)) / truck.batteryKWh * 100;
const confidence = reserveAfterPercent - truck.reservePercent > 25 ? 'high'
  : reserveAfterPercent - truck.reservePercent > 10 ? 'medium' : 'low';
```

**Planner rule (fleet-level, KI-02):** sort jobs by distance, longest first. Give each job to the feasible e-truck that has the **smallest energy margin left above the reserve** (best fit), so short jobs don't use up e-trucks that could do long ones. Jobs no e-truck can do go to diesels. Every proposal carries an explanation, e.g. *"E-03 can do this: needs 182 kWh, has 236 kWh above the 15% reserve, so it arrives with 23% left."*

The simple calculation is not a validated range prediction. A production model would need full routes, elevation, charging curves, driver hours, vehicle-specific behaviour and data-quality checks.

## 8. KPI constants (`data/constants.ts`)

| Constant | Value | Source |
|---|---|---|
| Diesel toll, >18 t, Euro VI, CO₂ class 1 | 0.348 €/km | E-05 |
| Diesel toll, 7.5–12 t, Euro VI, CO₂ class 1 | 0.178 €/km | E-05 |
| E-truck toll in Germany until 30 Jun 2031 | 0 €/km | E-04 |
| Depot electricity | 0.24 €/kWh | E-22 |
| Public charging | 0.49 €/kWh | E-22 |

Toll savings = approved e-km on toll roads × toll rate for the truck's weight class. The report labels all savings as *estimates based on fictional data*.

### Report KPIs linked to product.md §1.6

| KPI on A5 | Formula | Target (product.md) |
|---|---|---|
| Share of fleet km driven electric | approved e-km ÷ all approved km | +20 % relative vs. baseline |
| Electric km per e-truck per working day | approved e-km ÷ e-trucks ÷ working days | +20 % vs. baseline, zero range-related breakdowns |
| Suggestion acceptance rate | approved without change ÷ all proposals | ≥ 70 % after 4 weeks |
| Toll saved | see above | — |
| Energy cost vs. diesel | e-km × kWh/km × price/kWh vs. same km in diesel | — |

## 9. Simulated agentic workflow
**Observe:** local battery, job, charger and scenario state.
**Reason:** evaluate each job's feasibility for each e-truck.
**Propose:** recommend electric assignments and charging stops, with explanations.
**Confirm:** ask the dispatcher to approve proposed changes.
**Act:** update only approved local plans.
**Re-evaluate:** rerun when a simulated disruption is triggered.

No language model runs inside the app. AI coding tools are used to build the prototype; the app itself uses transparent rules.

## 10. Quality, privacy and safety
- No customer records, driver personal data, real coordinates, live APIs or operational routing claims.
- Every recommendation shows its assumptions and the estimated battery reserve on arrival.
- A failed feasibility check looks clearly different and cannot be confirmed as safe automatically; overriding it requires an explicit warning.
- Approved plans and draft suggestions must always look different.
- **Reset demo** restores the seed data so reviewers can reproduce scenarios.
- Semantic labels, keyboard-operable controls and legible contrast (WCAG AA).

## 11. Demo plan and verification
1. A1: open the fleet overview with 8 sample trucks (5 electric across 2 brands, 3 diesel).
2. A3: generate a plan for 6 sample jobs; show that e-trucks are chosen only when feasible.
3. A3: show why one job was not given to an e-truck (not enough range or payload).
4. A3: manually override one proposal; the app warns if the override is not feasible.
5. A4: trigger a mock charging-station outage; a replacement proposal appears and needs approval.
6. A2 → A3: add a late order; only the changed assignments are proposed again.
7. A5: review the updated weekly report (e-km share, e-km per truck, acceptance rate, toll saved, energy cost vs. diesel).

## 12. Future production integrations (explicitly excluded)
Truck telematics via rFMS, route and map services, real charger availability and booking, energy prices, transport management systems, login, audit logs, and predictive battery models.
