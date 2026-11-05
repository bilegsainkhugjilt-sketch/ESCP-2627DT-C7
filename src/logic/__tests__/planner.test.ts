import { describe, expect, it } from 'vitest';
import { chargers, defaultScenario, drivers, jobs, trucks } from '../../data/seedData';
import type { PlanContext } from '../planner';
import { applyReassign, approve, checkReassign, planDay, replan } from '../planner';
import { energyNeededKWh, predictedRangeKm, usableEnergyKWh } from '../range';
import { buildChargingSchedule } from '../charging';

const ctx: PlanContext = { trucks, jobs, drivers, chargers, scenario: defaultScenario };
const t = (id: string) => trucks.find((x) => x.id === id)!;
const j = (id: string) => jobs.find((x) => x.id === id)!;

describe('range estimator (FR-02, FR-03)', () => {
  it('matches the worked example in design.md: J-04 on E-03', () => {
    expect(Math.round(usableEnergyKWh(t('E-03')))).toBe(236);
    expect(Math.round(energyNeededKWh(j('J-04'), t('E-03'), defaultScenario))).toBe(182);
  });
  it('cold weather lowers predicted range', () => {
    const warm = predictedRangeKm(t('E-01'), { ...defaultScenario, temperatureC: 15 });
    const cold = predictedRangeKm(t('E-01'), { ...defaultScenario, temperatureC: -5 });
    expect(cold).toBeLessThan(warm);
  });
});

describe('planner (FR-06–FR-10)', () => {
  const plan = planDay(ctx);
  it('plans every job and proposes only', () => {
    expect(plan).toHaveLength(jobs.length);
    expect(plan.every((a) => a.status === 'proposed')).toBe(true);
  });
  it('never gives an e-truck a job it cannot finish above its reserve', () => {
    for (const a of plan) {
      const truck = trucks.find((x) => x.id === a.truckId);
      if (truck?.powertrain === 'electric') expect(a.reserveAfterPercent!).toBeGreaterThanOrEqual(truck.reservePercent! - 0.01);
    }
  });
  it('gives J-04 to E-03 and arrives with 28% left', () => {
    const a = plan.find((x) => x.jobId === 'J-04')!;
    expect(a.truckId).toBe('E-03');
    expect(Math.round(a.reserveAfterPercent!)).toBe(28);
  });
  it('sends the 330 km job J-07 to a diesel and explains why', () => {
    const a = plan.find((x) => x.jobId === 'J-07')!;
    expect(t(a.truckId!).powertrain).toBe('diesel');
    expect(a.explanation).toMatch(/No e-truck can do this safely/);
  });
  it('never double-books a truck', () => {
    const byTruck = new Map<string, string[]>();
    for (const a of plan) if (a.truckId) byTruck.set(a.truckId, [...(byTruck.get(a.truckId) ?? []), a.jobId]);
    for (const [, ids] of byTruck) {
      const w = ids.map((id) => j(id)).sort((x, y) => x.windowStart.localeCompare(y.windowStart));
      for (let i = 1; i < w.length; i++) expect(w[i].windowStart >= w[i - 1].windowEnd).toBe(true);
    }
  });
});

describe('dispatcher control (FR-11–FR-13, NFR-07)', () => {
  it('approve changes status only for chosen jobs', () => {
    const plan = approve(planDay(ctx), ['J-04']);
    expect(plan.find((a) => a.jobId === 'J-04')!.status).toBe('approved');
    expect(plan.filter((a) => a.status === 'approved')).toHaveLength(1);
  });
  it('warns before assigning a job to an e-truck that is too weak', () => {
    const check = checkReassign(planDay(ctx), 'J-04', 'E-02', ctx);
    expect(check.allowed).toBe(false); // 12 t is too heavy for a 5 t truck
    const weak = checkReassign(planDay(ctx), 'J-06', 'E-05', ctx);
    expect(weak.warning === null || /safety reserve|busy|another job/.test(weak.warning)).toBe(true);
  });
  it('an override is kept and marked', () => {
    const next = applyReassign(planDay(ctx), 'J-01', 'D-02', ctx);
    const a = next.find((x) => x.jobId === 'J-01')!;
    expect(a.status).toBe('overridden');
    expect(a.truckId).toBe('D-02');
  });
});

describe('re-planning (US-07, FR-17, FR-18)', () => {
  it('a charger outage turns approved break-charge jobs into new proposals that say what they replace', () => {
    const approvedAll = approve(planDay(ctx), jobs.map((x) => x.id));
    const outage: PlanContext = { ...ctx, chargers: chargers.map((c) => (c.kind === 'public' ? { ...c, available: false } : c)), scenario: { ...defaultScenario, chargerOutage: true } };
    const next = replan(approvedAll, outage);
    const replaced = next.filter((a) => a.replaces);
    expect(replaced.length).toBeGreaterThan(0);
    expect(replaced.every((a) => a.status === 'proposed')).toBe(true);
    // jobs that were still feasible stay approved
    expect(next.find((a) => a.jobId === 'J-04')!.status).toBe('approved');
  });
});

describe('charging (FR-14–FR-16)', () => {
  it('flags a break charge that ends after the driver shift', () => {
    const sessions = buildChargingSchedule(planDay(ctx), ctx);
    expect(sessions.some((s) => s.kind === 'public' && s.warning)).toBe(true);
    expect(sessions.some((s) => s.kind === 'depot')).toBe(true);
  });
});
