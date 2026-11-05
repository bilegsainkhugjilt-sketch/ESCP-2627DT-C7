// Domain model — matches architecture.md §5 and product.md §3.2.
// All records are fictional (NFR-09).

export type Powertrain = 'electric' | 'diesel';
/** heavy = tractor-trailer over 18 t (5 axles); medium = rigid truck 7.5–12 t */
export type WeightClass = 'heavy' | 'medium';
export type TruckStatus = 'available' | 'charging' | 'maintenance';

export interface Truck {
  id: string;
  name: string;
  brand: string;
  powertrain: Powertrain;
  weightClass: WeightClass;
  /** electric only */
  batteryKWh?: number;
  socPercent?: number;
  reservePercent?: number;
  efficiencyKWhPerKm?: number;
  capacityKg: number;
  status: TruckStatus;
  driverId: string;
}

export interface Job {
  id: string;
  customer: string;
  route: string;
  distanceKm: number;
  tollRoadKm: number;
  payloadKg: number;
  stops: number;
  /** "HH:MM" */
  windowStart: string;
  windowEnd: string;
}

export interface Driver {
  id: string;
  name: string;
  shiftStart: string;
  shiftEnd: string;
}

export interface Charger {
  id: string;
  name: string;
  kind: 'depot' | 'public';
  powerKw: number;
  pricePerKWh: number;
  available: boolean;
}

export type AssignmentStatus = 'proposed' | 'approved' | 'overridden';

export type FeasibilityReason =
  | 'fits'
  | 'fits-with-break-charge'
  | 'too-heavy'
  | 'not-enough-energy'
  | 'not-available'
  | 'time-conflict'
  | 'diesel';

export interface BreakCharge {
  chargerId: string;
  start: string;
  end: string;
  energyKWh: number;
  endsAfterShift: boolean;
}

export interface Assignment {
  jobId: string;
  truckId: string | null;
  driverId: string | null;
  status: AssignmentStatus;
  reason: FeasibilityReason | 'no-truck-free';
  explanation: string;
  energyKWh?: number;
  reserveAfterPercent?: number;
  breakCharge?: BreakCharge;
  /** true when the dispatcher confirmed an assignment that fails the safety check (FR-13) */
  acceptedDespiteWarning?: boolean;
  /** set on proposals that replace an approved assignment after a disruption (US-07) */
  replaces?: string;
}

export interface Scenario {
  temperatureC: number;
  /** job id that has a road closure / detour */
  delayedJobId: string | null;
  chargerOutage: boolean;
}

export interface HistoryDay {
  date: string;
  /** per truck: km driven, km of that on toll roads */
  trucks: { truckId: string; km: number; tollKm: number; possibleKm?: number }[];
}
