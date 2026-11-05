# design.md — VoltLane

**Course:** ESCP Business School, Bachelor in Management: Digital Transformation (Dr. David M. Lehmann), Berlin campus
**Team:** Bilegsain Khugjilt · Noélie Girardot Chaffard · Minghongyu (Echo) Li · Angilbert · Yasha · Zack
**Version:** v2, 5 Nov 2026 (contrast ratios calculated and fixed; aligned with the Figma wireframes)

> Design system for the VoltLane prototype: principles, design tokens, components and the Storybook plan. This is Garrett's layer 5 (Surface); layers 1–4 are in `product.md`. The look follows the VoltLane pitch deck: off-white background, near-black text and cards, lime as the single accent.
>
> **Figma wireframes:** [VoltLane — Skeleton wireframes](https://www.figma.com/design/rUYDqDUAa8etl3w6t6hFu9) (use the same tokens as below)

---

## 1. Design principles

| Principle | What it means on screen | Traces to |
|---|---|---|
| **Explain, don't hide** | Every suggestion shows *why* in one plain sentence, with the numbers behind it | UN-03, KI-03 |
| **Proposed ≠ approved** | A suggestion looks unfinished (white card, dashed dark border, lime "Proposed" label); an approved assignment looks settled (dark card, "Approved" label) | NFR-05, NFR-07 |
| **Safe by default** | Infeasible options are clearly marked (red border, reason shown) and need explicit confirmation | FR-13 |
| **Calm, dense desk tool** | Dispatchers scan many rows at once: compact tables, few colours, no decoration | NFR-10 |
| **Never colour alone** | Every status has a text label as well as a colour (an icon is optional) | NFR-02, NFR-11 |

---

## 2. Design tokens

### 2.1 Colour

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F2F2ED` | Page background (off-white) |
| `--color-surface` | `#FFFFFF` | Cards, tables, panels |
| `--color-surface-subtle` | `#E8E8E3` | Table header rows, neutral badges, empty part of bars |
| `--color-surface-inverse` | `#141414` | Sidebar, approved assignments, highlighted KPI |
| `--color-text` | `#141414` | Main text |
| `--color-text-muted` | `#5C5C57` | Secondary text, labels |
| `--color-text-inverse` | `#FFFFFF` | Text on dark surfaces |
| `--color-accent` | `#E3F33B` | Lime: primary button, active nav item, "Proposed" and "Electric" labels. **Always as a background with dark text, never as text or a border on white.** |
| `--color-border` | `#D9D9D2` | Decorative dividers and card outlines only |
| `--color-border-strong` | `#5C5C57` | Borders of inputs and other controls |
| `--color-success` / `--color-success-bg` | `#17733A` / `#E6F5E8` | Feasible, available |
| `--color-warning` / `--color-warning-bg` | `#8A5A00` / `#FCF2D9` | Low reserve, charging needed, needs attention |
| `--color-danger` / `--color-danger-bg` | `#B3261E` / `#FAEBE8` | Infeasible, not electric, error |
| `--color-focus` | `#2457D6` | Keyboard focus ring on light surfaces (on dark surfaces use `--color-accent`) |

### 2.2 Contrast check (WCAG 2.1, calculated)

| Pair | Ratio | Required | Result |
|---|---|---|---|
| Text `#141414` on bg `#F2F2ED` | 16.4 : 1 | 4.5 | ✅ |
| Muted text on bg / on white / on subtle | 6.0 / 6.7 / 5.5 : 1 | 4.5 | ✅ |
| White text on dark `#141414` | 18.4 : 1 | 4.5 | ✅ |
| Dark text on lime `#E3F33B` | 15.0 : 1 | 4.5 | ✅ |
| Success on white / on success-bg | 5.9 / 5.2 : 1 | 4.5 | ✅ |
| Warning on white / on warning-bg | 5.9 / 5.3 : 1 | 4.5 | ✅ |
| Danger on white / on danger-bg | 6.5 / 5.6 : 1 | 4.5 | ✅ |
| Focus ring blue on bg | 5.5 : 1 | 3 (non-text) | ✅ |
| Focus ring lime on dark sidebar | 15.0 : 1 | 3 (non-text) | ✅ |
| Strong border on white (inputs) | 6.7 : 1 | 3 (non-text) | ✅ |
| ❌ Lime on white (as text or border) | 1.2 : 1 | 3 | **Not allowed**, hence the rule above |

### 2.3 Typography

| Token | Value | Use |
|---|---|---|
| `--font-family` | `"Inter", system-ui, sans-serif` | All text. Install via `@fontsource/inter` (bundled locally, so no font API call). Same font as the Figma wireframes |
| `--font-size-xs` | 12px | Table headers, badges, footnotes |
| `--font-size-sm` | 14px | Body text in tables and cards |
| `--font-size-md` | 16px | Default body, card titles |
| `--font-size-lg` | 20px | Section titles |
| `--font-size-xl` | 28px | Page titles |
| `--font-size-kpi` | 40px | Big numbers on the weekly report |
| `--font-weight-regular` / `--font-weight-semibold` / `--font-weight-bold` | 400 / 600 / 700 | |

Numbers in tables use tabular figures (`font-variant-numeric: tabular-nums`) so columns line up.

### 2.4 Spacing, shape, layout

| Token | Value |
|---|---|
| `--space-1` … `--space-8` | 4, 8, 12, 16, 24, 32, 48, 64 px |
| `--radius-sm` / `--radius-md` / `--radius-lg` / `--radius-pill` | 6 / 12 / 20 / 999 px (cards use `md`, badges use `pill`) |
| `--shadow-card` | `0 1px 2px rgba(20,20,20,0.06)` |
| `--sidebar-width` | 232px |
| `--content-min-width` | 1280px (desktop-first, NFR-10) |

### 2.5 `tokens.css` (copy to `src/styles/tokens.css`)

```css
:root {
  /* colour */
  --color-bg: #F2F2ED;
  --color-surface: #FFFFFF;
  --color-surface-subtle: #E8E8E3;
  --color-surface-inverse: #141414;
  --color-text: #141414;
  --color-text-muted: #5C5C57;
  --color-text-inverse: #FFFFFF;
  --color-accent: #E3F33B;
  --color-border: #D9D9D2;
  --color-border-strong: #5C5C57;
  --color-success: #17733A;
  --color-success-bg: #E6F5E8;
  --color-warning: #8A5A00;
  --color-warning-bg: #FCF2D9;
  --color-danger: #B3261E;
  --color-danger-bg: #FAEBE8;
  --color-focus: #2457D6;

  /* type */
  --font-family: "Inter", system-ui, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 28px;
  --font-size-kpi: 40px;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* space & shape */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px; --radius-pill: 999px;
  --shadow-card: 0 1px 2px rgba(20, 20, 20, 0.06);

  /* layout */
  --sidebar-width: 232px;
  --content-min-width: 1280px;
}

:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }
.on-dark :focus-visible { outline-color: var(--color-accent); }
```

---

## 3. Components

Each component gets Storybook stories for every state listed. Story names in *italics*.

| Component | Purpose | Variants / states (= stories) | Accessibility | Used on |
|---|---|---|---|---|
| **Button** | Actions | *Primary* (lime, dark text), *Secondary* (white, strong border), *Ghost*, *Danger*; each *Default / Hover / Focus / Disabled* | Native `<button>`, visible focus ring | All |
| **StatusBadge** | Short status as a pill | Truck: *Available*, *Charging*, *On route*, *Maintenance*. Job: *Unassigned*. Plan: *Proposed*, *Approved*, *Feasible*, *Feasible with break charge*, *Not electric*. Report: *Under-used* | Text label always present | A1–A5 |
| **PowertrainTag** | Electric vs diesel | *Electric* (lime), *Diesel* (subtle grey) | Text label always shown | A1, A3 |
| **RangeBar** | Battery level and predicted km | *Normal*, *Low* (warning colour + "low") | `role="meter"` with `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`; value also shown as text | A1 |
| **DataTable** | Fleet and job lists | *Default*, *Sorted*, *Empty* | `<table>` with `<th scope="col">` headers | A1, A2 |
| **RecommendationCard** | One proposed assignment with explanation and actions | *Proposed* (white, dashed dark border, lime "Proposed" badge), *Approved* (dark surface, "Approved" badge), *Overridden* (white, solid border, "Changed by dispatcher" badge), *Infeasible* (red border, "Not electric" badge, reason shown) | Explanation is real text; actions are labelled buttons | A3 |
| **ReassignDialog** | Choose another truck; warn if infeasible | *Feasible choice*, *Infeasible warning* | `role="alertdialog"`, focus kept inside the dialog, Esc closes | A3 |
| **ChargingTimeline** | Charging stops per truck, 06:00–18:00 | *Depot* (dark bar), *Public in break* (lime bar, dark outline), *Ends after shift* (warning bar + text) | Each bar has a text alternative ("E-01 depot 06:00–07:00") | A4 |
| **ScenarioControl** | Trigger delay / charger outage / cold weather | *Idle*, *Event active* | Buttons; status change announced with `aria-live="polite"` | A3 |
| **KpiTile** | Big number on the report | *Default*, *Highlight* (dark surface, lime number) | Number, label and unit as text | A5 |
| **Navigation** | Sidebar with A1–A5 | *Default*, *Active item* (lime background) | `<nav>`, `aria-current="page"`, lime focus ring on dark | All |
| **TopBar** | Date, scenario, Reset demo | *Default*, *Reset confirm* | Reset asks for confirmation | All |

### 3.1 Key component detail: RecommendationCard (Proposed)

```text
┌ - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐   ← dashed dark border = PROPOSED
  [Proposed] [Feasible]
  J-04  Dortmund → Bochum  ·  148 km, 6.2 t
  Truck E-03  ·  Electric  ·  Brand A
  "E-03 can do this: needs 182 kWh, has 236 kWh above
   the 15% reserve, so it arrives with 28% left."
  [ Approve ]   [ Reassign… ]
└ - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘
```

### 3.2 Explanation text templates (voice)

Short, factual, one sentence, numbers first. Example values assume E-03 has a ~420 kWh battery at 71% charge, i.e. about 236 kWh above the 15% reserve.
- **Feasible:** "E-03 can do this: needs 182 kWh, has 236 kWh above the 15% reserve, so it arrives with 28% left."
- **Feasible with break charge:** "E-05 can do this with a 45-min depot charge during the driver's break (+90 kWh)." *(120 kW depot charger × 0.75 h)*
- **Not electric, range:** "No e-truck can do this safely: it needs 310 kWh; the best available has 240 kWh above the reserve. Assigned to diesel D-02."
- **Not electric, payload:** "Too heavy for the free e-trucks (8.4 t vs 7.0 t capacity). Assigned to diesel D-02."
- **Override warning:** "E-02 would arrive below its 15% safety reserve. Assign anyway?"

---

## 4. Storybook plan

- Setup: `@storybook/react-vite` with the accessibility add-on `@storybook/addon-a11y`, which checks contrast and labels in every story.
- `tokens.css` and `@fontsource/inter` are imported in `.storybook/preview.ts`, so stories look exactly like the app.
- A **"Foundations / Tokens"** page showing colours (with the contrast table), type scale and spacing.
- One `*.stories.tsx` file per component in §3, one story per listed state, with fictional data from `src/data/`.
- Run: `npm run storybook`; build a static version with `npm run build-storybook` if needed for submission.

---

## 5. Accessibility checklist

- [ ] All interactive elements reachable and usable by keyboard; visible focus ring (blue on light, lime on dark)
- [ ] Every status has a text label, not colour alone
- [ ] Text contrast at least 4.5:1; control borders and focus rings at least 3:1 (§2.2)
- [ ] Lime never used as text or border on white
- [ ] Tables use `<th scope="col">` headers
- [ ] Dialogs keep focus inside and close with Esc
- [ ] Numbers always have units (km, kWh, %, €)
