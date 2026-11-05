// One assignment with its explanation and actions (US-04, US-05; design.md §3.1).
// Proposed = dashed border; approved = dark card; overridden = solid border; not electric / no truck = red.
import type { Assignment, Job, Truck } from '../types/domain';
import { Button, StatusBadge } from './ui';

export interface CardProps {
  assignment: Assignment;
  job: Job;
  truck?: Truck;
  distanceKm: number;
  onApprove?: () => void;
  onReassign?: () => void;
}

/** Card style per design.md §3: proposed (dashed), approved (dark), overridden (solid), not electric (red). */
function cardClass(a: Assignment, truck?: Truck): string {
  if (a.status === 'approved') return 'card-approved';
  if (a.status === 'overridden') return 'card-overridden';
  if (!truck || truck.powertrain === 'diesel') return 'card-infeasible';
  return 'card-proposed';
}

export function RecommendationCard({ assignment: a, job, truck, distanceKm, onApprove, onReassign }: CardProps) {
  const t = (job.payloadKg / 1000).toFixed(1).replace(/\.0$/, '');

  return (
    <article className={`card ${cardClass(a, truck)}`} aria-label={`${job.id} assignment`}>
      <div className="row">
        {a.status === 'proposed' && <StatusBadge tone="accent">Proposed</StatusBadge>}
        {a.status === 'approved' && <StatusBadge tone="dark">Approved</StatusBadge>}
        {a.status === 'overridden' && <StatusBadge tone="neutral">Changed by dispatcher</StatusBadge>}
        {a.replaces && <StatusBadge tone="warning">Replaces approved plan</StatusBadge>}
        {a.reason === 'fits' && <StatusBadge tone="success">Feasible</StatusBadge>}
        {a.reason === 'fits-with-break-charge' && (
          <StatusBadge tone="warning">Feasible with break charge</StatusBadge>
        )}
        {a.reason === 'diesel' && <StatusBadge tone="danger">Not electric</StatusBadge>}
        {a.reason === 'no-truck-free' && <StatusBadge tone="danger">No truck free</StatusBadge>}
        {a.breakCharge?.endsAfterShift && <StatusBadge tone="warning">Charge ends after shift — see Charging</StatusBadge>}
        {a.acceptedDespiteWarning && <StatusBadge tone="warning">Below reserve</StatusBadge>}
      </div>
      <h3>
        {job.id} · {job.route}
      </h3>
      <div className="truckline num">
        {Math.round(distanceKm)} km · {t} t · {job.stops} stops · {job.windowStart}–{job.windowEnd}
        {' · '}
        {truck ? `Truck ${truck.name} · ${truck.powertrain === 'electric' ? 'Electric' : 'Diesel'} · ${truck.brand}` : 'No truck assigned'}
      </div>
      <p className="why">{a.explanation}</p>
      {(onApprove || onReassign) && (
        <div className="row">
          {onApprove && <Button variant="primary" onClick={onApprove} aria-label={`Approve ${job.id}`}>Approve</Button>}
          {onReassign && <Button onClick={onReassign} aria-label={`Reassign ${job.id}`}>Reassign…</Button>}
        </div>
      )}
    </article>
  );
}
