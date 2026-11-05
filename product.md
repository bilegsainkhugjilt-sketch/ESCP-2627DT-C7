# product.md — VoltLane

**Course:** ESCP Business School, Bachelor in Management: Digital Transformation (Dr. David M. Lehmann), Berlin campus
**Team:** Bilegsain Khugjilt · Noélie Girardot Chaffard · Minghongyu (Echo) Li · Angilbert · Yasha · Zack
**Version:** v2, 5 Nov 2026

> Product Requirements Document, structured on Jesse James Garrett's *Elements of User Experience*: **1 Strategy → 2 Scope → 3 Structure → 4 Skeleton.** Layer 5 (Surface: visual design) is in `design.md`; technology choices are in `architecture.md`.
> IDs used across files: `KI-xx` key insight and `E-xx` evidence (evidence.md) · `UN-xx` user need · `PO-xx` product objective · `US-xx` user story · `FR-xx` functional requirement · `NFR-xx` non-functional requirement · `A1…` screen.

---

## 1. Strategy

### 1.1 Product in one sentence
**VoltLane is a web planning tool for dispatchers at trucking companies that run diesel and electric trucks side by side. It predicts how far each electric truck can safely go, proposes which jobs go electric and explains why, and fits charging around the depot and drivers' breaks, so expensive e-trucks drive as many kilometres as they safely can.**

### 1.2 Problem statement
Electric trucks in Europe go 11–19% further than their makers state (E-10), yet fleets charge them cautiously and buy bigger batteries than they use: 58% of charging sessions start while the battery is still over half full, and the average charging cycle uses only 44% of the battery (E-13). For companies that have run e-trucks for a year or more, the main problem is no longer the truck but **planning**: route-planning restrictions are their most-cited drawback (E-16). How the fleet is planned matters a lot: in a large REWE study, swapping diesels for e-trucks one for one let e-trucks drive 32% of fleet km, while re-planning the whole fleet raised this to 54% (E-18). In Germany, where e-trucks are toll-free until 30 June 2031 and already at cost parity with diesel (E-04, E-06), each kilometre given to a diesel that an e-truck could have driven is money lost.

### 1.3 Target users

| Role | Who | Relationship to product | Source |
|---|---|---|---|
| **Primary user** | Dispatcher ("Stefan") at a regional carrier running roughly 5–50 e-trucks alongside diesels, of more than one brand | Uses VoltLane daily to build and adjust the plan | evidence.md §5 |
| **Buyer** | Head of operations / fleet manager ("Claudia") | Pays; judged on cost per km and on-time delivery; reads the weekly report | evidence.md §5 |
| Secondary (not in prototype) | Drivers | Receive the plan; affected by charging stops and breaks | — |

**Market focus:** Germany first. It is the largest e-truck market, e-trucks there are toll-free until mid-2031, and they are already at cost parity (E-01, E-04, E-06). Netherlands and France next; together with Germany they account for 74% of EU e-truck registrations (E-01).

**First use case:** regional, multi-stop distribution returning to a depot. ICCT measured the largest range surplus here (+19%, E-10), and depot charging covers most energy needs (E-22).

**Honest sizing note:** most adopters run only about 5 e-trucks today (E-26), and e-trucks are ~0.3% of all trucks (E-02). Our target group (5–50 e-trucks, mixed brands) is small now and grows as fleets scale towards 2030.

### 1.4 User needs

| ID | User need | For whom | From insight |
|---|---|---|---|
| UN-01 | Know **how far each e-truck can safely go today** with this load and weather, and **how sure** that estimate is | Dispatcher | KI-01 |
| UN-02 | Get **one plan for the whole mixed fleet**, across truck brands, that puts suitable jobs on e-trucks first | Dispatcher | KI-02 |
| UN-03 | **Understand and override** every suggestion, so he stays responsible and in control | Dispatcher | KI-03 |
| UN-04 | Have **charging fitted into depot time and legal driver breaks**, with no surprise stops | Dispatcher | KI-04 |
| UN-05 | **Re-plan quickly** when an order is added or a delivery runs late, taking remaining range into account | Dispatcher | KI-02 (E-19) |
| UN-06 | **See whether the e-trucks pay off**: e-km driven vs. possible, toll saved, energy cost vs. diesel | Head of ops | KI-05 |

### 1.5 Product objectives (business goals)

| ID | Objective | Why it matters to VoltLane |
|---|---|---|
| PO-01 | **Increase the share of fleet km driven electric** at each customer | This is the value we sell; it drives renewal and growth (we charge per e-truck) |
| PO-02 | **Earn dispatcher trust**, so suggestions get accepted rather than ignored | Expected dispatcher scepticism is a main adoption risk (E-17) |
| PO-03 | **Prove the return** to the buyer within the 90-day trial | The trial has to turn into an annual contract |
| PO-04 | **Fit into the daily routine**, so planning with VoltLane is no slower than without it | Otherwise dispatchers fall back to Excel and phone |

### 1.6 Success metrics

| Metric | Target | Linked to |
|---|---|---|
| Share of fleet km driven electric, vs. the customer's own baseline measured before VoltLane | **+20% relative** within the 90-day trial | PO-01, UN-02 |
| Electric km per e-truck per working day, vs. baseline | **+20%**, with **zero** range-related breakdowns or missed deliveries | PO-01, UN-01 |
| Share of VoltLane suggestions accepted without changes | **≥ 70%** after 4 weeks | PO-02, UN-03 |
| Time to build the next day's plan | **No more than the customer's current time** (measured in week 1) | PO-04 |
| Head of ops opens the weekly report | **At least 3 of 4 weeks** each month | PO-03, UN-06 |
| Trial → annual contract conversion | **≥ 50%** | PO-03 |

*All targets are our assumptions, to be tested in pilots. The +20% matches our pitch deck's 2028 milestone ("trucks drive 20% more electric km").*

### 1.7 Value proposition
- **For the dispatcher:** "Plan the whole fleet at once, know which jobs your e-trucks can safely do, and see why."
- **For the head of operations:** "Get your e-trucks driving as much as they safely can, and see the savings every week."

### 1.8 Positioning vs. alternatives

| Alternative | What it does well | Gap VoltLane targets |
|---|---|---|
| Excel + experience | Flexible, familiar | No range prediction; e-trucks tend to get the "safe" jobs |
| Truck makers' own tools (Volvo Range & Route, Mercedes Fleetboard, MAN) | Accurate data for their own trucks; partly free with a new truck (E-27) | One brand each; no plan for a mixed fleet |
| Route-planning software (PTV, HERE) | Route optimisation, now with e-truck profiles (E-20, E-28) | Built around routes, not around the question "which jobs should go electric?" |
| AI planning platforms (Einride) | Fleet-level planning with proven results (E-18) | Mostly sold with Einride's own trucks and transport service; less aimed at independent carriers' own dispatch |
| E-truck charging coordination (FRYTE Mobility, €5M raised) | Planning and booking of charging stops for dispatchers (E-28) | Focus on charging and booking, less on job assignment and ROI reporting |
| Telematics (Geotab, Webfleet) | Collect data, monitor battery level | Monitor rather than plan; partners and data sources for us |

**Where we differentiate:** the **e-km decision** (which jobs go electric) across **all truck brands**, combined with **explained suggestions** the dispatcher can trust and override, and a **weekly ROI report** for the buyer. Charging *booking* is not our core; we would rather partner with charging-booking platforms.
*Assumption to test:* that Einride's and FRYTE's current offers do not already cover this combination for independent mid-size carriers.

### 1.9 Constraints and scope boundaries
- **Platform:** desktop web app (dispatchers work at a desk). No mobile app in v1.
- **Prototype rules (course):** **no external APIs and no real data**. Trucks, jobs, chargers and drivers are **mock data**. The "AI" is simulated with transparent rules (e.g. a job fits if its distance, adjusted for load and temperature, plus a safety buffer is below the truck's predicted range).
- **Not in scope:** turn-by-turn navigation for drivers, live charger booking, billing, hydrogen trucks, cross-border long-haul.
- **Regulatory:** plans must respect EU driving and rest rules (Reg. 561/2006: 45-minute break after 4.5 h of driving) (E-21).

### 1.10 Key assumptions and risks (Strategy level)

| Risk | Mitigation | Evidence |
|---|---|---|
| Dispatchers ignore suggestions | Explain every suggestion; make override easy; track the acceptance rate | KI-03, E-17 |
| Range prediction wrong → stranded truck | Visible safety buffer; cautious by default; learns per truck | KI-01, E-11 |
| Target market small today (most adopters ~5 e-trucks) | Target fleets that are scaling up; validate the segment in interviews | E-02, E-26 |
| Truck makers' free tools are "good enough" | Focus on mixed-brand fleets; test in interviews (A2) | E-27 |
| Funded competitors (Einride, FRYTE, PTV) move into the same space | Differentiate on e-km decision + explainability + ROI; partner on charging | E-28 |
| Price above category norms (pitch: €180 per e-truck per month vs. typical $20–60 per vehicle) | Test willingness to pay (A4); toll savings alone justify it only for heavy trucks | E-05, E-29, evidence.md §7 |
| Toll advantage shrinks after June 2031 | Lower energy costs still favour e-trucks; EU rules still allow up to a 75% discount | E-04, E-06 |

### 1.11 Traceability (Strategy → Evidence)

| User need | Key insight | Evidence |
|---|---|---|
| UN-01 | KI-01 | E-05, E-10, E-11, E-12, E-13, E-14 |
| UN-02 | KI-02 | E-01, E-02, E-16, E-18, E-20 |
| UN-03 | KI-03 | E-17, E-20, E-25 |
| UN-04 | KI-04 | E-07, E-08, E-15, E-21, E-22, E-23 |
| UN-05 | KI-02 | E-19 |
| UN-06 | KI-05 | E-06, E-24, E-25 |

---

## 2. Scope
*To be completed in the 11:00–12:15 block.* Turn each UN into user stories → functional requirements → non-functional requirements → screens (workshop slide 12 format).

| # | User story | Functional requirements | Non-functional requirements | Screens |
|---|---|---|---|---|
| US-01 | As a dispatcher, I want to see each e-truck's predicted range with a safety buffer, so I know which jobs it can safely do. *(UN-01)* | FR-01 … | NFR-01 … | A1 |
| US-02 | … *(UN-02)* | | | A3 |

## 3. Structure
*To be completed in the 11:00–12:15 block.*
- 3.1 Interaction design: user flow (daily planning; re-plan when a delivery runs late)
- 3.2 Information architecture: data model (Truck, Job, Assignment, ChargingStation, ChargingSlot, Driver)

## 4. Skeleton
*To be completed in the 12:30–13:15 block.*
- Wireframes per screen (A1 Fleet overview, A2 Jobs, A3 Daily plan, A4 Charging, A5 Weekly report)
- Navigation design
