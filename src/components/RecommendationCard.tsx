// One decision row: job, truck, the reason, an energy bar, and actions (US-04, US-05, FR-09–FR-13).
// The left edge repeats the board's rule: hatched = proposed, solid = approved.
import type { Assignment, Job, Truck } from '../types/domain';
import { Button, StatusBadge } from './ui';

export interface CardProps {
  assignment: Assignment;
  job: Job;
  truck?: Truck;
  distanceKm: number;
  selected?: boolean;
  onApprove?: () => void;
  onReassign?: () => void;
}

/** Needed vs available energy above the reserve (FR-09). */
export function EnergyBar({ a, truck }: { a: Assignment; truck?: Truck }) {
  if (!truck) return <div className="energy"><span>No truck assigned</span></div>;
  if (truck.powertrain !== 'electric') return <div className="energy"><span>Diesel: no battery limit</span></div>;
  const b = truck.batteryKWh ?? 0;
  const need = a.energyKWh ?? 0;
  const brk = a.breakCharge?.energyKWh ?? 0;
  const left = ((a.reserveAfterPercent ?? 0) - (truck.reservePercent ?? 15)) / 100 * b;
  const own = need + left - brk; // available before any break charge
  const short = Math.max(0, -left);
  const total = Math.max(own + brk, need);
  const w = (n: number) => `${(Math.max(0, n) / total) * 100}%`;
  return (
    <div className="energy">
      <div className="energy-track" role="img" aria-label={`Needs ${Math.round(need)} kWh of ${Math.round(own + brk)} kWh available above the reserve`}>
        <div className="energy-need" style={{ width: w(need - short) }} />
        {short > 0 && <div className="energy-short" style={{ width: w(short) }} />}
        {left > 0 && <div className="energy-left" style={{ width: w(left) }} />}
      </div>
      <span>
        {short > 0
          ? `${Math.round(short)} kWh short of the reserve`
          : brk
            ? `Needs ${Math.round(need)} kWh: ${Math.round(own)} on board + ${Math.round(brk)} charged`
            : `Needs ${Math.round(need)} of ${Math.round(own)} kWh on board`}
      </span>
    </div>
  );
}

export function RecommendationCard({ assignment: a, job, truck, distanceKm, selected = false, onApprove, onReassign }: CardProps) {
  const kind = !truck ? 'none' : truck.powertrain === 'electric' ? 'ev' : 'diesel';
  const ink = a.status === 'proposed' ? 'pencil' : 'ink';
  const t = (job.payloadKg / 1000).toFixed(1).replace(/\.0$/, '');
  const [from, to] = [job.route.split(' → ')[0], job.route.split(' → ')[1] ?? ''];

  return (
    <article className={`decision ${selected ? 'selected' : ''}`} id={`decision-${job.id}`} aria-label={`${job.id} ${a.status}`}>
      <div className={`edge ${kind === 'none' ? 'none' : `${ink} ${kind}`}`} aria-hidden="true" />
      <div className="job">
        <b>{job.id}</b>
        <span className="meta">{to ? `${from} to ${to}` : from}</span>
        <span className="meta">{Math.round(distanceKm)} km, {t} t, {job.stops} stops</span>
      </div>
      <div className="truck">
        <b>{truck ? truck.name : 'No truck'}</b>{' '}
        {truck && <StatusBadge tone={truck.powertrain === 'electric' ? 'accent' : 'neutral'}>{truck.powertrain === 'electric' ? 'Electric' : 'Diesel'}</StatusBadge>}
        <span className="meta">{job.windowStart}–{job.windowEnd}</span>
      </div>
      <div>
        <p className="why">{a.explanation}</p>
        <div className="flags">
          {a.status === 'approved' && <StatusBadge tone="dark">Approved</StatusBadge>}
          {a.status === 'overridden' && <StatusBadge tone="action">Changed by you</StatusBadge>}
          {a.replaces && <StatusBadge tone="warning">Replaces an approved job</StatusBadge>}
          {a.breakCharge?.endsAfterShift && <StatusBadge tone="warning">Charging ends after the driver's shift</StatusBadge>}
          {a.acceptedDespiteWarning && <StatusBadge tone="danger">Below safety reserve</StatusBadge>}
        </div>
      </div>
      <EnergyBar a={a} truck={truck} />
      <div className="acts">
        {onApprove && <Button variant="primary" onClick={onApprove} aria-label={`Approve ${job.id}`}>Approve</Button>}
        {onReassign && <Button onClick={onReassign} aria-label={`Reassign ${job.id}`}>Reassign</Button>}
      </div>
    </article>
  );
}
