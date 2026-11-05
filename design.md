# design.md — VoltLane

**Course:** ESCP Business School, Bachelor in Management: Digital Transformation (Dr. David M. Lehmann), Berlin campus
**Team:** Bilegsain Khugjilt · Noélie Girardot Chaffard · Minghongyu (Echo) Li · Angilbert · Yasha · Zack
**Version:** v4, 5 Nov 2026: "night depot" (black + neon lime, 3D depot yard on A1; contrast recalculated). v3 introduced the dispatch board, which stays.

> Design system for the VoltLane prototype: principles, tokens, components and the Storybook plan. This is Garrett's layer 5 (Surface); layers 1–4 are in `product.md`.
>
> **Figma wireframes:** [VoltLane — Skeleton wireframes](https://www.figma.com/design/rUYDqDUAa8etl3w6t6hFu9). The wireframes show the v1 layout; the shipped app follows this v4 document.

---

## 1. Design direction

v1 used a generic dashboard look. v3 took its layout from where dispatchers work (the dispatch board, pencil vs ink). v4 keeps that layout and changes the surface to **the depot at night**: dispatchers plan tomorrow while the trucks stand charging in the yard, so the app is black, and electricity is the only thing that glows.

| Idea | Where it comes from | What it does on screen |
|---|---|---|
| **The night depot (A1)** | The yard at the end of a shift: trucks in their bays, chargers lit | A1 opens on a 3D yard with the 7 trucks. Electric trucks are outlined in neon lime next to a lit charger; diesels are grey. Click a truck (or its button below the yard) to fly the camera to it and open its panel: battery, range, today's jobs, charging, this week |
| **The dispatch board (A3)** | Paper and magnetic planning boards, and Gantt views in transport software | One lane per truck with jobs at their real time windows |
| **Pencil vs ink** | Dispatchers pencil in a plan and ink it when it is confirmed | Proposed jobs are **hatched / dashed**; approved jobs are **solid neon** (NFR-05) |
| **Battery line** | A charge gauge drawn over time | On every electric lane a neon line traces the battery through the day against the dashed 15% reserve (KI-01) |
| **Only electricity glows** | Charger LEDs and lit cables in a dark yard | Neon lime and its glow are reserved for electric trucks, charge and the primary action. Nothing else glows |
| **Road-sign type** | Barlow is drawn after highway signage | Clear, slightly condensed letterforms for dense data |

## 2. Design principles

| Principle | What it means on screen | Traces to |
|---|---|---|
| **Explain, don't hide** | Every proposal has one plain sentence and an energy bar: what the job needs vs what the truck has above its reserve | UN-03, KI-03, FR-09 |
| **Pencil until approved** | Hatched or dashed = proposed, solid neon = approved, amber tag = changed by the dispatcher | NFR-05, NFR-07 |
| **Safe by default** | A choice below the safety reserve needs explicit confirmation and stays flagged | FR-13 |
| **Colour means something** | Neon lime only for electric/charge and the one primary action, amber only for warnings, red only for "not electric / below reserve", grey for diesel | NFR-02 |
| **Plain words** | Sentences instead of "·"-joined labels; buttons say what they do ("Approve all 8", "Generate plan") | NFR-04 |
| **Never colour alone** | Every status has a text label; hatching vs solid also works without colour | NFR-02, NFR-11 |

---

## 3. Design tokens

### 3.1 Colour

All colours live in `src/styles/tokens.css`. The 3D scene reads the same tokens at runtime (`getComputedStyle`), so it has no colours of its own.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#050505` | App background, the 3D yard, sidebar |
| `--color-surface` | `#0D0E0F` | Board, tables, panels |
| `--color-surface-subtle` | `#16181A` | Table headers, empty tracks, proposed job cards |
| `--color-surface-raised` | `#24272B` | Truck bodies in 3D, approved diesel jobs, gauge tracks |
| `--color-text` / `--color-text-muted` | `#F1F3F4` / `#8E959C` | Main and secondary text |
| `--color-text-inverse` | `#050505` | Text on neon |
| `--color-border` / `--color-border-strong` | `#1F2225` / `#6E747C` | Dividers / control outlines, diesel outlines in 3D |
| `--color-charge` (= `--color-action`, `--color-focus`) | `#C8FF00` | Neon lime: electric, charge, primary button, selection, focus ring |
| `--color-charge-glow` | lime at 35% | The glow behind neon elements (box-shadow, bloom) |
| `--color-action-tint` | `#1A2200` | Selected rows, pressed toggles, approved job cards |
| `--color-success` / `-bg` | `#4ADE80` / `#0B2414` | Available |
| `--color-warning` / `-bg` | `#FFB547` / `#2A1F06` | Low battery, late charging, changed by you |
| `--color-danger` / `-bg` | `#FF6B5E` / `#2A0E0C` | Below reserve, no truck; the dashed reserve line |

### 3.2 Contrast check (WCAG 2.1, calculated)

| Pair | Ratio | Required | Result |
|---|---|---|---|
| Text on background / on surface / on raised | 18.6 / 17.4 / 12.3 : 1 | 4.5 | ✅ |
| Muted text on surface | 6.4 : 1 | 4.5 | ✅ |
| Neon lime on surface (text, outlines, focus ring) | 16.3 : 1 | 4.5 | ✅ |
| Black text on neon lime (primary button, approved blocks) | 17.2 : 1 | 4.5 | ✅ |
| Lime on lime tint (pressed toggle, selected) | 14.0 : 1 | 4.5 | ✅ |
| Amber on amber bg / green on green bg / red on red bg | 9.2 / 9.4 / 6.4 : 1 | 4.5 | ✅ |
| Strong border on surface (controls, job blocks) | 3.9 : 1 | 3 (non-text) | ✅ |
| ⚠️ Default border on surface | 1.2 : 1 | – | Dividers only, never the only edge of a control |

### 3.3 Typography

| Token | Value | Use |
|---|---|---|
| `--font-family` | `"Barlow", system-ui, sans-serif` | Body, tables, buttons |
| `--font-family-condensed` | `"Barlow Semi Condensed"` | Headings, truck and job IDs, board labels, big figures |
| Sizes | 12 / 14 / 16 / 20 / 30 / 44 px | Badges and notes / tables / body / section titles / page titles / report statement |
| Weights | 400 / 500 / 600 / 700 | |

Both fonts are bundled with `@fontsource/barlow` and `@fontsource/barlow-semi-condensed`, so the app loads no fonts from the internet. Numbers use tabular figures so columns line up. Sentence case everywhere; no all-caps labels except the two tiny board markers ("CHARGE", "LATE").

### 3.4 Space and shape

| Token | Value |
|---|---|
| `--space-1` … `--space-8` | 4, 8, 12, 16, 24, 32, 48, 64 px |
| `--radius-sm` / `-md` / `-lg` / `-pill` | 3 / 6 / 10 / 999 px; radius grows with object size (tags 3, tables 6, board and panels 10) |
| `--sidebar-width` | 216 px |
| `--content-min-width` | 1280 px (desktop-first, NFR-10) |

Hatching: `--hatch-charge` (lime/white, 135°) for proposed electric jobs and charged energy; `--hatch-diesel` (grey/white) for proposed diesel jobs and unused possible km.

---

## 4. Components

| Component | Purpose | States (= Storybook stories) | Accessibility | Used on |
|---|---|---|---|---|
| **PlanBoard** | Dispatch board: lanes per truck, job blocks, battery line, reserve line, charge markers | Proposed only, partly approved, after a disruption | Each block is a button with a full text label; the battery line is decorative and the same numbers appear in the decision rows | A3 |
| **RecommendationCard** (decision row) | One job: route, truck, reason, energy bar, actions | Proposed (hatched edge), approved (solid edge), changed by you, not electric, break charge, charge ends after shift, replaces an approved job | Explanation is real text; actions are labelled buttons | A3 |
| **EnergyBar** | Energy needed (asphalt) vs left above the reserve (lime); red if short | Fits, fits with break charge, short, diesel | `role="img"` with a text label, plus a visible caption | A3 |
| **ReassignDialog** | Move a job to another truck; warn below the reserve | Feasible choice, below-reserve warning, disabled options with reason | `role="alertdialog"` when warning; focus kept inside; Esc closes | A3 |
| **Button** | Actions | Primary (blue), secondary (outline), ghost, danger, pressed toggle, disabled | Native `<button>`, visible focus | All |
| **StatusBadge** | Small rectangular tag, like a sign plate | Neutral, electric (lime), approved (asphalt), success, warning, danger, changed (blue) | Text label always present | All |
| **RangeBar** | Battery now and approximate range | Normal, low | `role="meter"` with min/max/now; caption as text | A1 |
| **Charging timeline** | Depot and break charging per truck | Depot, public in break, late | Full table of the same sessions below it | A4 |
| **Report statement + figures** | One sentence with the key share, three supporting figures, battery use per truck | Normal, under-used | Plain text; bars have `role="meter"` | A5 |
| **DepotYard3D** | 3D night depot with the 7 trucks (Kenney Car Kit models, CC0, loaded from `/public/models`, no network) | Overview, truck selected (camera flies in, wheels turn, bay ring pulses), WebGL off (text fallback) | The canvas is a picture; every truck is also a real button in the truck picker below it, and all numbers are in the panel and table. Reduced motion: no camera flight or spinning | A1 |
| **TruckPanel** | Details for one truck | Electric with plan, electric without plan, diesel, charge ends after shift | Section with heading; battery dial has `role="img"` and a text label; live region announces the change | A1 |
| **Navigation** | Sidebar with a lane-marking wordmark | Default, active (lime edge) | `<nav>`, `aria-current="page"`, lime focus ring | All |
| **TopBar** | Depot, date, temperature, active tests, Reset demo | Default, active disruption, reset confirmation | Reset asks for confirmation | All |

### 4.1 Explanation text (voice)

Short, factual, one sentence, numbers first:
- **Fits:** "E-03 can do this: needs 182 kWh, has 236 kWh above the 15% reserve, so it arrives with 28% left."
- **Fits with break charge:** "E-03 can do this with a 45-min charge during the driver's break (+90 kWh, 12:53–13:38); it arrives with 19% left."
- **Not electric:** "No e-truck can do this safely: it needs 445 kWh; the best available has 295 kWh above the reserve (even with a 45-min break charge). Assigned to diesel D-01."
- **Override warning:** "E-03 would arrive below its 15% safety reserve (needs 69 kWh, has 19 kWh). Assign anyway?"

---

## 5. Storybook plan

- `@storybook/react-vite` with `@storybook/addon-a11y`, which checks contrast and labels in every story.
- `tokens.css`, `app.css` and the Barlow fonts are loaded in `.storybook/preview.ts`, so stories look exactly like the app.
- **Foundations/Tokens:** colours, type scale, spacing, sidebar.
- **Components:** PlanBoard, decision rows in every state, basics (buttons, badges, range bar).
- Run: `npm run storybook`; static build: `npm run build-storybook`.

---

## 6. Accessibility checklist

- [x] All interactive elements usable by keyboard, with a visible focus ring (blue on light, lime on dark)
- [x] Every status has a text label; hatched vs solid also works without colour
- [x] Text contrast at least 4.5:1; controls and focus rings at least 3:1 (§3.2)
- [x] Lime never used as text or border on white
- [x] Tables use `<th scope="col">`; the charging timeline has a table equivalent
- [x] Dialog keeps focus inside and closes with Esc
- [x] Motion only in response to an action; `prefers-reduced-motion` turns it off
