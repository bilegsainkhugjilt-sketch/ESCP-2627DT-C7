// A5 Weekly report for the head of operations (US-08, FR-19–FR-21, NFR-08).
import { KpiTile, PageHead, StatusBadge } from '../components/ui';
import { TODAY } from '../data/seedData';
import { history } from '../data/seedHistory';
import { weeklyReport } from '../logic/kpis';
import type { PlanContext } from '../logic/planner';
import type { Assignment } from '../types/domain';

const eur = (n: number) => `€ ${n.toLocaleString('en-GB')}`;

export function WeeklyReport({ ctx, assignments }: { ctx: PlanContext; assignments: Assignment[] }) {
  const r = weeklyReport(history, assignments, ctx, TODAY.split(' ').slice(0, 3).join(' '));
  return (
    <>
      <PageHead title="Weekly report · week 45" sub={`Fictional data · all savings are estimates · days included: ${r.days.join(', ')}`} />
      <div className="tiles">
        <KpiTile value={`${r.electricKm.toLocaleString('en-GB')} km`} label="driven electric" sub={`of ${r.fleetKm.toLocaleString('en-GB')} km fleet total`} />
        <KpiTile highlight value={`${Math.round(r.electricShare * 100)}%`} label="of fleet km electric" sub="target: +20% vs baseline (product.md §1.6)" />
        <KpiTile value={eur(r.tollSavedEur)} label="toll saved (est.)" sub="German rate by weight class" />
        <KpiTile value={eur(r.energySavedEur)} label="energy cost vs diesel (est.)" sub="saved compared with diesel fuel" />
      </div>
      <section className="panel" aria-labelledby="use-title">
        <h2 id="use-title">Electric km per truck: driven vs possible</h2>
        {r.perTruck.map((p) => (
          <div className="use-row" key={p.truck.id}>
            <strong>{p.truck.name}</strong>
            <div className="use-track" role="meter" aria-valuemin={0} aria-valuemax={p.possibleKm} aria-valuenow={p.drivenKm} aria-label={`${p.truck.name} ${p.drivenKm} of ${p.possibleKm} km`}>
              <div className={`use-fill ${p.underUsed ? 'under' : ''}`} style={{ width: `${p.possibleKm ? (p.drivenKm / p.possibleKm) * 100 : 0}%` }} />
            </div>
            <span className="num">{p.drivenKm} / {p.possibleKm} km</span>
            <span>{p.underUsed ? <StatusBadge tone="warning">Under-used</StatusBadge> : <StatusBadge tone="success">Well used</StatusBadge>}</span>
          </div>
        ))}
      </section>
      <p className="footnote">
        Today counts only assignments you have approved. Toll saved = electric toll-road km × diesel toll for that weight class (34.8 ct/km over 18 t, 17.8 ct/km for 7.5–12 t; e-trucks are toll-free until 30 June 2031). Energy: depot 0.24 €/kWh, public 0.49 €/kWh, vs diesel at an assumed 27 / 18 L per 100 km and 1.45 €/L. "Possible" km = what each truck's battery allowed that day. Under-used = below 60% of possible.
      </p>
    </>
  );
}
