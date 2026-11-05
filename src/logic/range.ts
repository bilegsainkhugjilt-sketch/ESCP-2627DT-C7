// Range estimator (architecture.md §7, US-01, FR-02, FR-03).
// A simple, transparent rule — NOT a validated range prediction.
import { DELAY_EXTRA_KM, PAYLOAD_FACTOR_MAX_EXTRA, weatherFactor } from '../data/constants';
import type { Job, Scenario, Truck } from '../types/domain';

/** Energy above the safety reserve at the start of the day (kWh). */
export function usableEnergyKWh(truck: Truck): number {
  if (truck.powertrain !== 'electric') return Infinity;
  const b = truck.batteryKWh ?? 0;
  return (b * ((truck.socPercent ?? 0) - (truck.reservePercent ?? 15))) / 100;
}

/** Distance of a job under the current scenario (a road closure adds a detour). */
export function effectiveDistanceKm(job: Job, scenario: Scenario): number {
  return job.distanceKm + (scenario.delayedJobId === job.id ? DELAY_EXTRA_KM : 0);
}

/** Load factor: a full truck uses up to 20% more energy. */
export function payloadFactor(job: Job, truck: Truck): number {
  return 1 + PAYLOAD_FACTOR_MAX_EXTRA * Math.min(1, job.payloadKg / truck.capacityKg);
}

/** Energy a truck needs for a job (kWh) — FR-02/FR-03: adjusted for temperature and load. */
export function energyNeededKWh(job: Job, truck: Truck, scenario: Scenario): number {
  const eff = truck.efficiencyKWhPerKm ?? 0;
  return effectiveDistanceKm(job, scenario) * eff * weatherFactor(scenario.temperatureC) * payloadFactor(job, truck);
}

/** Predicted range with an empty truck, above the reserve (km). */
export function predictedRangeKm(truck: Truck, scenario: Scenario, energyAvailable = usableEnergyKWh(truck)): number {
  if (truck.powertrain !== 'electric') return Infinity;
  const eff = truck.efficiencyKWhPerKm ?? 1;
  return Math.max(0, energyAvailable / (eff * weatherFactor(scenario.temperatureC)));
}

/** Battery level (%) after using some energy. */
export function socAfterPercent(truck: Truck, energyUsedKWh: number): number {
  const b = truck.batteryKWh ?? 1;
  return (truck.socPercent ?? 0) - (energyUsedKWh / b) * 100;
}
