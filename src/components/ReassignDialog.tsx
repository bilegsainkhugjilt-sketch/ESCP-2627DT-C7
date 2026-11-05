// Choose another truck; warn before an infeasible choice (US-05, FR-12, FR-13).
import { useEffect, useRef, useState } from 'react';
import { checkReassign, type PlanContext } from '../logic/planner';
import type { Assignment, Job } from '../types/domain';
import { Button, PowertrainTag } from './ui';

interface Props {
  job: Job;
  assignments: Assignment[];
  ctx: PlanContext;
  onAssign: (truckId: string) => void;
  onClose: () => void;
}

export function ReassignDialog({ job, assignments, ctx, onAssign, onClose }: Props) {
  const current = assignments.find((a) => a.jobId === job.id)?.truckId ?? null;
  const [choice, setChoice] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const checks = ctx.trucks.map((t) => ({ truck: t, check: checkReassign(assignments, job.id, t.id, ctx) }));
  const selected = checks.find((c) => c.truck.id === choice);
  const warning = selected?.check.allowed ? selected.check.warning : null;

  // keep focus inside the dialog; Esc closes (design.md §3)
  useEffect(() => {
    const el = dialogRef.current;
    el?.querySelector<HTMLElement>('input:not([disabled])')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && el) {
        const f = Array.from(el.querySelectorAll<HTMLElement>('input:not([disabled]), button:not([disabled])'));
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className="dialog"
        role={warning ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby="reassign-title"
        aria-describedby={warning ? 'reassign-warning' : undefined}
      >
        <h2 id="reassign-title">Move {job.id} to another truck</h2>
        <p className="small muted" style={{ margin: 0 }}>
          {job.route}, {job.distanceKm} km, {(job.payloadKg / 1000).toFixed(1)} t, {job.windowStart}–{job.windowEnd}
        </p>
        <fieldset className="options">
          <legend className="sr-only">Choose a truck</legend>
          {checks.map(({ truck, check }) => {
            const disabled = !check.allowed || truck.id === current;
            const detail = truck.id === current
              ? 'Current choice'
              : !check.allowed
                ? check.warning
                : check.warning
                  ? 'Would end below its safety reserve'
                  : truck.powertrain === 'diesel'
                    ? 'Free at this time, no battery limit'
                    : `Can do it, ends with ${Math.round(check.evaluation.reserveAfterPercent ?? 0)}% charge${check.evaluation.breakCharge ? ' after a break charge' : ''}`;
            return (
              <label key={truck.id} className={`option ${disabled ? 'disabled' : ''}`}>
                <input type="radio" name="truck" value={truck.id} disabled={disabled} checked={choice === truck.id} onChange={() => setChoice(truck.id)} />
                <span>
                  <strong>{truck.name}</strong> <PowertrainTag powertrain={truck.powertrain} /> <span className="small">{truck.brand}</span>
                  <br />
                  <span className="detail">{detail}</span>
                </span>
              </label>
            );
          })}
        </fieldset>
        {warning && (
          <div id="reassign-warning" className="warning-box" role="alert">
            <strong>Warning:</strong> {warning}
          </div>
        )}
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!choice} onClick={() => choice && onAssign(choice)}>
            {warning ? 'Assign anyway' : 'Assign'}
          </Button>
        </div>
      </div>
    </div>
  );
}
