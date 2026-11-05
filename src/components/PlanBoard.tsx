// Dispatch board (A3 hero; US-03–US-05, FR-09, NFR-05).
// One lane per truck, jobs placed at their time windows. Proposed jobs are hatched ("pencilled in"),
// approved jobs are solid ("inked"). On electric lanes a line traces the battery level through the day,
// against the dashed 15% safety reserve.
import type { PlanContext } from '../logic/planner';
import { buildChargingSchedule } from '../logic/charging';
import { toMin } from '../logic/time';
import type { Assignment, Truck } from '../types/domain';
import { WEIGHT_CLASS_LABEL } from '../data/constants';

const FROM = 5 * 60;
const TO = 19 * 60;
const x = (min: number) => ((Math.min(Math.max(min, FROM), TO) - FROM) / (TO - FROM)) * 100;
const HOURS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

interface Props {
  assignments: Assignment[];
  ctx: PlanContext;
  selectedJobId: string | null;
  onSelect: (jobId: string) => void;
}

/** Battery level through the day as [minute, percent] points. */
function batteryTrace(truck: Truck, own: Assignment[], ctx: PlanContext): [number, number][] {
  const b = truck.batteryKWh ?? 1;
  const pts: [number, number][] = [[FROM, truck.socPercent ?? 0]];
  let soc = truck.socPercent ?? 0;
  const sorted = own
    .map((a) => ({ a, job: ctx.jobs.find((j) => j.id === a.jobId)! }))
    .sort((p, q) => toMin(p.job.windowStart) - toMin(q.job.windowStart));
  for (const { a, job } of sorted) {
    const s = toMin(job.windowStart);
    const e = toMin(job.windowEnd);
    const after = a.reserveAfterPercent ?? soc;
    pts.push([s, soc]);
    if (a.breakCharge) {
      const add = (a.breakCharge.energyKWh / b) * 100;
      const bs = toMin(a.breakCharge.start);
      const be = toMin(a.breakCharge.end);
      const drop = soc + add - after;
      const atBreak = soc - drop * ((bs - s) / Math.max(1, e - s - (be - bs)));
      pts.push([bs, atBreak], [be, atBreak + add]);
    }
    pts.push([e, after]);
    soc = after;
  }
  const depot = buildChargingSchedule(own, ctx).find((c) => c.truckId === truck.id && c.kind === 'depot');
  if (depot) pts.push([toMin(depot.start), soc], [toMin(depot.end), 100]);
  else pts.push([TO, soc]);
  return pts;
}

export function PlanBoard({ assignments, ctx, selectedJobId, onSelect }: Props) {
  const unassigned = assignments.filter((a) => !a.truckId);
  const lanes = [...ctx.trucks.filter((t) => t.status === 'available'), ...ctx.trucks.filter((t) => t.status !== 'available')];

  const block = (a: Assignment, truck?: Truck) => {
    const job = ctx.jobs.find((j) => j.id === a.jobId)!;
    const s = toMin(job.windowStart);
    const e = toMin(job.windowEnd);
    const kind = !truck ? 'none' : truck.powertrain === 'electric' ? 'ev' : 'diesel';
    const ink = a.status === 'proposed' ? 'pencil' : 'ink';
    const cls = ['block', ink, kind, a.status === 'overridden' && 'changed', a.replaces && 'replaces'].filter(Boolean).join(' ');
    const town = job.route.split(' → ')[1] ?? job.route;
    return (
      <button
        key={a.jobId}
        type="button"
        className={cls}
        style={{ left: `${x(s)}%`, width: `${x(e) - x(s)}%` }}
        aria-pressed={selectedJobId === a.jobId}
        aria-label={`${job.id} to ${town}, ${job.windowStart} to ${job.windowEnd}, ${a.status === 'proposed' ? 'proposed' : 'approved'}${truck ? ` on ${truck.name}` : ', no truck'}`}
        onClick={() => onSelect(a.jobId)}
      >
        {job.id}<span className="where">{town}</span>
      </button>
    );
  };

  return (
    <section className="board" aria-label="Dispatch board">
      <div className="board-legend" aria-hidden="true">
        <span><i className="lg-pencil" />Proposed (pencilled in)</span>
        <span><i className="lg-ink" />Approved</span>
        <span><i className="lg-line" />Battery level</span>
        <span><i className="lg-reserve" />15% safety reserve</span>
        <span>Select a job to see why</span>
      </div>
      <div className="axis" aria-hidden="true">
        <span />
        <div className="ticks">
          {HOURS.map((h) => <span key={h} style={{ left: `${x(h * 60)}%` }}>{String(h).padStart(2, '0')}:00</span>)}
        </div>
      </div>
      {lanes.map((t) => {
        const own = assignments.filter((a) => a.truckId === t.id);
        const ev = t.powertrain === 'electric';
        const trace = ev && t.status === 'available' ? batteryTrace(t, own, ctx) : null;
        return (
          <div className={`lane ${t.status !== 'available' ? 'off' : ''}`} key={t.id}>
            <div className="lane-label">
              <b><i className={ev ? 'ev' : ''} />{t.name}</b>
              <span>
                {t.status !== 'available' ? 'In the workshop today' : ev ? `${t.socPercent}% charged, ${WEIGHT_CLASS_LABEL[t.weightClass]}` : `Diesel, ${WEIGHT_CLASS_LABEL[t.weightClass]}`}
              </span>
            </div>
            <div className="track">
              {own.map((a) => block(a, t))}
              {own.filter((a) => a.breakCharge).map((a) => (
                <div
                  key={`c-${a.jobId}`}
                  className={`charge-mark ${a.breakCharge!.endsAfterShift ? 'late' : ''}`}
                  style={{ left: `${x(toMin(a.breakCharge!.start))}%`, width: `${x(toMin(a.breakCharge!.end)) - x(toMin(a.breakCharge!.start))}%` }}
                  title={`Charging ${a.breakCharge!.start}–${a.breakCharge!.end}`}
                >
                  {a.breakCharge!.endsAfterShift ? 'LATE' : 'CHARGE'}
                </div>
              ))}
              {trace && (
                <div className="battery" aria-hidden="true">
                <div className="reserve" style={{ top: `${100 - (t.reservePercent ?? 15)}%` }} />
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points={trace.map(([m, p]) => `${x(m)},${100 - Math.max(0, Math.min(100, p))}`).join(' ')}
                    fill="none" stroke="var(--color-surface)" strokeWidth="5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                  <polyline points={trace.map(([m, p]) => `${x(m)},${100 - Math.max(0, Math.min(100, p))}`).join(' ')}
                    fill="none" stroke="var(--color-text)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {unassigned.length > 0 && (
        <div className="lane">
          <div className="lane-label"><b>No truck</b><span>Needs manual planning</span></div>
          <div className="track">{unassigned.map((a) => block(a))}</div>
        </div>
      )}
    </section>
  );
}
