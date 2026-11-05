# architecture.md — VoltLane

> Technical architecture for ESCP Digital Product Design prototype, 5 November 2026. All records are fictional. No external APIs and no real data, as required by the workshop.

## 1. Architectural objective
Build a functional, desktop-first web prototype in which a dispatcher can generate, inspect, approve, override and revise electric-first delivery assignments. Prioritize a demonstrable end-to-end workflow rather than production integrations.

## 2. Proposed technology stack

| Layer | Choice | Reason |
|---|---|---|
| UI | React + TypeScript | Component-based, type-safe dashboard and forms |
| Build | Vite | Lightweight local development and build |
| Styling | Plain CSS or CSS modules | Minimal setup and accessible visual consistency; specify tokens later in `design.md` |
| State | React hooks (`useState`, `useMemo`) | Sufficient for a single-user local prototype |
| Data | Local TypeScript/JSON seed objects | Meets no real data / no API restriction |
| Planning logic | Deterministic TypeScript functions | Repeatable, explainable simulated agent workflow |
| Testing | Vitest (optional) | Verify feasibility and re-planning rules |
| Deployment | Local browser (`npm run dev`) | No backend or cloud account needed |

These are proposed choices, not choices mandated by the workshop. If the group already has a working stack, adapt the document accordingly.

## 3. Component architecture

```text
Dispatcher (browser)
        |
        v
React UI: Fleet / Jobs / Daily Plan / Charging / Report
        |
        v
App state: trucks, jobs, chargers, assignments, disruptions
        |
        +--> Planning engine: estimate energy -> check constraints
        |                   -> rank EV assignments -> explain recommendations
        |
        +--> Charging estimator: compatible mock chargers -> time/cost
        |
        +--> Scenario engine: delay / outage -> draft revised plan
        |
        +--> KPI calculator: approved e-km, EV share, assumed savings
        |
        v
Local seed data (fictional), no network or production integrations
```

## 4. Suggested folder structure

```text
voltlane/
  README.md
  evidence.md
  product.md
  architecture.md
  design.md
  package.json
  src/
    main.tsx
    App.tsx
    data/seedData.ts
    types/domain.ts
    logic/range.ts
    logic/planner.ts
    logic/charging.ts
    logic/kpis.ts
    components/Navigation.tsx
    components/StatusBadge.tsx
    components/RecommendationCard.tsx
    pages/FleetOverview.tsx
    pages/Jobs.tsx
    pages/DailyPlan.tsx
    pages/Charging.tsx
    pages/WeeklyReport.tsx
    styles/tokens.css
```

## 5. Data flow and user control
1. Load local seed records into app state.
2. Dispatcher requests a plan.
3. Planning engine creates *proposed* assignments with feasibility checks and explanations.
4. UI displays proposals separately from approved assignments.
5. Dispatcher approves or overrides; only then update approved state.
6. Simulated event triggers re-planning; proposed changes again require confirmation.
7. KPI calculator derives summary from approved assignments, never invented live results.

## 6. Rules engine (illustrative, not real routing)

```ts
const requiredEnergy = job.distanceKm * truck.efficiencyKWhPerKm
  * scenario.weatherFactor * scenario.payloadFactor;
const usableEnergy = truck.batteryKWh
  * (truck.socPercent - truck.reservePercent) / 100;
const feasible = truck.powertrain === 'electric'
  && truck.status === 'available'
  && job.payloadKg <= truck.capacityKg
  && requiredEnergy <= usableEnergy;
```

Do not equate the simple calculation with a validated truck range prediction. A production model must incorporate full routes, elevation, charging curves, driver hours, vehicle-specific behavior, data quality and other constraints.

## 7. Simulated agentic workflow
**Observe:** local battery/job/charger/scenario state.  
**Reason:** evaluate job suitability and feasibility.  
**Propose:** recommend electric assignments and charging plans with explanations.  
**Confirm:** request dispatcher approval for proposed changes.  
**Act:** update only approved local plans.  
**Re-evaluate:** rerun when a simulated disruption is triggered.

No external language model is required at runtime. AI coding tools may be used to create the prototype, while the app itself uses transparent simulation logic.

## 8. Quality, privacy and safety
- No customer records, driver personal data, real coordinates, live APIs or operational routing claims.
- Every recommendation exposes assumptions and estimated remaining battery reserve.
- A failed feasibility check is visually distinct and cannot be automatically confirmed as safe.
- Approved plan and draft suggestions must remain distinguishable.
- Provide a **Reset demo** function so reviewers can reproduce scenarios.
- Use semantic labels, keyboard-operable controls and legible contrast.

## 9. Demo plan and verification
1. Open fleet overview and show sample trucks.
2. Generate a plan for 6 sample deliveries; show that EVs are selected only if feasible.
3. Explain why one assignment is rejected for insufficient range or payload.
4. Manually override one proposed assignment, with warning if infeasible.
5. Trigger mock charging-station outage; observe a replacement proposal requiring approval.
6. Review updated electric utilization report.

## 10. Future production integrations (explicitly excluded)
OEM/rFMS telematics, route/geospatial services, real charger availability and booking, energy pricing, transport management systems, authentication, audit logs, and predictive battery models.
