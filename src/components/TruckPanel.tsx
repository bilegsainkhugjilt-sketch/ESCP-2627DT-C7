// Truck detail panel for the A1 depot yard (US-01, FR-01–FR-03, FR-09).
// Shows the truck's state, what it does today (proposed vs approved, NFR-05), its charging and its week.
import { WEIGHT_CLASS_LABEL } from '../data/constants';
import type { ChargingSession } from '../logic/charging';
import type { TruckWeek } from '../logic/kpis';
import type { PlanContext } from '../logic/planner';
import { predictedRangeKm } from '../logic/range';
import type { Assignment, Truck } from '../types/domain';
import { PowertrainTag, StatusBadge, truckStatusBadge } from './ui';

function BatteryDial({ soc, reserve }: { soc: number; reserve: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const arc = 0.75; // 270° gauge
  const fill = (soc / 100) * arc * c;
  const res = (reserve / 100) * arc * c;
  return (
    <svg className="dial" viewBox="0 0 128 128" role="img" aria-label={`Battery ${soc}% charged, ${reserve}% kept as reserve`}>
      <g transform="rotate(135 64 64)">
        <circle cx="64" cy="64" r={r} className="dial-track" strokeDasharray={`${arc * c} ${c}`} />
        <circle cx="64" cy="64" r={r} className="dial-fill" strokeDasharray={`${fill} ${c}`} />
        <circle cx="64" cy="64" r={r} className="dial-reserve" strokeDasharray={`${res} ${c}`} />
      </g>
      <text x="64" y="66" textAnchor="middle" className="dial-num">{soc}<tspan className="dial-unit">%</tspan></text>
      <text x="64" y="86" textAnchor="middle" className="dial-label">charged</text>
    </svg>
  );
}

function statusOf(a: Assignment) {
  if (a.status === 'approved') return <StatusBadge tone="success">Approved</StatusBadge>;
  if (a.status === 'overridden') return <StatusBadge tone="warning">Changed by you</StatusBadge>;
  return <StatusBadge tone="action">Proposed</StatusBadge>;
}

export function TruckPanel({ truck, ctx, assignments, sessions, week, onClose }: {
  truck: Truck;
  ctx: PlanContext;
  assignments: Assignment[];
  sessions: ChargingSession[];
  week?: TruckWeek;
  onClose?: () => void;
}) {
  const ev = truck.powertrain === 'electric';
  const own = assignments
    .filter((a) => a.truckId === truck.id)
    .sort((x, y) => (ctx.jobs.find((j) => j.id === x.jobId)!.windowStart < ctx.jobs.find((j) => j.id === y.jobId)!.windowStart ? -1 : 1));
  const driver = ctx.drivers.find((d) => d.id === truck.driverId);
  const range = ev ? Math.round(predictedRangeKm(truck, ctx.scenario)) : null;

  return (
    <section className="truck-panel" aria-labelledby="truck-panel-title">
      <header className="tp-head">
        <div>
          <h2 id="truck-panel-title">{truck.id}</h2>
          <p className="tp-sub">{truck.brand}, {WEIGHT_CLASS_LABEL[truck.weightClass]}, carries up to {(truck.capacityKg / 1000).toFixed(0)} t</p>
        </div>
        {onClose && <button type="button" className="tp-close" onClick={onClose} aria-label={`Close ${truck.id} details`}>×</button>}
      </header>

      <div className="tp-tags"><PowertrainTag powertrain={truck.powertrain} />{truckStatusBadge(truck.status)}</div>

      {ev ? (
        <div className="tp-battery">
          <BatteryDial soc={truck.socPercent!} reserve={truck.reservePercent!} />
          <dl className="tp-facts">
            <div><dt>Range today</dt><dd>{range} km</dd></div>
            <div><dt>Battery</dt><dd>{truck.batteryKWh} kWh</dd></div>
            <div><dt>Reserve kept</dt><dd>{truck.reservePercent}%</dd></div>
            <div><dt>Driver</dt><dd>{driver?.name}, until {driver?.shiftEnd}</dd></div>
          </dl>
        </div>
      ) : (
        <dl className="tp-facts tp-facts-wide">
          <div><dt>Fuel</dt><dd>Diesel, pays full road toll</dd></div>
          <div><dt>Driver</dt><dd>{driver?.name}, until {driver?.shiftEnd}</dd></div>
        </dl>
      )}

      <h3>Today</h3>
      {own.length === 0 ? (
        <p className="tp-empty">{assignments.length === 0 ? 'No plan yet. Make a plan on the Daily plan page.' : 'No jobs for this truck today.'}</p>
      ) : (
        <ul className="tp-jobs">
          {own.map((a) => {
            const job = ctx.jobs.find((j) => j.id === a.jobId)!;
            return (
              <li key={a.jobId} className={a.status === 'proposed' ? 'pencil' : 'ink'}>
                <div className="tp-job-top"><b>{job.id}</b><span>{job.windowStart}–{job.windowEnd}</span>{statusOf(a)}</div>
                <div className="tp-job-route">{job.route}, {job.distanceKm} km</div>
                {ev && a.reserveAfterPercent !== undefined && (
                  <div className="tp-job-meta">Back with {Math.round(a.reserveAfterPercent)}% battery{a.breakCharge ? `, charges in the driver break ${a.breakCharge.start}–${a.breakCharge.end}` : ''}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {ev && sessions.length > 0 && (
        <>
          <h3>Charging</h3>
          <ul className="tp-charge">
            {sessions.map((s, i) => (
              <li key={i}>
                <span className={`tp-dot ${s.kind}`} aria-hidden="true" />
                <span>{s.start}–{s.end}</span>
                <span>{s.kind === 'depot' ? 'Depot' : 'Public'}, {Math.round(s.energyKWh)} kWh</span>
                {s.warning && <span className="tp-warn">{s.warning}</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {ev && week && (
        <>
          <h3>This week</h3>
          <div className="tp-week">
            <div className="tp-week-bar" role="img" aria-label={`Drove ${Math.round(week.drivenKm)} of ${Math.round(week.possibleKm)} possible km this week`}>
              <i style={{ width: `${Math.min(100, (week.drivenKm / Math.max(1, week.possibleKm)) * 100)}%` }} />
            </div>
            <p>{Math.round(week.drivenKm)} of {Math.round(week.possibleKm)} possible km{week.underUsed ? '. Could take more work.' : '.'}</p>
          </div>
        </>
      )}
    </section>
  );
}
