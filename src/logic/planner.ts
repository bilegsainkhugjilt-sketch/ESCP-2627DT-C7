// Planner and re-planner (architecture.md §7; US-03, US-04, US-05, US-07; FR-06–FR-13, FR-17, FR-18).
// Fleet-level rule (KI-02): jobs longest first; each goes to the feasible e-truck with the
// smallest energy margin left (best fit); e-trucks first, diesels for the rest.
// The system only PROPOSES; the dispatcher approves (NFR-05, NFR-07).
import { BREAK_MINUTES, DRIVING_BEFORE_BREAK_MIN, TURNAROUND_MIN } from '../data/constants';
import type {
  Assignment, BreakCharge, Charger, Driver, FeasibilityReason, Job, Scenario, Truck,
} from '../types/domain';
import { effectiveDistanceKm, energyNeededKWh, socAfterPercent, usableEnergyKWh } from './range';
import { overlaps, toHHMM, toMin } from './time';

export interface PlanContext {
  trucks: Truck[];
  jobs: Job[];
  drivers: Driver[];
  chargers: Charger[];
  scenario: Scenario;
}

interface TruckDay {
  energyUsed: number;
  breakEnergy: number;
  breakChargeUsed: boolean;
  windows: [number, number][];
}

export interface Evaluation {
  truck: Truck;
  reason: FeasibilityReason;
  energyKWh?: number;
  availableKWh?: number;
  marginKWh?: number;
  reserveAfterPercent?: number;
  breakCharge?: BreakCharge;
}

const r = (n: number) => Math.round(n);
const tonnes = (kg: number) => (kg / 1000).toFixed(1).replace(/\.0$/, '');

function newDays(trucks: Truck[]): Map<string, TruckDay> {
  return new Map(trucks.map((t) => [t.id, { energyUsed: 0, breakEnergy: 0, breakChargeUsed: false, windows: [] }]));
}

function window(job: Job): [number, number] {
  return [toMin(job.windowStart), toMin(job.windowEnd)];
}

/** Book assignments in time order, so a truck's energy is used in the order it drives. */
function byStartTime(list: Assignment[], ctx: PlanContext): Assignment[] {
  const start = (a: Assignment) => toMin(ctx.jobs.find((j) => j.id === a.jobId)!.windowStart);
  return [...list].sort((a, b) => start(a) - start(b));
}

function breakSlot(job: Job, driver: Driver | undefined, energyKWh: number, charger: Charger): BreakCharge {
  const [s, e] = window(job);
  const dur = e - s;
  const start = s + Math.min(DRIVING_BEFORE_BREAK_MIN, Math.max(60, Math.round((dur - BREAK_MINUTES) / 2)));
  const end = start + BREAK_MINUTES;
  return {
    chargerId: charger.id,
    start: toHHMM(start),
    end: toHHMM(end),
    energyKWh,
    endsAfterShift: driver ? end > toMin(driver.shiftEnd) : false,
  };
}

/** Can this truck do this job, given what it already does today? (FR-07, FR-09, FR-10) */
export function evaluateTruck(job: Job, truck: Truck, day: TruckDay, ctx: PlanContext): Evaluation {
  if (truck.status !== 'available') return { truck, reason: 'not-available' };
  if (job.payloadKg > truck.capacityKg) return { truck, reason: 'too-heavy' };
  if (day.windows.some((w) => overlaps(w, window(job), TURNAROUND_MIN))) return { truck, reason: 'time-conflict' };
  if (truck.powertrain === 'diesel') return { truck, reason: 'diesel' };

  const need = energyNeededKWh(job, truck, ctx.scenario);
  const avail = usableEnergyKWh(truck) - day.energyUsed + day.breakEnergy;
  if (need <= avail) {
    return {
      truck, reason: 'fits', energyKWh: need, availableKWh: avail, marginKWh: avail - need,
      reserveAfterPercent: socAfterPercent(truck, day.energyUsed - day.breakEnergy + need),
    };
  }
  const pub = ctx.chargers.find((c) => c.kind === 'public');
  if (!day.breakChargeUsed && pub && pub.available) {
    const add = (pub.powerKw * BREAK_MINUTES) / 60;
    if (need <= avail + add) {
      const driver = ctx.drivers.find((d) => d.id === truck.driverId);
      return {
        truck, reason: 'fits-with-break-charge', energyKWh: need, availableKWh: avail, marginKWh: avail + add - need,
        reserveAfterPercent: socAfterPercent(truck, day.energyUsed - day.breakEnergy + need - add),
        breakCharge: breakSlot(job, driver, add, pub),
      };
    }
  }
  return { truck, reason: 'not-enough-energy', energyKWh: need, availableKWh: avail };
}

function book(day: TruckDay, job: Job, ev: Evaluation) {
  day.windows.push(window(job));
  day.energyUsed += ev.energyKWh ?? 0;
  if (ev.breakCharge) {
    day.breakChargeUsed = true;
    day.breakEnergy += ev.breakCharge.energyKWh;
  }
}

/** One plain-language sentence per proposal (NFR-04, design.md §3.2). */
export function explain(ev: Evaluation): string {
  const t = ev.truck;
  if (ev.reason === 'fits') {
    return `${t.name} can do this: needs ${r(ev.energyKWh!)} kWh, has ${r(ev.availableKWh!)} kWh above the ${t.reservePercent}% reserve, so it arrives with ${r(ev.reserveAfterPercent!)}% left.`;
  }
  if (ev.reason === 'fits-with-break-charge') {
    return `${t.name} can do this with a 45-min charge during the driver's break (+${r(ev.breakCharge!.energyKWh)} kWh, ${ev.breakCharge!.start}–${ev.breakCharge!.end}); it arrives with ${r(ev.reserveAfterPercent!)}% left.`;
  }
  return '';
}

/** Why no e-truck got the job (FR-10). */
function whyNotElectric(job: Job, evs: Evaluation[], ctx: PlanContext): string {
  const electric = evs.filter((e) => e.truck.powertrain === 'electric' && e.reason !== 'not-available');
  if (electric.length === 0) return 'No electric truck is available today.';
  if (electric.every((e) => e.reason === 'too-heavy')) {
    const maxCap = Math.max(...electric.map((e) => e.truck.capacityKg));
    return `Too heavy for the free e-trucks (${tonnes(job.payloadKg)} t vs ${tonnes(maxCap)} t capacity).`;
  }
  const short = electric.filter((e) => e.reason === 'not-enough-energy');
  if (short.length > 0) {
    const best = short.reduce((a, b) => ((a.availableKWh ?? 0) >= (b.availableKWh ?? 0) ? a : b));
    const pub = ctx.chargers.find((c) => c.kind === 'public');
    const charge = pub?.available ? ' (even with a 45-min break charge)' : ' (no public charger available for a break charge)';
    return `No e-truck can do this safely: it needs ${r(best.energyKWh!)} kWh; the best available has ${r(best.availableKWh!)} kWh above the reserve${charge}.`;
  }
  return 'The suitable e-trucks are already busy at this time.';
}

function assignmentFrom(job: Job, ev: Evaluation, explanation: string): Assignment {
  return {
    jobId: job.id,
    truckId: ev.truck.id,
    driverId: ev.truck.driverId,
    status: 'proposed',
    reason: ev.reason,
    explanation,
    energyKWh: ev.energyKWh,
    reserveAfterPercent: ev.reserveAfterPercent,
    breakCharge: ev.breakCharge,
  };
}

/** Plan all jobs that are not locked (FR-06, FR-07, FR-08). */
export function planDay(ctx: PlanContext, locked: Assignment[] = []): Assignment[] {
  const days = newDays(ctx.trucks);
  for (const a of byStartTime(locked, ctx)) {
    const job = ctx.jobs.find((j) => j.id === a.jobId);
    const truck = ctx.trucks.find((t) => t.id === a.truckId);
    if (!job || !truck) continue;
    const day = days.get(truck.id)!;
    const ev = evaluateTruck(job, truck, day, ctx);
    // a dispatcher override is booked even if it fails the check (FR-13)
    book(day, job, ev.reason === 'not-enough-energy'
      ? { ...ev, energyKWh: energyNeededKWh(job, truck, ctx.scenario) }
      : ev);
  }

  const lockedIds = new Set(locked.map((a) => a.jobId));
  const open = ctx.jobs
    .filter((j) => !lockedIds.has(j.id))
    .sort((a, b) => effectiveDistanceKm(b, ctx.scenario) - effectiveDistanceKm(a, ctx.scenario));

  const proposals: Assignment[] = [];
  for (const job of open) {
    const evs = ctx.trucks.map((t) => evaluateTruck(job, t, days.get(t.id)!, ctx));
    const byMargin = (a: Evaluation, b: Evaluation) => (a.marginKWh ?? 0) - (b.marginKWh ?? 0);
    const direct = evs.filter((e) => e.reason === 'fits').sort(byMargin);
    const withCharge = evs.filter((e) => e.reason === 'fits-with-break-charge').sort(byMargin);
    const pick = direct[0] ?? withCharge[0];
    if (pick) {
      book(days.get(pick.truck.id)!, job, pick);
      proposals.push(assignmentFrom(job, pick, explain(pick)));
      continue;
    }
    const why = whyNotElectric(job, evs, ctx);
    const diesel = evs.find((e) => e.reason === 'diesel');
    if (diesel) {
      book(days.get(diesel.truck.id)!, job, diesel);
      proposals.push(assignmentFrom(job, diesel, `${why} Assigned to diesel ${diesel.truck.name}.`));
    } else {
      proposals.push({
        jobId: job.id, truckId: null, driverId: null, status: 'proposed', reason: 'no-truck-free',
        explanation: `${why} No truck is free at this time — needs manual planning.`,
      });
    }
  }

  const all = [...locked, ...proposals];
  return ctx.jobs.map((j) => all.find((a) => a.jobId === j.id)!).filter(Boolean);
}

/**
 * Re-plan after a change (US-07, FR-18, NFR-07).
 * Approved assignments that still pass the check stay unchanged. Approved assignments that no longer
 * pass become new PROPOSALS that say what they replace — nothing changes without confirmation.
 */
export function replan(previous: Assignment[], ctx: PlanContext): Assignment[] {
  const settled = byStartTime(previous.filter((a) => a.status !== 'proposed' && a.truckId), ctx);
  const days = newDays(ctx.trucks);
  const kept: Assignment[] = [];
  const broken = new Map<string, string>();

  for (const a of settled) {
    const job = ctx.jobs.find((j) => j.id === a.jobId)!;
    const truck = ctx.trucks.find((t) => t.id === a.truckId)!;
    const day = days.get(truck.id)!;
    const ev = evaluateTruck(job, truck, day, ctx);
    const ok = ev.reason === 'fits' || ev.reason === 'fits-with-break-charge' || ev.reason === 'diesel';
    if (ok || (a.acceptedDespiteWarning && ev.reason === 'not-enough-energy')) {
      book(day, job, ok ? ev : { ...ev, energyKWh: ev.energyKWh });
      kept.push({
        ...a,
        reason: ok ? ev.reason : a.reason,
        energyKWh: ev.energyKWh,
        reserveAfterPercent: ok ? ev.reserveAfterPercent : socAfterPercent(truck, day.energyUsed - day.breakEnergy),
        breakCharge: ev.breakCharge,
        explanation: ok
          ? (ev.reason === 'diesel' ? a.explanation : explain(ev))
          : a.explanation,
      });
    } else {
      const detail = ev.reason === 'not-enough-energy'
        ? `now needs ${r(ev.energyKWh!)} kWh but has only ${r(ev.availableKWh!)} kWh above the reserve`
        : 'the truck is no longer available';
      broken.set(a.jobId, `Replaces approved ${truck.name} (no longer feasible: ${detail}).`);
    }
  }

  return planDay(ctx, kept).map((a) =>
    broken.has(a.jobId) && a.status === 'proposed'
      ? { ...a, replaces: broken.get(a.jobId), explanation: `${broken.get(a.jobId)} ${a.explanation}` }
      : a,
  );
}

/** Check a dispatcher's manual choice before applying it (FR-12, FR-13). */
export function checkReassign(
  current: Assignment[], jobId: string, truckId: string, ctx: PlanContext,
): { allowed: boolean; warning: string | null; evaluation: Evaluation } {
  const job = ctx.jobs.find((j) => j.id === jobId)!;
  const truck = ctx.trucks.find((t) => t.id === truckId)!;
  const days = newDays(ctx.trucks);
  for (const a of byStartTime(current, ctx)) {
    if (a.jobId === jobId || !a.truckId) continue;
    const j = ctx.jobs.find((x) => x.id === a.jobId)!;
    const t = ctx.trucks.find((x) => x.id === a.truckId)!;
    const ev = evaluateTruck(j, t, days.get(t.id)!, ctx);
    book(days.get(t.id)!, j, { ...ev, energyKWh: ev.energyKWh ?? (t.powertrain === 'electric' ? energyNeededKWh(j, t, ctx.scenario) : 0) });
  }
  const ev = evaluateTruck(job, truck, days.get(truck.id)!, ctx);
  switch (ev.reason) {
    case 'fits':
    case 'fits-with-break-charge':
    case 'diesel':
      return { allowed: true, warning: null, evaluation: ev };
    case 'not-enough-energy':
      return {
        allowed: true,
        warning: `${truck.name} would arrive below its ${truck.reservePercent}% safety reserve (needs ${r(ev.energyKWh!)} kWh, has ${r(ev.availableKWh!)} kWh). Assign anyway?`,
        evaluation: ev,
      };
    case 'too-heavy':
      return { allowed: false, warning: `${truck.name} can carry ${tonnes(truck.capacityKg)} t; this job is ${tonnes(job.payloadKg)} t.`, evaluation: ev };
    case 'time-conflict':
      return { allowed: false, warning: `${truck.name} is already on another job at this time.`, evaluation: ev };
    default:
      return { allowed: false, warning: `${truck.name} is not available today (${truck.status}).`, evaluation: ev };
  }
}

/** Apply a dispatcher's manual choice, then re-plan the remaining proposals. */
export function applyReassign(current: Assignment[], jobId: string, truckId: string, ctx: PlanContext): Assignment[] {
  const { evaluation: ev, warning } = checkReassign(current, jobId, truckId, ctx);
  const job = ctx.jobs.find((j) => j.id === jobId)!;
  const forced = ev.reason === 'not-enough-energy';
  const updated: Assignment = {
    ...assignmentFrom(job, ev, ''),
    status: 'overridden',
    acceptedDespiteWarning: forced,
    reserveAfterPercent: forced ? socAfterPercent(ev.truck, (ev.energyKWh ?? 0) + (usableEnergyKWh(ev.truck) - (ev.availableKWh ?? 0))) : ev.reserveAfterPercent,
    explanation: forced
      ? `Changed by dispatcher despite warning: ${warning?.replace(' Assign anyway?', '')}`
      : `Changed by dispatcher. ${ev.reason === 'diesel' ? `Diesel ${ev.truck.name}.` : explain(ev)}`,
  };
  const next = current.map((a) => (a.jobId === jobId ? updated : a));
  return replan(next, ctx);
}

export function approve(current: Assignment[], jobIds: string[]): Assignment[] {
  return current.map((a) =>
    jobIds.includes(a.jobId) && a.status === 'proposed' && a.truckId ? { ...a, status: 'approved' as const, replaces: undefined } : a,
  );
}
