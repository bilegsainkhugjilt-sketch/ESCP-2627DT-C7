// A4 Charging schedule (US-06, FR-14–FR-16).
import { PageHead, StatusBadge } from '../components/ui';
import { buildChargingSchedule } from '../logic/charging';
import type { PlanContext } from '../logic/planner';
import { toMin } from '../logic/time';
import type { Assignment } from '../types/domain';

const FROM = 5 * 60;
const TO = 21 * 60;
const pct = (hhmm: string) => ((Math.min(Math.max(toMin(hhmm), FROM), TO) - FROM) / (TO - FROM)) * 100;
const hours = [5, 7, 9, 11, 13, 15, 17, 19, 21];

export function Charging({ ctx, assignments }: { ctx: PlanContext; assignments: Assignment[] }) {
  const sessions = buildChargingSchedule(assignments, ctx);
  const warnings = sessions.filter((s) => s.warning);
  const electric = ctx.trucks.filter((t) => t.powertrain === 'electric');
  const publicCharger = ctx.chargers.find((c) => c.kind === 'public')!;

  return (
    <>
      <PageHead
        title="Charging schedule"
        sub="Trucks charge at the depot first. Public charging is only planned inside the driver's legal 45-minute break (Reg. 561/2006)."
        actions={!publicCharger.available ? <StatusBadge tone="warning">Public charger out of service</StatusBadge> : undefined}
      />
      {assignments.length === 0 ? (
        <div className="empty"><h2>No charging planned yet</h2><p>Generate a plan on the Daily plan screen; charging follows from the jobs you approve.</p></div>
      ) : (
        <>
          <div className="timeline" role="img" aria-label="Charging timeline per electric truck; the same information is listed below as text">
            <div className="tl-head">
              <span />
              <div className="hours">{hours.map((h) => <span key={h} style={{ left: `${((h * 60 - FROM) / (TO - FROM)) * 100}%` }}>{String(h).padStart(2, '0')}:00</span>)}</div>
            </div>
            {electric.map((t) => (
              <div className="tl-row" key={t.id}>
                <span className="name">{t.name}</span>
                <div className="tl-track">
                  {assignments.filter((a) => a.truckId === t.id).map((a) => {
                    const j = ctx.jobs.find((x) => x.id === a.jobId)!;
                    return <div key={a.jobId} className="bar bar-job" style={{ left: `${pct(j.windowStart)}%`, width: `${pct(j.windowEnd) - pct(j.windowStart)}%` }}>{j.id}</div>;
                  })}
                  {sessions.filter((s) => s.truckId === t.id).map((s, i) => (
                    <div
                      key={i}
                      className={`bar ${s.warning ? 'bar-warn' : s.kind === 'depot' ? 'bar-depot' : 'bar-public'}`}
                      style={{ left: `${pct(s.start)}%`, width: `${Math.max(pct(s.end) - pct(s.start), 1.2)}%` }}
                      title={`${s.label}: ${s.start}–${s.end}, ${Math.round(s.energyKWh)} kWh`}
                    >
                      {s.kind === 'depot' ? 'Depot' : s.warning ? 'Late' : 'Break'}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="row">
            <StatusBadge tone="neutral">Job</StatusBadge>
            <StatusBadge tone="dark">Depot charge (0.24 €/kWh)</StatusBadge>
            <StatusBadge tone="accent">Public charge in 45-min break (0.49 €/kWh)</StatusBadge>
            <StatusBadge tone="warning">Needs attention</StatusBadge>
          </div>

          {warnings.map((w, i) => (
            <div className="banner" key={i} role="status">
              <strong>{w.truckId}: {w.warning}</strong> Suggestion: {w.suggestion}
            </div>
          ))}
          {warnings.length === 0 && <div className="banner info">No charging conflicts: all public charging fits inside drivers' shifts.</div>}

          <div className="table-wrap">
            <table>
              <caption className="sr-only">Charging sessions as text</caption>
              <thead><tr><th scope="col">Truck</th><th scope="col">Type</th><th scope="col">Time</th><th scope="col">Energy</th><th scope="col">Note</th></tr></thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={i}>
                    <td className="id">{s.truckId}</td>
                    <td>{s.kind === 'depot' ? 'Depot' : 'Public, in driver break'}</td>
                    <td>{s.start}–{s.end}</td>
                    <td>{Math.round(s.energyKWh)} kWh</td>
                    <td>{s.warning ?? s.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
