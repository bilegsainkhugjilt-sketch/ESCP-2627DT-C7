// KPI calculator (US-08, FR-19–FR-21). Works only from approved assignments and history — never
// invents live results. All figures are estimates based on fictional data (NFR-08).
import {
  DEPOT_PRICE_EUR_PER_KWH, DIESEL_L_PER_100KM, DIESEL_PRICE_EUR_PER_L, DIESEL_TOLL_EUR_PER_KM, PUBLIC_PRICE_EUR_PER_KWH,
} from '../data/constants';
import type { Assignment, HistoryDay, Truck } from '../types/domain';
import type { PlanContext } from './planner';
import { effectiveDistanceKm, energyNeededKWh, predictedRangeKm } from './range';

export interface PlanSummary {
  jobs: number;
  electricJobs: number;
  km: number;
  electricKm: number;
  electricShare: number;
  approved: number;
  proposed: number;
}

export function planSummary(assignments: Assignment[], ctx: PlanContext): PlanSummary {
  let km = 0;
  let electricKm = 0;
  let electricJobs = 0;
  for (const a of assignments) {
    const job = ctx.jobs.find((j) => j.id === a.jobId)!;
    const d = effectiveDistanceKm(job, ctx.scenario);
    km += d;
    const truck = ctx.trucks.find((t) => t.id === a.truckId);
    if (truck?.powertrain === 'electric') {
      electricKm += d;
      electricJobs += 1;
    }
  }
  return {
    jobs: assignments.length, electricJobs, km, electricKm,
    electricShare: km ? electricKm / km : 0,
    approved: assignments.filter((a) => a.status !== 'proposed').length,
    proposed: assignments.filter((a) => a.status === 'proposed').length,
  };
}

export interface TruckWeek { truck: Truck; drivenKm: number; possibleKm: number; underUsed: boolean }

export interface WeeklyReport {
  electricKm: number;
  fleetKm: number;
  electricShare: number;
  tollSavedEur: number;
  energySavedEur: number;
  perTruck: TruckWeek[];
  days: string[];
}

function dieselCostPerKm(truck: Truck): number {
  return (DIESEL_L_PER_100KM[truck.weightClass] / 100) * DIESEL_PRICE_EUR_PER_L;
}

/** Weekly report = fictional history (Mon–Wed) + today's approved assignments. */
export function weeklyReport(history: HistoryDay[], assignments: Assignment[], ctx: PlanContext, todayLabel: string): WeeklyReport {
  const settled = assignments.filter((a) => a.status !== 'proposed' && a.truckId);
  const electricTrucks = ctx.trucks.filter((t) => t.powertrain === 'electric');
  let electricKm = 0;
  let fleetKm = 0;
  let tollSaved = 0;
  let energySaved = 0;
  const driven = new Map<string, number>();
  const possible = new Map<string, number>();

  for (const day of history) {
    for (const row of day.trucks) {
      const truck = ctx.trucks.find((t) => t.id === row.truckId)!;
      fleetKm += row.km;
      if (truck.powertrain !== 'electric') continue;
      electricKm += row.km;
      tollSaved += row.tollKm * DIESEL_TOLL_EUR_PER_KM[truck.weightClass];
      const kWh = row.km * (truck.efficiencyKWhPerKm ?? 1);
      energySaved += row.km * dieselCostPerKm(truck) - kWh * DEPOT_PRICE_EUR_PER_KWH;
      driven.set(truck.id, (driven.get(truck.id) ?? 0) + row.km);
      possible.set(truck.id, (possible.get(truck.id) ?? 0) + (row.possibleKm ?? row.km));
    }
  }

  // today: only what the dispatcher approved
  const todayUsed = new Set<string>();
  for (const a of settled) {
    const job = ctx.jobs.find((j) => j.id === a.jobId)!;
    const truck = ctx.trucks.find((t) => t.id === a.truckId)!;
    const km = effectiveDistanceKm(job, ctx.scenario);
    fleetKm += km;
    if (truck.powertrain !== 'electric') continue;
    electricKm += km;
    tollSaved += job.tollRoadKm * DIESEL_TOLL_EUR_PER_KM[truck.weightClass];
    const kWh = energyNeededKWh(job, truck, ctx.scenario);
    const publicKWh = Math.min(kWh, a.breakCharge?.energyKWh ?? 0);
    energySaved += km * dieselCostPerKm(truck) - (publicKWh * PUBLIC_PRICE_EUR_PER_KWH + (kWh - publicKWh) * DEPOT_PRICE_EUR_PER_KWH);
    driven.set(truck.id, (driven.get(truck.id) ?? 0) + km);
    todayUsed.add(truck.id);
  }
  if (settled.length > 0) {
    for (const t of electricTrucks) {
      possible.set(t.id, (possible.get(t.id) ?? 0) + Math.round(predictedRangeKm(t, ctx.scenario)));
    }
  }

  const perTruck = electricTrucks.map((truck) => {
    const d = driven.get(truck.id) ?? 0;
    const p = Math.max(d, possible.get(truck.id) ?? 0);
    return { truck, drivenKm: Math.round(d), possibleKm: Math.round(p), underUsed: p > 0 && d / p < 0.6 };
  });

  return {
    electricKm: Math.round(electricKm),
    fleetKm: Math.round(fleetKm),
    electricShare: fleetKm ? electricKm / fleetKm : 0,
    tollSavedEur: Math.round(tollSaved),
    energySavedEur: Math.round(energySaved),
    perTruck,
    days: [...history.map((h) => h.date), ...(settled.length ? [`${todayLabel} (approved so far)`] : [])],
  };
}
