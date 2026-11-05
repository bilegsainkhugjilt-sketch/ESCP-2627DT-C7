// Charging planner (US-06, FR-14–FR-16): depot first; public charging only inside the 45-min driver break.
import type { Assignment } from '../types/domain';
import type { PlanContext } from './planner';
import { toHHMM, toMin } from './time';

export interface ChargingSession {
  truckId: string;
  kind: 'depot' | 'public';
  start: string;
  end: string;
  energyKWh: number;
  label: string;
  warning?: string;
  suggestion?: string;
}

const RETURN_TO_DEPOT_MIN = 15;

export function buildChargingSchedule(assignments: Assignment[], ctx: PlanContext): ChargingSession[] {
  const depot = ctx.chargers.find((c) => c.kind === 'depot')!;
  const sessions: ChargingSession[] = [];

  for (const truck of ctx.trucks.filter((t) => t.powertrain === 'electric')) {
    const own = assignments
      .filter((a) => a.truckId === truck.id)
      .map((a) => ({ a, job: ctx.jobs.find((j) => j.id === a.jobId)! }))
      .sort((x, y) => toMin(x.job.windowEnd) - toMin(y.job.windowEnd));

    // public charging during the legal break (FR-15) + shift check (FR-16)
    for (const { a, job } of own) {
      if (!a.breakCharge) continue;
      const driver = ctx.drivers.find((d) => d.id === truck.driverId);
      const s: ChargingSession = {
        truckId: truck.id, kind: 'public', start: a.breakCharge.start, end: a.breakCharge.end,
        energyKWh: a.breakCharge.energyKWh, label: `${job.id}: public charge in driver break`,
      };
      if (a.breakCharge.endsAfterShift && driver) {
        const minutes = Math.ceil((a.breakCharge.energyKWh / depot.powerKw) * 60);
        s.warning = `Ends ${a.breakCharge.end}, after the driver's shift ends at ${driver.shiftEnd}.`;
        s.suggestion = `Charge ${Math.round(a.breakCharge.energyKWh)} kWh at the depot before ${job.id} instead (about ${minutes} min at ${depot.powerKw} kW, ${depot.pricePerKWh.toFixed(2)} €/kWh instead of ${ctx.chargers.find((c) => c.kind === 'public')!.pricePerKWh.toFixed(2)} €/kWh).`;
      }
      sessions.push(s);
    }

    // depot charging back to full after the last job (FR-14)
    if (own.length > 0) {
      const last = own[own.length - 1];
      const socEnd = last.a.reserveAfterPercent ?? truck.socPercent ?? 0;
      const energy = ((100 - socEnd) / 100) * (truck.batteryKWh ?? 0);
      const start = toMin(last.job.windowEnd) + RETURN_TO_DEPOT_MIN;
      const end = start + (energy / depot.powerKw) * 60;
      sessions.push({
        truckId: truck.id, kind: 'depot', start: toHHMM(start), end: toHHMM(end),
        energyKWh: energy, label: 'Depot charge to 100% after last job',
      });
    }
  }
  return sessions;
}
