// Constants used by the rules engine and the weekly report.
// Sources: evidence.md (E-xx). Values marked ASSUMPTION are our own simplifications.

import type { WeightClass } from '../types/domain';

/** German truck toll, Euro VI, CO₂ class 1, €/km (E-05). E-trucks pay 0 until 30 Jun 2031 (E-04). */
export const DIESEL_TOLL_EUR_PER_KM: Record<WeightClass, number> = {
  heavy: 0.348, // > 18 t, 5+ axles
  medium: 0.178, // 7.5–12 t
};

/** Electricity prices, €/kWh (E-22) */
export const DEPOT_PRICE_EUR_PER_KWH = 0.24;
export const PUBLIC_PRICE_EUR_PER_KWH = 0.49;

/** ASSUMPTION: diesel consumption (L/100 km) and net diesel price (€/L) for the cost comparison */
export const DIESEL_L_PER_100KM: Record<WeightClass, number> = { heavy: 27, medium: 18 };
export const DIESEL_PRICE_EUR_PER_L = 1.45;

/** ASSUMPTION: energy model (architecture.md §7) */
export const PAYLOAD_FACTOR_MAX_EXTRA = 0.2; // full load uses up to 20% more energy
export const BREAK_MINUTES = 45; // Reg. 561/2006: 45-min break after 4.5 h driving (E-21)
export const DRIVING_BEFORE_BREAK_MIN = 270;
export const TURNAROUND_MIN = 30; // minimum gap between two jobs on the same truck
export const DELAY_EXTRA_KM = 40; // detour added by the "road closure" scenario

/** Weather factor by temperature (ASSUMPTION; winter range loss, E-11) */
export function weatherFactor(temperatureC: number): number {
  if (temperatureC <= -5) return 1.18;
  if (temperatureC <= 0) return 1.12;
  if (temperatureC <= 8) return 1.05;
  return 1.0;
}

export const WEIGHT_CLASS_LABEL: Record<WeightClass, string> = {
  heavy: '> 18 t',
  medium: '7.5–12 t',
};
