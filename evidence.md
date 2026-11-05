# evidence.md — VoltLane

**Course:** ESCP Business School, Bachelor in Management: Digital Transformation (Dr. David M. Lehmann), Berlin campus
**Team:** Bilegsain Khugjilt · Noélie Girardot Chaffard · Minghongyu (Echo) Li · Angilbert · Yasha · Zack
**Version:** v2, 5 Nov 2026 (claims re-checked against sources; see §8)

> **Purpose of this file:** Key insights from research that justify what VoltLane builds. Every insight links to evidence (`E-xx`), and every piece of evidence links to a source (`S-xx`). `product.md` refers back to the insight IDs (`KI-xx`).
>
> **Status:** Desk research only, using published secondary sources. **We have not yet interviewed dispatchers or fleet managers ourselves.** All insights are therefore **hypotheses backed by published field data and surveys**, and still need checking with real users (see §6).

---

## 1. Research approach

| Method | What we did | Limits |
|---|---|---|
| Secondary quantitative | Registration data (ACEA), regulation (EU, German Federal Transport Ministry), field data from operating e-truck fleets (ICCT, Geotab) | Field data mostly from early adopters and large fleets |
| Secondary qualitative / survey | Surveys of German transport companies (Öko-Institut ELV-Live, 2024–2026), fleet surveys (McKinsey, Daimler Truck), industry body (IRU) | Some samples are small or not representative (flagged per source) |
| Case studies | Fleet-planning studies and deployments (Fraunhofer ISI/Einride with REWE; PTV with DB Schenker and TSN Groen) | Some are vendor-sponsored, so may overstate software benefits |
| Market check | Competitors, truck makers' own tools, software price levels | Prices from comparison sites and vendor pages, not quotes |
| Primary research | **Not done yet.** Plan in §6 | — |

**Source quality key:** 🟢 independent research or official data · 🟡 industry survey, not representative, or secondary summary · 🟠 vendor-sponsored or marketing case study

---

## 2. Market context: why this problem exists now

| ID | Evidence | Source |
|---|---|---|
| E-01 | E-trucks are growing fast from a low base. In H1 2026, "electrically chargeable" trucks (ACEA's category, which also includes plug-in hybrids) were **4.8%** of new EU truck registrations (up from 3.6%), growing **+47.7%**. **Diesel was still 92.1%.** Germany, the Netherlands and France made up **74%** of EU e-truck registrations; Germany's grew **+88.5%**. | S-01 🟡 |
| E-02 | The installed base is still tiny: e-trucks were about **0.3% of all trucks on EU roads in 2024**, and the average truck stays in the fleet for about 14 years. Mixed diesel/electric fleets will therefore be normal for many years. | S-21 🟡 |
| E-03 | EU CO₂ standards for new heavy-duty vehicles (Reg. (EU) 2024/1610) require fleet-average CO₂ cuts of **−45% from 2030, −65% from 2035 and −90% from 2040**, measured against a 2019/2020 reference period. These targets bind truck makers, which pushes them to sell zero-emission trucks. | S-03 🟢 |
| E-04 | Germany exempts zero-emission trucks from the truck toll until **30 June 2031**. From 1 July 2031, EU rules (Eurovignette Directive) allow member states a discount of **at most 75%** for zero-emission trucks; Germany has not yet decided its post-2031 rate. | S-04 🟢, S-05 🟡 |
| E-05 | German diesel toll (Euro VI, CO₂ class 1): about **34.8 ct/km** for a truck over 18 t with 5+ axles, of which about **15.8 ct/km** is the CO₂ surcharge. Lighter trucks pay much less: about **17.8 ct/km for 7.5–12 t**. | S-06 🟢, S-07 🟡 |
| E-06 | ICCT (Sept 2026): in Germany, battery-electric regional and long-haul trucks **have already reached total-cost-of-ownership (TCO) parity** with diesel, **helped by the toll exemption**. Long-haul e-trucks are reported **about 11% cheaper** to own and run. | S-08 🟢 |
| E-07 | Europe has about **502,000 unfilled truck-driver positions (13% shortage)**; **65%** of European operators rank driver shortage as their top concern. | S-09 🟢 |
| E-08 | Public truck charging is building up but still thin. Milence (the joint venture of Daimler Truck, Traton and Volvo) runs **39 hubs** (Oct 2026), targets **50 by end of 2026 and 90 by 2028**. | S-10 🟢, S-11 🟡 |
| E-09 | The industry is fragmented: Eurostat-based data (mid-2010s) counts about **550,000 mostly small road-haulage firms, averaging ~5 employees**. E-truck pioneers are mostly larger: **74% have 50+ employees**. | S-12 🟢 (older data), S-13 🟢 |

---

## 3. Evidence on how e-trucks are actually used

### 3.1 Range is better than planners think, but it varies
| ID | Evidence | Source |
|---|---|---|
| E-10 | ICCT field data on **91 electric tractor-trailers** at European fleets: real-world range averaged **11–19% above** the manufacturer's stated figure (+11% multimodal, +15% shuttle, +19% multi-stop regional distribution). | S-14 🟢 |
| E-11 | German long-term e-truck users report that range **can exceed** the manufacturer's figure, but that it **varies with the weather, especially in winter, which limits planning**. Early users complained about **inaccurate range estimates**. | S-13 🟢 |
| E-12 | McKinsey survey of 400 fleet operators in France, Germany, Italy, the UK and the US (Q4 2023): **limited range was the most-named concern** about battery-electric trucks (15%), followed by **long charging time** (12%). | S-15 🟡 |

### 3.2 Fleets charge cautiously and buy bigger batteries than they use
| ID | Evidence | Source |
|---|---|---|
| E-13 | ICCT, 1,200+ charging sessions: **58% started with the battery above 50%**, and 83% ended above 90%. Average **depth of discharge per charging cycle was only 44%**. ICCT concludes the trucks **had oversized batteries**, bought to cover worst-case days, which raises purchase cost. *Note:* trucks often charge more than once a day, so 44% per cycle does not by itself mean half the battery is unused over a whole day. | S-14 🟢 |
| E-14 | Geotab telematics (report covering 1.3M+ vehicles, mainly light commercial vehicles and cars): **45% of European** (65% of North American) EV charging sessions happen **before the battery drops to half**. Geotab calls this a missed opportunity to use EVs fully. | S-16 🟢 |
| E-15 | ICCT: only **9% of depot charging sessions were overnight**. Most charging happened midday after morning rounds, when electricity is often more expensive than at night. | S-14 🟢 |

### 3.3 Planning, not the truck, is now the bottleneck
| ID | Evidence | Source |
|---|---|---|
| E-16 | Öko-Institut (ELV-Live, 2026): for **long-term users** (12+ months), the main problems move from the vehicle to **process and infrastructure**. **Restrictions on route planning** are their most-cited drawback, followed by a lack of public charging and limited grid connections. | S-13 🟢 |
| E-17 | Same study, representative industry sample (n = 204, **95% of whom do not yet run e-trucks**): **57% expect resistance from dispatchers**, and only **3%** expect dispatchers to prefer e-trucks. Interviews suggest dispatchers rate e-trucks **less positively than drivers do**, although hands-on experience was generally positive. *This is an expectation, mostly from non-users, not measured resistance.* | S-13 🟢 |
| E-18 | Fraunhofer ISI with Einride, using REWE's Berlin-area data (38,000+ shipments, 200+ vehicles, 500+ sites): **replacing diesel trucks one for one** let e-trucks carry **57% of payload and 32% of km**. **Re-planning the whole fleet** raised this to **85% and 54%**, and cut fleet TCO by **8–13% vs. an all-diesel fleet** (about 3% for the one-for-one approach). Fraunhofer concludes that fleet-level route and charging planning matters more than bigger batteries. | S-17 🟢/🟠 (co-authored with a planning-software vendor) |
| E-19 | DB Schenker / PTV pilot (Berlin, from 2018, mixed fleet with three e-trucks): orders were assigned to an e-truck only if it could do the job **as reliably as a diesel**. The **dispatcher must be able to add orders that arrive during the day**, taking each e-truck's **remaining range** into account. | S-18 🟠 |
| E-20 | TSN Groen (Netherlands, ~120 trucks, about half electric): planning moved from the planner drawing routes to **the software proposing a plan that the planner checks and adjusts**. Large parcels go to the e-trucks first; the rest goes to diesels. | S-19 🟠 |

### 3.4 Charging has to fit around drivers' legal breaks and the depot
| ID | Evidence | Source |
|---|---|---|
| E-21 | EU Reg. 561/2006 requires a **45-minute break after 4.5 h of driving**. Charging can count as a break **if the driver is free** and doesn't have to supervise it (CORTE guidance). But **moving a fully charged truck off the charger can interrupt the rest period**, so operators try to finish charging before the shift ends, which **limits route-planning flexibility**. | S-20 🟡 |
| E-22 | German pioneers get about **82% of their e-truck energy from the depot**, paying on average **~24 ct/kWh** there versus **~49 ct/kWh** at public chargers. About two-thirds generate some of their own power, e.g. with solar panels. | S-13 🟢 |
| E-23 | Daimler survey (n = 197, UK/DE/FR, not representative): **61%** see **uncertain charging access** as a drawback, while **over 40%** already believe e-trucks are cheaper than diesel over their working life. Among non-users in the Öko-Institut sample, **charging infrastructure (50%)** is named as the main hurdle more often than vehicle cost (39%). | S-02 🟡, S-13 🟢 |

### 3.5 Managers often lack the numbers
| ID | Evidence | Source |
|---|---|---|
| E-24 | Öko-Institut: **57%** of companies assume e-trucks have a higher TCO than diesel, but **61% of those have never run a TCO comparison**. **54% don't know their grid electricity price.** | S-13 🟢 |
| E-25 | Companies that actually run e-trucks are positive: **93% of long-term users are satisfied** (47% "very satisfied"), and 93% expect e-trucks to be in wide use in their company by 2030. Satisfaction rises the longer companies use them. | S-13 🟢 |

### 3.6 Market reality checks (evidence that limits our case)
| ID | Evidence | Source |
|---|---|---|
| E-26 | **Most adopters run only a few e-trucks.** The 57 Öko-Institut pioneers run about 300 e-trucks in total (roughly 5 each). Example: Metzger Spedition has 30 trucks, 5 of them battery-electric. | S-13 🟢, S-22 🟡 |
| E-27 | **Truck makers offer their own planning tools, partly free.** Volvo's Range & Route predicts range and plans charging stops; every new Volvo e-truck includes a two-year subscription (about 5,100 trucks use it). Mercedes-Benz offers Fleetboard Charge Management; MAN offers a range calculator. Each covers its own brand only. | S-23 🟢, S-24 🟢 |
| E-28 | **Funded competitors exist.** FRYTE Mobility (Munich) raised €3.5M (total €5M, Sept 2026) for an e-truck planning and charging-booking tool aimed at dispatchers. Volteum raised €2.5M for mixed-fleet management. Einride sells AI planning ("Saga") and co-authored E-18. PTV and HERE have added e-truck profiles to route planning. | S-25 🟡, S-26 🟡, S-17, S-19 |
| E-29 | **Software price levels are low.** Fleet-management software typically costs about **$20–60 per vehicle per month**; carrier dispatch systems start at around **€6 per truck per month**. | S-27 🟠, S-28 🟡 |

---

## 4. Key insights

Format (workshop template): **[persona] wants [action] because [need/outcome], but [obstacle].**

### KI-01: Uncertain range makes planners cautious with e-trucks
> **The dispatcher** wants to give the electric trucks longer, higher-value tours, **because** every kilometre driven electric on a toll road is toll-free (up to ~35 ct/km on a heavy truck) and puts an expensive asset to work, **but** he can't fully trust the range estimate, which changes with load and weather, and a truck stranded mid-tour is his responsibility.

- **Evidence:** E-05, E-10, E-11, E-12, E-13, E-14
- **Confidence:** 🟢 High that fleets charge cautiously and over-buy battery capacity (E-13, E-14). 🟡 Medium that this comes from *dispatchers' job choices*. That link is our inference and is the first thing to test in interviews (A1).
- **Product implication:** a **range forecast with an explicit safety buffer** for each truck and job (adjusted for load, temperature and terrain), with the reasoning shown in plain language.

### KI-02: Swapping trucks one for one leaves e-km on the table
> **The dispatcher** wants one plan for diesel and electric trucks together, **because** his fleet will stay mixed for years (diesel is still ~92% of new trucks and e-trucks ~0.3% of the fleet), **but** the default approach is to swap one diesel tour for one e-truck, which uses much less of the e-truck's potential than re-planning the fleet.

- **Evidence:** E-01, E-02, E-16, E-18, E-19, E-20
- **Confidence:** 🟢 High that fleet-level planning beats one-for-one swaps (32% vs 54% of km in one large study). 🟡 Medium on how many fleets still plan one for one; planning vendors (PTV, Einride, FRYTE) already address this (E-28).
- **Product implication:** a **fleet-level job matcher** that assigns jobs across the whole mixed fleet and fills e-trucks first, across all truck brands.

### KI-03: Dispatchers have to trust the plan, or they won't use it
> **The head of operations** wants dispatchers to use the e-trucks on every suitable job, **because** the higher purchase price only pays back through use, **but** the industry expects dispatchers to be sceptical of e-trucks, and a "black box" plan they can't check is likely to be overridden.

- **Evidence:** E-17, E-20, E-25
- **Confidence:** 🟡 Medium. 57% of companies *expect* dispatcher resistance, but most of them don't run e-trucks yet, and actual users are positive (E-25). The "software proposes, planner checks" workflow is from a single vendor case.
- **Product implication:** **suggestions with reasons** ("why this truck can do this job"), easy **manual override**, and tracking of how often suggestions are accepted. The dispatcher stays in control.

### KI-04: Charging has to fit into breaks and depot time, not add stops
> **The dispatcher** wants charging to happen at the depot and during drivers' legally required breaks, **because** with a 13% driver shortage every extra stop costs scarce driver hours, and depot power costs about half as much as public charging, **but** public truck chargers are still scarce, and the EU rest rules make it awkward to move a charged truck.

- **Evidence:** E-07, E-08, E-15, E-21, E-22, E-23
- **Confidence:** 🟢 High
- **Product implication:** a **charging planner that uses the depot first**, places any public charging inside the 45-minute breaks, and flags when charging would end after the driver's shift.

### KI-05: Management can't easily see whether the e-trucks pay off
> **The head of operations / owner** wants to know whether the e-trucks are earning back their cost, **because** they are judged on cost per km and on-time delivery, **but** many companies have never compared costs and don't know their own electricity price, so e-trucks keep a reputation for being "expensive".

- **Evidence:** E-06, E-24, E-25
- **Confidence:** 🟢 High that the knowledge gap exists (61% of those who assume e-trucks cost more have never compared; 54% don't know their electricity price).
- **Product implication:** a **weekly report**: electric km driven vs. possible, toll saved, energy cost vs. a diesel equivalent, CO₂ avoided.

---

## 5. Proto-personas (to be validated)

### Primary user: "Stefan", dispatcher (Disponent)
- Regional carrier in North Rhine-Westphalia, ~40 trucks: 8 battery-electric (two brands), the rest diesel
- Plans the next day's jobs each afternoon; re-plans during the day when orders change or deliveries run late
- Measured on on-time delivery and on having no empty or stranded trucks
- Tools today: a transport management system, one telematics portal per truck brand, Excel, phone
- **Pain:** a range he can't fully trust, e-trucks that don't fit his planning routine, being blamed when something goes wrong

### Buyer: "Claudia", head of operations
- Same company; signs off software purchases; reports cost per km to the managing director
- A key customer (retail or grocery) is pushing her to cut Scope 3 emissions
- **Pain:** paid extra for e-trucks and can't prove they are used well

*Note:* with 8 e-trucks, Stefan's company is above the typical adopter today (~5 e-trucks, E-26). That is deliberate: VoltLane targets companies that are scaling up their e-truck fleets.

*Out of scope for the prototype:* truck drivers (they receive the plan), finance/controlling.

---

## 6. What we still need to validate (primary research plan)

| Assumption | Why it's risky | How to test (by 11 Dec) |
|---|---|---|
| A1: Dispatchers give e-trucks cautious jobs mainly because they don't trust the range (KI-01) | Inferred from charging data, not from asking dispatchers | 3–5 interviews with dispatchers at fleets that run e-trucks (LinkedIn, ESCP alumni, associations such as DSLV/BGL) |
| A2: Truck makers' free tools aren't enough for fleets with 5+ e-trucks of mixed brands | If they are enough, VoltLane has no gap to fill (E-27) | Ask in interviews which tools they use and what's missing |
| A3: Dispatchers accept suggestions if the reasons are shown (KI-03) | Evidence is one vendor case | Click-test the prototype's plan screen with 2–3 dispatchers or logistics students |
| A4: Buyers would pay well above typical fleet-software prices (E-29) | Our pitch assumes €180 per e-truck per month | Ask heads of operations what they pay today and what saving would justify more |

**Interview guide (draft, 20 min):**
1. Walk me through how you planned yesterday. When, with which tools, what changed during the day?
2. How do you decide which jobs go to an electric truck? Tell me about the last time you didn't give an e-truck a job it could probably have done.
3. When did an e-truck last come back with a lot of battery left? Or nearly run out?
4. How do you plan charging today? Who decides, and when?
5. Do you use the truck maker's planning tool? What does it not do for you?
6. If software suggested a plan, what would it need to show you before you'd trust it?

---

## 7. Corrections to our earlier pitch deck (Oct 2026)

- **"65% recharged while still over half full" (Geotab)** is the **North American** figure. Geotab's figure for Europe is **45%**; ICCT's European e-truck data shows **58%** of sessions starting above 50%. → Use the ICCT figure (E-13).
- **"+19% further than promised"** is the **upper end** of an 11–19% range. → Say "11–19%" (E-10).
- **"30+ ct/km toll"** only holds for **trucks over 18 t**. Medium regional trucks (7.5–12 t) pay about **18 ct/km** (E-05). At our assumed 15,000 extra e-km a year, toll savings are about **€5,200** per heavy truck but only **€2,700** per 7.5–12 t truck, against our €2,160/year fee. Energy savings come on top, but "about 2× back from tolls alone" holds only for heavy trucks.
- **"~35% of sales by 2030"** is not written in the regulation. The law sets a **−45% CO₂** target; the share of zero-emission trucks needed to meet it is an estimate. → Quote the regulation directly (E-03).

---

## 8. What changed in v2

- E-13 and KI-01: "44% depth of discharge" now correctly described **per charging cycle**, not per day; the dispatcher-motive link is marked as our inference.
- E-17 and KI-03: dispatcher resistance is now described as an **expectation from mostly non-user companies**, not measured behaviour.
- KI-05: "most companies never compared TCO" corrected to **61% of those who assume e-trucks cost more**.
- E-12: McKinsey sample corrected to France, Germany, Italy, **UK** and US (the UK is not in the EU).
- E-04: post-2031 toll discount is a **maximum allowed by EU rules**, not a decided German rate.
- E-08: removed the "25,000 e-trucks in 2026" figure, because the source does not make clear whether it means sales or vehicles on the road.
- New §3.6 with evidence that **limits** our case: small fleets (E-26), truck makers' tools (E-27), competitors (E-28), software prices (E-29).

---

## 9. Sources

| ID | Source | Link |
|---|---|---|
| S-01 | ACEA H1 2026 commercial vehicle registrations, via electrive (29 Jul 2026) | https://electrive.com/2026/07/29/acea-reports-strong-growth-for-electric-trucks-and-buses-in-the-eu |
| S-02 | Daimler Truck fleet decision-maker survey (n = 197), via Automotive World (2026) | https://www.automotiveworld.com/?p=508040 |
| S-03 | Regulation (EU) 2024/1610, CO₂ standards for heavy-duty vehicles (EUR-Lex; summary by AECC) | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202401610 · https://aecc.eu/legislation/co2-emission-standards-for-heavy-duty-vehicles |
| S-04 | German Federal Transport Ministry (BMV): toll exemption for zero-emission trucks extended to 30 June 2031 (Dec 2025) | https://www.bmv.de/SharedDocs/DE/Pressemitteilungen/2025/068-schnieder-mautbefreiung-emissionsfreie-lkw-bis-mitte-2031-verlaengert.html |
| S-05 | trans.info: EU toll rules after 2031 (Eurovignette) | https://trans.info/de/eu-mautregeln-was-das-ende-der-gratisfahrt-fuer-elektro-lkw-bedeutet-507866 |
| S-06 | dena position paper on the truck toll (CO₂ component 15.8 ct/km) | https://www.dena.de/fileadmin/dena/Publikationen/PDFs/2023/Positionspapier_Lkw-Maut.pdf |
| S-07 | German toll rates by weight and CO₂ class (Toll Collect rates, compiled) | https://www.bussgeldkatalog.org/news/lkw-maut-fuer-jede-bundesstrasse-gilt-zukuenftig-die-mautpflicht-724922 |
| S-08 | ICCT (Sept 2026): vehicle running costs and truck TCO parity; electrive summary | https://theicct.org/?p=95878 · https://electrive.com/2026/09/07/evs-now-33-cheaper-to-run-than-gasoline-vehicles |
| S-09 | IRU Global Driver Shortage Report 2025, via trans.info | https://trans.info/en/europe-driver-vacancies-487252 |
| S-10 | electrive: Milence opens hub in Belgium, 39 hubs (Oct 2026) | https://electrive.com/2026/10/24/milence-opens-truck-charging-hub-with-four-mcs-chargers-in-belgium |
| S-11 | Milence fact sheet (Apr 2026) | https://milence.com/app/uploads/2026/04/Milence-Fact-Sheet_General-EN.pdf |
| S-12 | Eurofound working paper on road haulage structure (Eurostat SBS data) | https://www.eurofound.europa.eu/system/files/2020-01/wpef17003.pdf |
| S-13 | Öko-Institut, *ELV-Live: Between Orientation and Optimization* (June 2026) | https://www.oeko.de/fileadmin/oekodoc/ELV-Live_Between-Orientation-and-Optimization.pdf |
| S-14 | ICCT, *Real-world use cases for zero-emission trucks: heavy tractor-trailers in the EU* (Aug 2025); trans.info summary | https://theicct.org/publication/rw-use-cases-for-zet-heavy-tractor-trailers-for-goods-transport-in-the-eu-aug25/ · https://trans.info/en/electric-lorries-study-417142 |
| S-15 | McKinsey, *Range anxiety on the road to zero emissions* (survey Q4 2023) | https://www.mckinsey.com/featured-insights/week-in-charts/range-anxiety-on-the-road-to-zero-emissions |
| S-16 | Geotab, *Taking Charge* report (2024) | https://www.geotab.com/press-release/2024-taking-charge-report/ |
| S-17 | Fraunhofer ISI & Einride, fleet-level planning study (REWE data, 2025) | https://publica.fraunhofer.de/handle/publica/487013 · https://trans.info/ai-planning-cuts-costs-412654 |
| S-18 | PTV blog: iHub mixed-fleet project with DB Schenker, Berlin | https://blog.ptvgroup.com/en/city-and-mobility/electric-truck-urbane-logistics/ |
| S-19 | PTV customer story: TSN Groen | https://www.ptvlogistics.com/en/about/our-customers/tsn-groen |
| S-20 | trans.info: EU rest rules and e-truck charging (2026) | https://trans.info/en/electric-truck-charging-3-478349 |
| S-21 | trans.info: e-trucks 4.8% of registrations vs 0.3% of the fleet | https://trans.info/de/elektro-lkw-legen-zu-diesel-bleibt-dominant-497651 |
| S-22 | Transport-Online: Webfleet and Metzger Spedition at IAA Transportation 2026 | https://transport-online.de/news/iaa-transportation-2026-webfleet-zeigt-datenbasierte-elektrifizierung-von-lkw-flotten-193765.html |
| S-23 | Volvo Group: Range & Route | https://www.volvogroup.com/en/about-us/organization/volvo-group-connected-solutions/digital-services/freeing-fleet-managers-of-range-anxiety.html |
| S-24 | Mercedes-Benz Trucks: eActros digital services (Fleetboard Charge Management) | https://mercedes-benz-trucks.com/au/en/trucks/eactros-300-400.html |
| S-25 | Startbase: FRYTE Mobility seed round (Sept 2026); Dealroom profile | https://www.startbase.com/news/fryte-mobility-erhaelt-35-millionen-euro-fuer-e-lkw-ladeplattform/ · https://app.dealroom.co/companies/fryte_mobility |
| S-26 | Pulse: Volteum funding round (June 2026) | https://www.pulse.bot/saas/deals/volteum-raises-275m-in-funding-led-by-movens-capital-219ca278-864a-4cb9-bbd6-77714439dc2a/ |
| S-27 | Geotab: fleet management software cost | https://www.geotab.com/blog/fleet-management-software-cost/ |
| S-28 | European Purpose: Transmetrics TMS pricing | https://europeanpurpose.com/tool/transmetrics |
