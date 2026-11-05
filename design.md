# design.md — VoltLane

**Course:** ESCP Business School, Bachelor in Management: Digital Transformation (Dr. David M. Lehmann), Berlin campus
**Team:** Bilegsain Khugjilt · Noélie Girardot Chaffard · Minghongyu (Echo) Li · Angilbert · Yasha · Zack
**Version:** v3, 5 Nov 2026: "dispatch board" redesign (palette, type and layout taken from the trucking world; contrast recalculated)

> Design system for the VoltLane prototype: principles, tokens, components and the Storybook plan. This is Garrett's layer 5 (Surface); layers 1–4 are in `product.md`.
>
> **Figma wireframes:** [VoltLane — Skeleton wireframes](https://www.figma.com/design/rUYDqDUAa8etl3w6t6hFu9). The wireframes show the v1 layout; the shipped app follows this v3 document.

---

## 1. Design direction

v1 used a generic dashboard look (black sidebar, one acid accent, identical rounded cards, "A · B · C" text strings). It looked machine-made, not specific to dispatching. v3 takes its visual language from **where dispatchers actually work**:

| Idea | Where it comes from | What it does on screen |
|---|---|---|
| **The dispatch board** | Paper and magnetic planning boards in dispatch offices, and Gantt views in transport software | A3 shows one lane per truck with jobs at their real time windows, so you see the whole day at once |
| **Pencil vs ink** | Dispatchers pencil in a plan and ink it when it is confirmed | Proposed jobs are **hatched**; approved jobs are **solid** (NFR-05) |
| **Battery line** | A fuel or charge gauge, drawn over time | On every electric lane a line traces the battery through the day against the dashed 15% reserve. It shows VoltLane's core idea, using the battery without crossing the reserve (KI-01), in one picture |
| **Road-sign type** | Barlow is drawn after highway signage | Clear, slightly condensed letterforms for dense data |
| **Road palette** | Asphalt, traffic-sign blue, signal amber | Colours carry meaning: blue = act, lime = electric/charge, amber = needs attention |

## 2. Design principles

| Principle | What it means on screen | Traces to |
|---|---|---|
| **Explain, don't hide** | Every proposal has one plain sentence and an energy bar: what the job needs vs what the truck has above its reserve | UN-03, KI-03, FR-09 |
| **Pencil until approved** | Hatched = proposed, solid = approved, blue outline = changed by the dispatcher | NFR-05, NFR-07 |
| **Safe by default** | A choice below the safety reserve needs explicit confirmation and stays flagged | FR-13 |
| **Colour means something** | Lime only for electric/charge, blue only for actions and selection, amber only for warnings, red only for "not electric / below reserve" | NFR-02 |
| **Plain words** | Sentences instead of "·"-joined labels; buttons say what they do ("Approve all 8", "Generate plan") | NFR-04 |
| **Never colour alone** | Every status has a text label; hatching vs solid also works without colour | NFR-02, NFR-11 |

---

## 3. Design tokens

### 3.1 Colour

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#EDEFF1` | App background (depot concrete) |
| `--color-surface` | `#FFFFFF` | Board, tables, panels |
| `--color-surface-subtle` | `#F4F5F6` | Table headers, empty bar tracks |
| `--color-surface-inverse` | `#1D2229` | Asphalt: sidebar, approved diesel jobs, "needed" part of energy bars |
| `--color-text` / `--color-text-muted` | `#1D2229` / `#59616B` | Main and secondary text |
| `--color-text-inverse` / `--color-text-inverse-muted` | `#FFFFFF` / `#AEB6BF` | Text on asphalt |
| `--color-border` / `--color-border-strong` / `--color-border-inverse` | `#DADDE1` / `#6B737D` / `#4A525C` | Dividers / control and block outlines / lines on dark |
| `--color-action` / `--color-action-hover` / `--color-action-tint` | `#0E4C92` / `#0B3E78` / `#E6EEF8` | Traffic-sign blue: primary buttons, selection, pressed toggles, focus |
| `--color-charge` / `--color-charge-hover` | `#D4EE3F` / `#C6E12F` | Lime: electric trucks, charge, approved e-jobs. **Background only, never text or a border on white** |
| `--color-success` / `-bg` | `#17733A` / `#E3F2E7` | Available |
| `--color-warning` / `-bg` | `#8A5300` / `#FFF0CC` | Signal amber: low battery, late charging, replaced jobs |
| `--color-danger` / `-bg` | `#B3261E` / `#FBE9E7` | Below reserve, no truck; the dashed reserve line |
| `--color-focus` | `#0E4C92` | Focus ring on light surfaces; on the sidebar the ring uses `--color-charge` |
| `--color-overlay` / `--color-hover-inverse` | asphalt 50% / white 7% | Dialog backdrop / sidebar hover |

### 3.2 Contrast check (WCAG 2.1, calculated)

| Pair | Ratio | Required | Result |
|---|---|---|---|
| Text on white / on app background / on subtle | 16.0 / 13.9 / 14.7 : 1 | 4.5 | ✅ |
| Muted text on white / on app background | 6.3 / 5.4 : 1 | 4.5 | ✅ |
| White on asphalt / muted inverse on asphalt | 16.0 / 7.8 : 1 | 4.5 | ✅ |
| White on traffic blue (primary button) | 8.5 : 1 | 4.5 | ✅ |
| Blue on blue tint (pressed toggle, "Changed by you") | 7.3 : 1 | 4.5 | ✅ |
| Text on lime / lime on asphalt ("CHARGE" marker) | 12.3 / 12.3 : 1 | 4.5 | ✅ |
| Amber on amber background / green on green / red on red | 5.6 / 5.1 / 5.6 : 1 | 4.5 | ✅ |
| Focus blue on app background / lime focus on sidebar | 7.4 / 12.3 : 1 | 3 (non-text) | ✅ |
| Strong border on white (controls, job blocks) | 4.8 : 1 | 3 (non-text) | ✅ |
| ❌ Lime on white as text or border | 1.3 : 1 | 3 | **Not allowed**; lime is always a fill with a dark outline or dark text |
| ❌ Blue focus ring on asphalt | 1.9 : 1 | 3 | **Not used**; the sidebar uses a lime focus ring |

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
