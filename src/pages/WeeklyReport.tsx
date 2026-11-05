// A5 Weekly report for the head of operations (US-08, FR-19–FR-21, NFR-08).
// Leads with one plain statement, then three supporting figures, then each truck's use.
import { PageHead } from '../components/ui';
import { TODAY_SHORT } from '../data/seedData';
import { history } from '../data/seedHistory';
import { weeklyReport } from '../logic/kpis';
import type { PlanContext } from '../logic/planner';
import type { Assignment } from '../types/domain';

const eur = (n: number) => `€${n.toLocaleString('en-GB')}`;
const km = (n: number) => `${n.toLocaleString('en-GB')} km`;

export function WeeklyReport({ ctx, assignments }: { ctx: PlanContext; assignments: Assignment[] }) {
  const r = weeklyReport(history, assignments, ctx, TODAY_SHORT);
  const share = Math.round(r.electricShare * 100);
  const under = r.perTruck.filter((p) => p.underUsed).map((p) => p.truck.name);
  return (
    <>
      <PageHead title="Weekly report, week 45" sub={`Covers ${r.days.join(', ')}. Fictional data; savings are estimates.`} />

      <p className="statement">
        <b>{share}%</b> of this week's fleet kilometres were driven electric.
      </p>

      <div className="figures">
        <div><b>{km(r.electricKm)}</b><span>driven electric, of {km(r.fleetKm)} in total</span></div>
        <div><b>{eur(r.tollSavedEur)}</b><span>truck toll not paid (estimate)</span></div>
        <div><b>{eur(r.energySavedEur)}</b><span>saved on energy compared with diesel (estimate)</span></div>
      </div>

      <section className="panel" aria-labelledby="use-title">
        <h2 id="use-title">How much of each e-truck's battery was used</h2>
        <p className="muted small" style={{ margin: 0 }}>
          {under.length
            ? `${under.join(' and ')} drove less than 60% of what ${under.length === 1 ? 'its battery' : 'their batteries'} allowed. Give ${under.length === 1 ? 'it' : 'them'} longer jobs next week.`
            : 'Every e-truck used at least 60% of what its battery allowed.'}
        </p>
        {r.perTruck.map((p) => {
          const pct = p.possibleKm ? Math.round((p.drivenKm / p.possibleKm) * 100) : 0;
          return (
            <div className="use-row" key={p.truck.id}>
              <b>{p.truck.name}</b>
              <div className="use-track" role="meter" aria-valuemin={0} aria-valuemax={p.possibleKm} aria-valuenow={p.drivenKm} aria-label={`${p.truck.name}: ${p.drivenKm} of ${p.possibleKm} km`}>
                <div className="use-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="num">{p.drivenKm} of {p.possibleKm} km</span>
              <span className={`use-note ${p.underUsed ? 'under' : ''}`}>{p.underUsed ? `Under-used, ${pct}%` : `${pct}% used`}</span>
            </div>
          );
        })}
      </section>

      <p className="footnote">
        Today counts only jobs you approved. Toll = electric toll-road km × the diesel rate for that weight class (34.8 ct/km over 18 t, 17.8 ct/km for 7.5–12 t); e-trucks pay no German toll until 30 June 2031. Energy compares depot power at 0.24 €/kWh and public charging at 0.49 €/kWh with diesel at an assumed 27 or 18 litres per 100 km and 1.45 €/litre. Possible km = what each battery allowed that day.
      </p>
    </>
  );
}
