// A1 Fleet overview (US-01, FR-01–FR-03): the night depot in 3D, a detail panel per truck, and the table.
import { Component, lazy, Suspense, useMemo, useState, type ReactNode } from 'react';
import { TruckPanel } from '../components/TruckPanel';
import { PageHead, PowertrainTag, RangeBar, truckStatusBadge } from '../components/ui';
import { WEIGHT_CLASS_LABEL } from '../data/constants';
import { TODAY_SHORT } from '../data/seedData';
import { history } from '../data/seedHistory';
import { buildChargingSchedule } from '../logic/charging';
import { weeklyReport } from '../logic/kpis';
import type { PlanContext } from '../logic/planner';
import { predictedRangeKm } from '../logic/range';
import type { Assignment } from '../types/domain';

const DepotYard3D = lazy(() => import('../components/DepotYard3D'));

class YardBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <div className="yard-fallback">The 3D depot needs WebGL, which this browser has switched off. Pick a truck from the list below.</div>
      : this.props.children;
  }
}

export function FleetOverview({ ctx, assignments }: { ctx: PlanContext; assignments: Assignment[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const electric = ctx.trucks.filter((t) => t.powertrain === 'electric');
  const brands = new Set(electric.map((t) => t.brand)).size;
  const sessions = useMemo(() => buildChargingSchedule(assignments, ctx), [assignments, ctx]);
  const week = useMemo(() => weeklyReport(history, assignments, ctx, TODAY_SHORT), [assignments, ctx]);
  const selected = ctx.trucks.find((t) => t.id === selectedId) ?? null;

  return (
    <>
      <PageHead
        title="Fleet overview"
        sub={`${ctx.trucks.length} trucks in the depot tonight: ${electric.length} electric from ${brands} brands and ${ctx.trucks.length - electric.length} diesel. Click a truck to see what it can do today.`}
      />

      <div className="yard">
        <div className="yard-stage">
          <YardBoundary>
            <Suspense fallback={<div className="yard-fallback">Opening the depot…</div>}>
              <DepotYard3D trucks={ctx.trucks} selectedId={selectedId} onSelect={setSelectedId} />
            </Suspense>
          </YardBoundary>
          <p className="yard-hint" aria-hidden="true">Swipe or scroll to slide along the trucks. Drag to look around. Pinch to zoom.</p>
        </div>
        <aside className="yard-side" aria-live="polite">
          {selected ? (
            <TruckPanel
              truck={selected}
              ctx={ctx}
              assignments={assignments}
              sessions={sessions.filter((s) => s.truckId === selected.id)}
              week={week.perTruck.find((w) => w.truck.id === selected.id)}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div className="yard-intro">
              <h2>Night depot, {TODAY_SHORT}</h2>
              <p>Neon outlines are electric trucks plugged in at their chargers. Grey outlines are diesel.</p>
              <dl className="tp-facts tp-facts-wide">
                <div><dt>Charged on average</dt><dd>{Math.round(electric.reduce((s, t) => s + (t.socPercent ?? 0), 0) / electric.length)}%</dd></div>
                <div><dt>Electric range tonight</dt><dd>{Math.round(electric.reduce((s, t) => s + predictedRangeKm(t, ctx.scenario), 0))} km</dd></div>
                <div><dt>Jobs planned</dt><dd>{assignments.filter((a) => a.truckId).length} of {ctx.jobs.length}</dd></div>
              </dl>
              <p className="muted">Select a truck to see its battery, today's jobs, charging and week.</p>
            </div>
          )}
        </aside>
      </div>

      <div className="truck-picker" role="group" aria-label="Choose a truck">
        {ctx.trucks.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === selectedId}
            className={t.powertrain === 'electric' ? 'ev' : ''}
            onClick={() => setSelectedId(t.id === selectedId ? null : t.id)}
          >
            <b>{t.id}</b>
            <span>{t.powertrain === 'electric' ? `${t.socPercent}%` : 'Diesel'}</span>
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <caption className="sr-only">Trucks with battery level and predicted range</caption>
          <thead>
            <tr>
              <th scope="col">Truck</th>
              <th scope="col">Brand</th>
              <th scope="col">Powertrain</th>
              <th scope="col">Weight class</th>
              <th scope="col">Capacity</th>
              <th scope="col">Battery / predicted range</th>
              <th scope="col">Status</th>
              <th scope="col">Jobs today</th>
            </tr>
          </thead>
          <tbody>
            {ctx.trucks.map((t) => {
              const range = predictedRangeKm(t, ctx.scenario);
              const jobs = assignments.filter((a) => a.truckId === t.id).map((a) => a.jobId);
              return (
                <tr key={t.id} aria-selected={t.id === selectedId} className={t.id === selectedId ? 'selected' : ''}>
                  <td className="id">{t.name}</td>
                  <td>{t.brand}</td>
                  <td><PowertrainTag powertrain={t.powertrain} /></td>
                  <td>{WEIGHT_CLASS_LABEL[t.weightClass]}</td>
                  <td>{(t.capacityKg / 1000).toFixed(1).replace(/\.0$/, '')} t</td>
                  <td>
                    {t.powertrain === 'electric'
                      ? <RangeBar socPercent={t.socPercent!} reservePercent={t.reservePercent!} rangeKm={range} low={t.socPercent! < 40} />
                      : <span className="muted">—</span>}
                  </td>
                  <td>{truckStatusBadge(t.status)}</td>
                  <td>{jobs.length ? jobs.join(', ') : <span className="muted">none</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="footnote">
        Range is an estimate for an empty truck at {ctx.scenario.temperatureC} °C, counting only the charge above the 15% safety reserve. Heavier loads and colder weather shorten it. All trucks and figures are fictional. 3D truck models: Kenney Car Kit (CC0).
      </p>
    </>
  );
}
